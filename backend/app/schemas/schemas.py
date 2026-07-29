from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

# ==================== COMMON ERROR & MESSAGE SCHEMAS ====================

class ErrorResponse(BaseModel):
    detail: str = Field(..., json_schema_extra={"example": "Resource not found or validation error"})

class MessageResponse(BaseModel):
    status: str = Field("success", json_schema_extra={"example": "success"})
    message: str = Field(..., json_schema_extra={"example": "Operation completed successfully"})

# ==================== AUTH SCHEMAS ====================

class UserRegister(BaseModel):
    full_name: str = Field(..., json_schema_extra={"example": "Priya Sharma"})
    username: Optional[str] = Field(None, json_schema_extra={"example": "priyasharma"})
    email: str = Field(..., json_schema_extra={"example": "priya@example.com"})
    phone: Optional[str] = Field(None, json_schema_extra={"example": "+919876543210"})
    password: str = Field(..., json_schema_extra={"example": "SecurePass123!"})
    role: str = Field("user", json_schema_extra={"example": "seller"}) # user, seller, shelter, ngo, veterinarian, groomer

class UserLogin(BaseModel):
    email_or_phone: str = Field(..., json_schema_extra={"example": "priya@example.com"})
    password: str = Field(..., json_schema_extra={"example": "SecurePass123!"})
    remember_me: bool = Field(False, json_schema_extra={"example": True})
    device_fingerprint: Optional[str] = Field(None, json_schema_extra={"example": "browser_fp_98213"})

class GoogleLoginRequest(BaseModel):
    id_token: str = Field(..., json_schema_extra={"example": "google_oauth_token_xyz"})
    role: Optional[str] = Field("user", json_schema_extra={"example": "user"})

class OTPRequest(BaseModel):
    target: str = Field(..., json_schema_extra={"example": "priya@example.com"}) # email or phone
    otp_type: str = Field("email_verification", json_schema_extra={"example": "email_verification"}) # login, verification, password_reset, 2fa

class SendOTPRequest(BaseModel):
    target: str = Field(..., json_schema_extra={"example": "priya@example.com"})
    channel: Optional[str] = Field("email", json_schema_extra={"example": "email"}) # email or phone

class VerifyOTPRequest(BaseModel):
    target: str = Field(..., json_schema_extra={"example": "priya@example.com"})
    otp_code: str = Field(..., json_schema_extra={"example": "123456"})

class ResendOTPRequest(BaseModel):
    target: str = Field(..., json_schema_extra={"example": "priya@example.com"})
    channel: Optional[str] = Field("email", json_schema_extra={"example": "email"})

class OTPVerify(BaseModel):
    target: str = Field(..., json_schema_extra={"example": "+919876543210"})
    otp_code: str = Field(..., json_schema_extra={"example": "123456"})
    otp_type: Optional[str] = Field("login", json_schema_extra={"example": "login"})
    otp_type: str = Field("login", json_schema_extra={"example": "login"})

class EmailVerifyRequest(BaseModel):
    email: str = Field(..., json_schema_extra={"example": "priya@example.com"})
    code_or_token: str = Field(..., json_schema_extra={"example": "891234"})

class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., json_schema_extra={"example": "priya@example.com"})

class ResetPasswordRequest(BaseModel):
    token_or_otp: str = Field(..., json_schema_extra={"example": "rst_token_89123"})
    new_password: str = Field(..., json_schema_extra={"example": "NewStrongPassword123!"})

class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., json_schema_extra={"example": "OldPassword123!"})
    new_password: str = Field(..., json_schema_extra={"example": "NewPassword123!"})

class Enable2FARequest(BaseModel):
    enable: bool = Field(..., json_schema_extra={"example": True})

class Verify2FARequest(BaseModel):
    totp_code: str = Field(..., json_schema_extra={"example": "584912"})

class DocumentVerifyRequest(BaseModel):
    document_type: str = Field(..., json_schema_extra={"example": "govt_id"}) # govt_id, selfie, address_proof, ngo_cert, tax_cert, shelter_license, vet_license
    document_number: Optional[str] = Field(None, json_schema_extra={"example": "ABCDE1234F"})
    file_url: str = Field(..., json_schema_extra={"example": "https://pawconnect.s3.amazonaws.com/docs/id_card.pdf"})

class AdminVerifyDocumentRequest(BaseModel):
    document_id: int = Field(..., json_schema_extra={"example": 1})
    status: str = Field(..., json_schema_extra={"example": "verified"}) # verified, rejected
    rejection_reason: Optional[str] = Field(None, json_schema_extra={"example": "ID image blurry"})

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 900
    user: Dict[str, Any]

class AvailabilityCheckResponse(BaseModel):
    available: bool
    field: str
    value: str
    message: str

# ==================== DOMAIN SCHEMAS ====================

