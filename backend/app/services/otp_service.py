import secrets
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta, timezone
from typing import Tuple, Optional, Dict, Any
import requests
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import OTPCode, User
from app.core.security import create_access_token, create_refresh_token

logger = logging.getLogger("pawconnect.otp_service")
logging.basicConfig(level=logging.INFO)

class OTPService:
    @staticmethod
    def generate_secure_otp(length: int = 6) -> str:
        """Generates a cryptographically secure 6-digit OTP code."""
        return "".join([str(secrets.randbelow(10)) for _ in range(length)])

    @staticmethod
    def send_email_otp(email: str, otp_code: str) -> bool:
        """Sends OTP via Resend API, SMTP, or logs to console in development mode."""
        subject = "Your PawConnect AI Verification Code"
        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #059669; margin-bottom: 8px;">PawConnect AI</h2>
            <p style="color: #334155; font-size: 14px;">Your 6-digit verification OTP code is:</p>
            <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; text-align: center; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #047857; margin: 15px 0;">
                {otp_code}
            </div>
            <p style="color: #64748b; font-size: 12px;">This code will expire in 5 minutes. Do not share this code with anyone.</p>
        </div>
        """

        # 1. Resend API Integration
        if settings.RESEND_API_KEY:
            try:
                res = requests.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "from": settings.SMTP_FROM_EMAIL,
                        "to": [email],
                        "subject": subject,
                        "html": html_body,
                    },
                    timeout=5,
                )
                if res.status_code in (200, 201):
                    logger.info("✅ Resend OTP email delivered to %s", email)
                    return True
                else:
                    logger.warning("⚠️ Resend API failed status %s: %s", res.status_code, res.text)
            except Exception as e:
                logger.error("❌ Resend API exception: %s", str(e))

        # 2. SMTP Integration
        if settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD:
            try:
                msg = MIMEMultipart()
                msg["From"] = settings.SMTP_FROM_EMAIL
                msg["To"] = email
                msg["Subject"] = subject
                msg.attach(MIMEText(html_body, "html"))

                server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=5)
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
                server.quit()
                logger.info("✅ SMTP OTP email delivered to %s", email)
                return True
            except Exception as e:
                logger.error("❌ SMTP delivery failed: %s", str(e))

        # 3. Development Fallback (Console Logger)
        print("\n" + "=" * 60)
        print(f"🔑 [DEV MODE] EMAIL OTP for {email}: {otp_code}")
        print("=" * 60 + "\n")
        logger.info("🔑 [DEV MODE] EMAIL OTP for %s: %s", email, otp_code)
        return True

    @staticmethod
    def send_sms_otp(phone: str, otp_code: str) -> bool:
        """Sends OTP via Twilio or MSG91 with graceful failure logging and dev fallback."""
        message_text = f"Your PawConnect AI verification code is {otp_code}. Valid for 5 minutes."

        # 1. Twilio Integration
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_PHONE_NUMBER:
            try:
                url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
                res = requests.post(
                    url,
                    auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
                    data={
                        "From": settings.TWILIO_PHONE_NUMBER,
                        "To": phone,
                        "Body": message_text,
                    },
                    timeout=5,
                )
                if res.status_code in (200, 201):
                    logger.info("✅ Twilio SMS OTP sent to %s", phone)
                    return True
                else:
                    logger.warning("⚠️ Twilio SMS failed: %s", res.text)
            except Exception as e:
                logger.error("❌ Twilio exception: %s", str(e))

        # 2. MSG91 Integration
        if settings.MSG91_AUTH_KEY and settings.MSG91_TEMPLATE_ID:
            try:
                res = requests.post(
                    "https://api.msg91.com/api/v5/otp",
                    headers={"authkey": settings.MSG91_AUTH_KEY, "Content-Type": "application/json"},
                    json={
                        "template_id": settings.MSG91_TEMPLATE_ID,
                        "mobile": phone.replace("+", ""),
                        "otp": otp_code,
                    },
                    timeout=5,
                )
                if res.status_code == 200:
                    logger.info("✅ MSG91 SMS OTP sent to %s", phone)
                    return True
                else:
                    logger.warning("⚠️ MSG91 SMS failed: %s", res.text)
            except Exception as e:
                logger.error("❌ MSG91 exception: %s", str(e))

        # 3. Development Fallback (Console Logger)
        print("\n" + "=" * 60)
        print(f"🔑 [DEV MODE] SMS OTP for {phone}: {otp_code}")
        print("=" * 60 + "\n")
        logger.info("🔑 [DEV MODE] SMS OTP for %s: %s", phone, otp_code)
        return True

    @classmethod
    def send_otp(cls, db: Session, target: str, channel: str = "email") -> Tuple[bool, str, Dict[str, Any]]:
        """
        Generates OTP, enforces 60s cooldown, stores OTP with 5m expiry,
        sends via specified channel (email or phone), and returns status details.
        """
        now = datetime.now(timezone.utc).replace(tzinfo=None)

        # Check for 60-second cooldown on recent unused OTP for this target
        recent_otp = db.query(OTPCode).filter(
            OTPCode.target == target,
            OTPCode.is_used == False,
            OTPCode.expires_at > now
        ).order_by(OTPCode.id.desc()).first()

        if recent_otp:
            time_since_creation = (now - (recent_otp.expires_at - timedelta(minutes=settings.OTP_EXPIRY_MINUTES))).total_seconds()
            if time_since_creation < settings.OTP_COOLDOWN_SECONDS:
                remaining_seconds = int(settings.OTP_COOLDOWN_SECONDS - time_since_creation)
                return False, f"Please wait {remaining_seconds} seconds before requesting a new OTP.", {
                    "cooldown_remaining": remaining_seconds,
                    "cooldown_active": True
                }

        otp_code = cls.generate_secure_otp(6)
        expires_at = now + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)

        otp_record = OTPCode(
            target=target,
            otp_type="email_verification" if "@" in target or channel == "email" else "phone_verification",
            code=otp_code,
            expires_at=expires_at,
            is_used=False
        )
        db.add(otp_record)
        db.commit()

        # Dispatch via requested channel
        if "@" in target or channel == "email":
            cls.send_email_otp(target, otp_code)
        else:
            cls.send_sms_otp(target, otp_code)

        return True, f"6-digit OTP code sent to {target} (expires in {settings.OTP_EXPIRY_MINUTES} mins).", {
            "target": target,
            "channel": channel,
            "otp_hint": otp_code,  # For testing/dev
            "cooldown_seconds": settings.OTP_COOLDOWN_SECONDS
        }

    @classmethod
    def verify_otp(cls, db: Session, target: str, otp_code: str) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        """
        Verifies 6-digit OTP code, marks OTP as used, marks user as verified,
        and returns JWT session for auto-login.
        """
        now = datetime.now(timezone.utc).replace(tzinfo=None)

        record = db.query(OTPCode).filter(
            OTPCode.target == target,
            OTPCode.code == otp_code,
            OTPCode.is_used == False,
            OTPCode.expires_at > now
        ).first()

        if not record:
            return False, "Invalid or expired 6-digit OTP code.", None

        record.is_used = True

        user = db.query(User).filter((User.email == target) | (User.phone == target)).first()
        if user:
            if "@" in target:
                user.is_email_verified = True
            else:
                user.is_phone_verified = True
            if user.is_email_verified or user.is_phone_verified:
                user.verification_status = "verified"

        db.commit()

        if not user:
            return True, "OTP verified successfully.", None

        db.refresh(user)

        # Generate JWT session for auto-login
        access_token = create_access_token({"sub": str(user.id), "role": user.role})
        refresh_token = create_refresh_token({"sub": str(user.id)})

        user_data = {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "is_email_verified": user.is_email_verified,
            "is_phone_verified": user.is_phone_verified,
            "verification_status": user.verification_status,
        }

        return True, "OTP verified successfully! Account verified.", {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user_data
        }
