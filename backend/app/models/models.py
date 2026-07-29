from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user") # user, seller, shelter, ngo, veterinarian, groomer, admin, super_admin
    is_active = Column(Boolean, default=True)
    is_email_verified = Column(Boolean, default=False)
    is_phone_verified = Column(Boolean, default=False)
    is_identity_verified = Column(Boolean, default=False)
    verification_status = Column(String, default="unverified") # unverified, pending, under_review, verified, rejected
    trust_score = Column(Float, default=50.0) # 0.0 to 100.0 score
    verified_badge = Column(String, default="unverified") # unverified, verified_user, verified_seller, verified_shelter, verified_ngo, verified_vet
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String, nullable=True)
    profile_photo = Column(String, nullable=True)
    failed_login_attempts = Column(Integer, default=0)
    lockout_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    pets = relationship("Pet", back_populates="owner")
    adoption_applications = relationship("AdoptionApplication", back_populates="applicant")
    lost_found_reports = relationship("LostFoundReport", back_populates="reporter")
    orders = relationship("Order", back_populates="user")
    sessions = relationship("UserSession", back_populates="user")
    documents = relationship("VerificationDocument", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bio = Column(Text, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    organization_name = Column(String, nullable=True) # For NGO / Shelter / Vet Clinic
    medical_license_no = Column(String, nullable=True) # For Vets
    years_experience = Column(Integer, nullable=True)
    specialization = Column(String, nullable=True)
    rating = Column(Float, default=5.0)

    user = relationship("User", back_populates="profile")


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_token = Column(String, unique=True, index=True, nullable=False)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    device_fingerprint = Column(String, nullable=True)
    location = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    last_active_at = Column(DateTime, default=utcnow)
    created_at = Column(DateTime, default=utcnow)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="sessions")


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    code = Column(String, nullable=False) # 6-digit OTP or token
    token = Column(String, unique=True, index=True, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)
    expires_at = Column(DateTime, nullable=False)


class PhoneVerification(Base):
    __tablename__ = "phone_verifications"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, index=True, nullable=False)
    otp_code = Column(String, nullable=False) # 6-digit OTP
    attempts = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)
    expires_at = Column(DateTime, nullable=False)


class OTPCode(Base):
    __tablename__ = "otp_codes"

    id = Column(Integer, primary_key=True, index=True)
    target = Column(String, index=True, nullable=False) # Email or Phone
    otp_type = Column(String, nullable=False) # login, verification, password_reset, 2fa
    code = Column(String, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)
    expires_at = Column(DateTime, nullable=False)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String, unique=True, index=True, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)
    expires_at = Column(DateTime, nullable=False)


class LoginHistory(Base):
    __tablename__ = "login_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    email_or_phone = Column(String, nullable=False)
    status = Column(String, nullable=False) # success, failed, locked, 2fa_required
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    failure_reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)


class TrustedDevice(Base):
    __tablename__ = "trusted_devices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_name = Column(String, nullable=False)
    device_fingerprint = Column(String, index=True, nullable=False)
    is_trusted = Column(Boolean, default=True)
    last_used_at = Column(DateTime, default=utcnow)
    created_at = Column(DateTime, default=utcnow)


class VerificationDocument(Base):
    __tablename__ = "verification_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_type = Column(String, nullable=False) # govt_id, selfie, address_proof, ngo_cert, tax_cert, shelter_license, vet_license
    document_number = Column(String, nullable=True)
    file_url = Column(String, nullable=False)
    status = Column(String, default="pending") # pending, under_review, verified, rejected
    rejection_reason = Column(String, nullable=True)
    submitted_at = Column(DateTime, default=utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="documents")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False) # user, seller, shelter, ngo, veterinarian, groomer, admin, super_admin
    description = Column(String, nullable=True)


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False) # read, create, update, delete, moderate, manage_users, manage_payments, manage_reports
    description = Column(String, nullable=True)


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    rating = Column(Float, default=4.9)
    reviews_count = Column(Integer, default=120)
    image_url = Column(String, nullable=True)
    description = Column(String, nullable=False)
    in_stock = Column(Boolean, default=True)


class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Dogs, Cats, Birds, etc.
    breed = Column(String, nullable=False)
    age_months = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    color = Column(String, default="Golden")
    weight_kg = Column(Float, default=5.0)
    listing_type = Column(String, nullable=False) # adoption, sale, rescue
    price = Column(Float, default=0.0)
    location = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    is_vaccinated = Column(Boolean, default=True)
    has_medical_certificate = Column(Boolean, default=True)
    pet_verification_status = Column(String, default="unverified") # unverified, pending, verified
    vaccination_record_url = Column(String, nullable=True)
    microchip_id = Column(String, nullable=True)
    medical_certificate_url = Column(String, nullable=True)
    is_verified_pet = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)

    owner = relationship("User", back_populates="pets")
    adoptions = relationship("AdoptionApplication", back_populates="pet")


