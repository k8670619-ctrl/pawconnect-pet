import secrets
import re
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import (
    User, UserProfile, UserSession, EmailVerification, PhoneVerification,
    OTPCode, RefreshToken, LoginHistory, TrustedDevice, VerificationDocument
)
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token

logger = logging.getLogger("pawconnect.auth_service")

def get_utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

class AuthService:

    @staticmethod
    def validate_password_strength(password: str) -> Tuple[bool, str]:
        if not isinstance(password, str) or len(password) < 8:
            return False, "Password must be at least 8 characters long."
        if not re.search(r"[A-Z]", password):
            return False, "Password must contain at least one uppercase letter (A-Z)."
        if not re.search(r"[a-z]", password):
            return False, "Password must contain at least one lowercase letter (a-z)."
        if not re.search(r"[0-9]", password):
            return False, "Password must contain at least one number (0-9)."
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return False, "Password must contain at least one special character (!@#$%^&*)."
        return True, "Strong password"

    @staticmethod
    def generate_otp(length: int = 6) -> str:
        return "".join([str(secrets.randbelow(10)) for _ in range(length)])

    @staticmethod
    def check_availability(db: Session, field: str, value: str) -> Tuple[bool, str]:
        if field == "username":
            exists = db.query(User).filter(User.username == value).first()
            if exists:
                return False, f"Username '{value}' is already taken."
            return True, f"Username '{value}' is available."

        elif field == "email":
            exists = db.query(User).filter(User.email == value).first()
            if exists:
                return False, f"Email '{value}' is already registered."
            return True, f"Email '{value}' is available."

        elif field == "phone":
            exists = db.query(User).filter(User.phone == value).first()
            if exists:
                return False, f"Phone number '{value}' is already registered."
            return True, f"Phone number '{value}' is available."

        return False, "Invalid field for availability check."

    @staticmethod
    def register_user(db: Session, user_data: Dict[str, Any]) -> Tuple[Optional[User], str]:
        raw_password = str(user_data.get("password", ""))
        valid, msg = AuthService.validate_password_strength(raw_password)
        if not valid:
            return None, msg

        if user_data.get("username"):
            avail, msg = AuthService.check_availability(db, "username", str(user_data["username"]))
            if not avail:
                return None, msg

        avail, msg = AuthService.check_availability(db, "email", str(user_data["email"]))
        if not avail:
            return None, msg

        if user_data.get("phone"):
            avail, msg = AuthService.check_availability(db, "phone", str(user_data["phone"]))
            if not avail:
                return None, msg

        hashed_pwd = get_password_hash(raw_password)

        user = User(
            full_name=str(user_data["full_name"]),
            username=user_data.get("username"),
            email=str(user_data["email"]),
            phone=user_data.get("phone"),
            hashed_password=hashed_pwd,
            role=user_data.get("role", "user"),
            is_email_verified=False,
            is_phone_verified=False,
            verification_status="unverified"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        profile = UserProfile(user_id=user.id)
        db.add(profile)

        otp_code = AuthService.generate_otp(6)
        email_verify = EmailVerification(
            email=user.email,
            code=otp_code,
            token=secrets.token_hex(20),
            expires_at=get_utc_now() + timedelta(minutes=15)
        )
        db.add(email_verify)
        db.commit()

        return user, "User registered successfully. Please verify your email with OTP: " + otp_code

    @staticmethod
    def authenticate_user(db: Session, email_or_phone: str, password: str, ip_address: str = "127.0.0.1", user_agent: str = "Browser") -> Tuple[Optional[User], str, Dict[str, Any]]:
        user = db.query(User).filter((User.email == email_or_phone) | (User.phone == email_or_phone)).first()

        history = LoginHistory(
            user_id=user.id if user else None,
            email_or_phone=email_or_phone,
            ip_address=ip_address,
            user_agent=user_agent
        )

        if not user or not user.hashed_password:
            exact_reason = f"User not found for identifier '{email_or_phone}'"
            logger.warning("❌ Login Failure: %s", exact_reason)
            history.status = "failed"
            history.failure_reason = exact_reason
            db.add(history)
            db.commit()
            return None, "Invalid email or password.", {}

        if not user.is_active:
            exact_reason = f"Account for '{email_or_phone}' is disabled/inactive"
            logger.warning("❌ Login Failure: %s", exact_reason)
            history.status = "failed"
            history.failure_reason = exact_reason
            db.add(history)
            db.commit()
            return None, "Invalid email or password.", {}

        if user.lockout_until and user.lockout_until > get_utc_now():
            exact_reason = f"Account '{email_or_phone}' is locked until {user.lockout_until}"
            logger.warning("❌ Login Failure: %s", exact_reason)
            history.status = "locked"
            history.failure_reason = exact_reason
            db.add(history)
            db.commit()
            return None, "Invalid email or password.", {}

        if not verify_password(str(password), str(user.hashed_password)):
            user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
            if user.failed_login_attempts >= 5:
                user.lockout_until = get_utc_now() + timedelta(minutes=15)
                exact_reason = f"Incorrect password for '{email_or_phone}'. Account locked (5 failed attempts)."
                logger.warning("❌ Login Failure: %s", exact_reason)
                history.status = "locked"
                history.failure_reason = exact_reason
                db.add(history)
                db.commit()
                return None, "Invalid email or password.", {"failed_attempts": user.failed_login_attempts}
            else:
                exact_reason = f"Incorrect password for '{email_or_phone}' (Attempt {user.failed_login_attempts}/5)"
                logger.warning("❌ Login Failure: %s", exact_reason)
                history.status = "failed"
                history.failure_reason = exact_reason
                db.add(history)
                db.commit()
                return None, "Invalid email or password.", {"failed_attempts": user.failed_login_attempts}

        user.failed_login_attempts = 0
        user.lockout_until = None

        if user.two_factor_enabled:
            history.status = "2fa_required"
            db.add(history)
            db.commit()

            otp = AuthService.generate_otp(6)
            otp_record = OTPCode(
                target=user.email,
                otp_type="2fa",
                code=otp,
                expires_at=get_utc_now() + timedelta(minutes=5)
            )
            db.add(otp_record)
            db.commit()

            return user, "2FA OTP required to complete login.", {"two_factor_required": True, "otp_hint": otp}

        history.status = "success"
        db.add(history)
        db.commit()

        session_token = secrets.token_hex(32)
        session = UserSession(
            user_id=user.id,
            session_token=session_token,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=get_utc_now() + timedelta(days=7)
        )
        db.add(session)
        db.commit()

        return user, "Login successful.", {"two_factor_required": False, "session_token": session_token}

    @staticmethod
    def verify_email(db: Session, email: str, code_or_token: str) -> Tuple[bool, str]:
        record = db.query(EmailVerification).filter(
            EmailVerification.email == email,
            (EmailVerification.code == code_or_token) | (EmailVerification.token == code_or_token),
            EmailVerification.is_used == False,
            EmailVerification.expires_at > get_utc_now()
        ).first()

        if not record:
            return False, "Invalid or expired verification code."

        record.is_used = True
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.is_email_verified = True

        db.commit()
        return True, "Email verified successfully."

    @staticmethod
    def verify_phone(db: Session, phone: str, otp_code: str) -> Tuple[bool, str]:
        record = db.query(PhoneVerification).filter(
            PhoneVerification.phone == phone,
            PhoneVerification.otp_code == otp_code,
            PhoneVerification.is_verified == False,
            PhoneVerification.expires_at > get_utc_now()
        ).first()

        if not record:
            return False, "Invalid or expired phone OTP."

        record.is_verified = True
        user = db.query(User).filter(User.phone == phone).first()
        if user:
            user.is_phone_verified = True

        db.commit()
        return True, "Phone number verified successfully."

    @staticmethod
    def request_forgot_password(db: Session, email: str) -> Tuple[bool, str]:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return True, "If the email is registered, a password reset link has been sent."

        otp = AuthService.generate_otp(6)
        reset_record = OTPCode(
            target=email,
            otp_type="password_reset",
            code=otp,
            expires_at=get_utc_now() + timedelta(minutes=15)
        )
        db.add(reset_record)
        db.commit()

        return True, f"Password reset OTP generated: {otp} (expires in 15 minutes)"

    @staticmethod
    def reset_password(db: Session, token_or_otp: str, new_password: str) -> Tuple[bool, str]:
        valid, msg = AuthService.validate_password_strength(new_password)
        if not valid:
            return False, msg

        otp_record = db.query(OTPCode).filter(
            OTPCode.otp_type == "password_reset",
            OTPCode.code == token_or_otp,
            OTPCode.is_used == False,
            OTPCode.expires_at > get_utc_now()
        ).first()

        if not otp_record:
            return False, "Invalid or expired password reset OTP."

        otp_record.is_used = True
        user = db.query(User).filter(User.email == otp_record.target).first()
        if user:
            user.hashed_password = get_password_hash(new_password)
            user.failed_login_attempts = 0
            user.lockout_until = None

            db.query(UserSession).filter(UserSession.user_id == user.id).update({"is_active": False})

        db.commit()
        return True, "Password reset successfully. Please log in with your new password."