class PetBase(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Bella"})
    category: str = Field(..., json_schema_extra={"example": "Dogs"})
    breed: str = Field(..., json_schema_extra={"example": "Golden Retriever"})
    age_months: int = Field(..., json_schema_extra={"example": 12})
    gender: str = Field(..., json_schema_extra={"example": "Female"})
    listing_type: str = Field(..., json_schema_extra={"example": "adoption"})
    price: float = Field(0.0, json_schema_extra={"example": 0.0})
    location: str = Field(..., json_schema_extra={"example": "Bengaluru, KA"})
    description: str = Field(..., json_schema_extra={"example": "Friendly Golden Retriever puppy looking for loving home."})
    image_url: Optional[str] = Field(None, json_schema_extra={"example": "https://images.unsplash.com/photo-1552053831-71594a27632d"})
    is_vaccinated: bool = Field(True, json_schema_extra={"example": True})

class PetCreate(PetBase):
    pass

class PetResponse(PetBase):
    id: int
    is_available: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AdoptionApplicationCreate(BaseModel):
    pet_id: int = Field(..., json_schema_extra={"example": 1})
    housing_type: str = Field(..., json_schema_extra={"example": "Apartment"})
    has_other_pets: bool = Field(False, json_schema_extra={"example": False})
    experience_level: str = Field(..., json_schema_extra={"example": "Intermediate"})
    message: str = Field(..., json_schema_extra={"example": "I have a spacious apartment and 5 years experience with dogs."})

AdoptionCreate = AdoptionApplicationCreate

class LostFoundReportCreate(BaseModel):
    report_type: str = Field(..., json_schema_extra={"example": "lost"})
    pet_name: Optional[str] = Field(None, json_schema_extra={"example": "Rocky"})
    animal_type: str = Field(..., json_schema_extra={"example": "Dog"})
    breed: Optional[str] = Field(None, json_schema_extra={"example": "German Shepherd"})
    color: str = Field(..., json_schema_extra={"example": "Black and Tan"})
    location: str = Field(..., json_schema_extra={"example": "Indiranagar 100ft Road, Bengaluru"})
    contact_phone: str = Field(..., json_schema_extra={"example": "+919876543210"})
    description: str = Field(..., json_schema_extra={"example": "Lost near Metro station. Wearing a red collar."})
    image_url: Optional[str] = Field(None, json_schema_extra={"example": "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95"})

LostFoundCreate = LostFoundReportCreate

class RescueAlertCreate(BaseModel):
    title: str = Field(..., json_schema_extra={"example": "Injured stray dog hit by car"})
    animal_type: str = Field(..., json_schema_extra={"example": "Dog"})
    location: str = Field(..., json_schema_extra={"example": "Koramangala 4th Block, Bengaluru"})
    urgency: str = Field(..., json_schema_extra={"example": "Critical"})
    description: str = Field(..., json_schema_extra={"example": "Bleeding leg, needs immediate rescue ambulance"})
    reporter_phone: str = Field(..., json_schema_extra={"example": "+919876543210"})
    image_url: Optional[str] = Field(None, json_schema_extra={"example": "https://images.unsplash.com/photo-1548767797-d8c844163c4c"})

RescueCreate = RescueAlertCreate

class AIChatRequest(BaseModel):
    prompt: str = Field(..., json_schema_extra={"example": "My dog is vomiting after eating grass, what should I do?"})
    category: Optional[str] = Field("general", json_schema_extra={"example": "health"})

class AIChatResponse(BaseModel):
    reply: str = Field(..., json_schema_extra={"example": "Ensure pet has fresh water and monitor symptoms."})
    response: Optional[str] = Field("Response generated", json_schema_extra={"example": "Ensure pet has fresh water and monitor symptoms."})
    recommendations: Optional[List[str]] = Field(default_factory=list)
    urgency_level: Optional[str] = Field("Normal")

class ServiceBookingCreate(BaseModel):
    service_id: int = Field(..., json_schema_extra={"example": 1})
    date: str = Field(..., json_schema_extra={"example": "2026-08-05"})
    time_slot: str = Field(..., json_schema_extra={"example": "10:00 AM"})
    notes: Optional[str] = Field(None, json_schema_extra={"example": "Full grooming with flea bath"})

BookingCreate = ServiceBookingCreate

class OrderItemSchema(BaseModel):
    item_title: Optional[str] = Field(None, json_schema_extra={"example": "Royal Canin Adult Dog Food 3kg"})
    title: Optional[str] = Field(None, json_schema_extra={"example": "Royal Canin Adult Dog Food 3kg"})
    unit_price: float = Field(..., json_schema_extra={"example": 2450.0})
    quantity: int = Field(1, json_schema_extra={"example": 1})
    total_price: float = Field(..., json_schema_extra={"example": 2450.0})

class OrderCreate(BaseModel):
    use_case: str = Field("Marketplace Orders", json_schema_extra={"example": "Marketplace Orders"})
    payment_method: str = Field("Razorpay", json_schema_extra={"example": "Razorpay"})
    coupon_code: Optional[str] = Field(None, json_schema_extra={"example": "PAWCONNECT10"})
    items: List[OrderItemSchema]
    shipping_address: Optional[str] = Field(None, json_schema_extra={"example": "123 MG Road, Bengaluru, KA 560001"})

class OrderResponse(BaseModel):
    id: int
    order_number: str
    total_amount: float
    payment_status: str = Field("Pending", json_schema_extra={"example": "Pending"})
    order_status: str = Field("Created", json_schema_extra={"example": "Created"})
    status: Optional[str] = "Pending"
    delivery_status: Optional[str] = "Confirmed"
    use_case: Optional[str] = None
    payment_method: Optional[str] = None
    subtotal: Optional[float] = 0.0
    discount_amount: Optional[float] = 0.0
    tax_amount: Optional[float] = 0.0
    shipping_charge: Optional[float] = 0.0
    platform_fee: Optional[float] = 0.0
    razorpay_order_id: Optional[str] = None
    items: Optional[List[OrderItemSchema]] = Field(default_factory=list)
    created_at: Optional[datetime] = None

class PaymentVerifyRequest(BaseModel):
    order_id: int = Field(..., json_schema_extra={"example": 1})
    razorpay_order_id: str = Field(..., json_schema_extra={"example": "order_Kz89123xP"})
    razorpay_payment_id: str = Field(..., json_schema_extra={"example": "pay_Lz99481923"})
    razorpay_signature: str = Field(..., json_schema_extra={"example": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"})

PaymentVerify = PaymentVerifyRequest

class RefundCreate(BaseModel):
    order_id: int = Field(..., json_schema_extra={"example": 1})
    reason: str = Field(..., json_schema_extra={"example": "Item defective or service cancelled"})
    amount: Optional[float] = Field(None, json_schema_extra={"example": 2616.90})

class CouponApplyRequest(BaseModel):
    code: str = Field(..., json_schema_extra={"example": "PAWCONNECT10"})
    order_subtotal: float = Field(..., json_schema_extra={"example": 2450.0})

CouponApply = CouponApplyRequest

class WalletTopupRequest(BaseModel):
    amount: float = Field(..., json_schema_extra={"example": 1000.0})
    payment_method: str = Field("UPI", json_schema_extra={"example": "UPI"})

WalletTopup = WalletTopupRequest

class SubscriptionCreateRequest(BaseModel):
    plan_name: str = Field(..., json_schema_extra={"example": "PawConnect Care Gold"})
    amount: float = Field(..., json_schema_extra={"example": 999.0})

SubscriptionCreate = SubscriptionCreateRequest

# Trust & Verification Schemas
class VerificationDocumentCreate(BaseModel):
    document_type: str = Field(..., json_schema_extra={"example": "govt_id"}) # govt_id, selfie, shelter_license, ngo_cert, vet_license
    document_number: Optional[str] = Field(None, json_schema_extra={"example": "ABCDE1234F"})
    file_url: str = Field(..., json_schema_extra={"example": "https://storage.pawconnect.ai/docs/id_123.jpg"})

class VerificationDocumentResponse(BaseModel):
    id: int
    user_id: int
    document_type: str
    document_number: Optional[str] = None
    file_url: str
    status: str
    rejection_reason: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class PetVerificationRequest(BaseModel):
    vaccination_record_url: str = Field(..., json_schema_extra={"example": "https://storage.pawconnect.ai/pets/vax_123.pdf"})
    microchip_id: str = Field(..., json_schema_extra={"example": "981020002948123"})
    medical_certificate_url: str = Field(..., json_schema_extra={"example": "https://storage.pawconnect.ai/pets/med_123.pdf"})

class PetVerificationResponse(BaseModel):
    id: int
    name: str
    pet_verification_status: str
    is_verified_pet: bool
    vaccination_record_url: Optional[str] = None
    microchip_id: Optional[str] = None
    medical_certificate_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class TrustScoreResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    role: str
    trust_score: float
    verified_badge: str
    verification_status: str
    is_email_verified: bool
    is_phone_verified: bool
    is_identity_verified: bool

    model_config = ConfigDict(from_attributes=True)

class ReviewCreate(BaseModel):
    target_id: int = Field(..., json_schema_extra={"example": 1})
    target_type: str = Field(..., json_schema_extra={"example": "seller"}) # user, seller, shelter, ngo, veterinarian, pet
    rating: float = Field(..., json_schema_extra={"example": 5.0})
    comment: Optional[str] = Field(None, json_schema_extra={"example": "Excellent verified seller! Smooth process."})

class ReviewResponse(BaseModel):
    id: int
    reviewer_id: int
    target_id: int
    target_type: str
    rating: float
    comment: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class VerificationApproveRejectRequest(BaseModel):
    user_id: int = Field(..., json_schema_extra={"example": 2})
    status: str = Field(..., json_schema_extra={"example": "verified"}) # verified or rejected
    notes: Optional[str] = Field(None, json_schema_extra={"example": "Government ID and Selfie match verified."})

class FraudFlagResponse(BaseModel):
    id: int
    user_id: int
    flag_type: str
    risk_score: float
    details: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AuditLogResponse(BaseModel):
    id: int
    admin_id: Optional[int] = None
    target_user_id: int
    action: str
    previous_status: Optional[str] = None
    new_status: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