class AdoptionApplication(Base):
    __tablename__ = "adoption_applications"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id"), nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    housing_type = Column(String, nullable=False) # Apartment, Independent House, Farm
    has_other_pets = Column(Boolean, default=False)
    experience_level = Column(String, nullable=False)
    message = Column(String, nullable=False)
    status = Column(String, default="pending") # pending, approved, rejected
    created_at = Column(DateTime, default=utcnow)

    pet = relationship("Pet", back_populates="adoptions")
    applicant = relationship("User", back_populates="adoption_applications")


class LostFoundReport(Base):
    __tablename__ = "lost_found_reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    report_type = Column(String, nullable=False) # lost, found
    pet_name = Column(String, nullable=True)
    animal_type = Column(String, nullable=False)
    breed = Column(String, nullable=True)
    color = Column(String, nullable=False)
    location = Column(String, nullable=False)
    report_date = Column(DateTime, default=utcnow)
    contact_phone = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    status = Column(String, default="active") # active, resolved, closed
    created_at = Column(DateTime, default=utcnow)

    reporter = relationship("User", back_populates="lost_found_reports")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    service_type = Column(String, nullable=False) # vet, grooming, boarding, training
    provider_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    rating = Column(Float, default=4.8)
    image_url = Column(String, nullable=True)
    description = Column(String, nullable=False)
    is_available = Column(Boolean, default=True)


class ServiceBooking(Base):
    __tablename__ = "service_bookings"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    date = Column(String, nullable=False)
    time_slot = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    status = Column(String, default="confirmed")
    created_at = Column(DateTime, default=utcnow)


class RescueAlert(Base):
    __tablename__ = "rescue_alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    animal_type = Column(String, nullable=False)
    location = Column(String, nullable=False)
    urgency = Column(String, nullable=False) # Critical, Moderate, Low
    description = Column(String, nullable=False)
    reporter_phone = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    status = Column(String, default="open") # open, responding, resolved
    created_at = Column(DateTime, default=utcnow)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    use_case = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    delivery_charge = Column(Float, default=0.0)
    shipping_charge = Column(Float, default=0.0)
    platform_fee = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    coupon_code = Column(String, nullable=True)
    payment_method = Column(String, nullable=False)
    payment_status = Column(String, default="pending")
    status = Column(String, default="Pending")
    order_status = Column(String, default="confirmed")
    delivery_status = Column(String, default="Confirmed")
    shipping_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    payments = relationship("PaymentRecord", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    item_title = Column(String, default="Product Item")
    title = Column(String, default="Product Item")
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)

    order = relationship("Order", back_populates="items")


class PaymentRecord(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    payment_id = Column(String, unique=True, index=True, nullable=False)
    razorpay_order_id = Column(String, nullable=True)
    razorpay_payment_id = Column(String, nullable=True)
    razorpay_signature = Column(String, nullable=True)
    method = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    status = Column(String, default="pending")
    gateway_response = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    order = relationship("Order", back_populates="payments")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_ref = Column(String, unique=True, index=True, nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    transaction_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="completed")
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)


class Refund(Base):
    __tablename__ = "refunds"

    id = Column(Integer, primary_key=True, index=True)
    refund_id = Column(String, unique=True, index=True, nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    amount = Column(Float, nullable=False)
    reason = Column(String, nullable=False)
    status = Column(String, default="pending")
    processed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utcnow)


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, index=True, nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    total_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    pdf_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=utcnow)


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    discount_percentage = Column(Float, nullable=False)
    max_discount_amount = Column(Float, nullable=False)
    min_order_amount = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=True)


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    balance = Column(Float, default=0.0)
    currency = Column(String, default="INR")
    updated_at = Column(DateTime, default=utcnow, onupdate=datetime.utcnow)


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="active")
    start_date = Column(DateTime, default=utcnow)
    end_date = Column(DateTime, nullable=False)


class VerificationAuditLog(Base):
    __tablename__ = "verification_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    target_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False) # approve, reject, flag_fraud, update_trust_score
    previous_status = Column(String, nullable=True)
    new_status = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)


class ReviewRating(Base):
    __tablename__ = "reviews_ratings"

    id = Column(Integer, primary_key=True, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_id = Column(Integer, nullable=False)
    target_type = Column(String, nullable=False) # user, seller, shelter, ngo, veterinarian, pet
    rating = Column(Float, nullable=False) # 1.0 to 5.0
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)


class FraudDetectionFlag(Base):
    __tablename__ = "fraud_detection_flags"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    flag_type = Column(String, nullable=False) # duplicate_account, duplicate_image, fake_location, suspicious_listing
    risk_score = Column(Float, default=0.0) # 0.0 to 100.0
    details = Column(String, nullable=True)
    status = Column(String, default="open") # open, dismissed, action_taken
    created_at = Column(DateTime, default=utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, default="verification") # verification, alert, order, general
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

