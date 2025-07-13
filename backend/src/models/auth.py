from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
import re

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str] = None

    @validator('first_name', 'last_name')
    def validate_names(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip()

    @validator('phone_number')
    def validate_phone(cls, v):
        if v is not None:
            # Remove all non-digit characters
            phone = re.sub(r'\D', '', v)
            if len(phone) < 10 or len(phone) > 15:
                raise ValueError('Phone number must be between 10-15 digits')
            return phone
        return v

class UserSignup(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OAuthLogin(BaseModel):
    provider: str  # 'google' or 'github'
    access_token: str

class OTPVerification(BaseModel):
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    otp_code: str
    otp_type: str  # 'email_verification', 'phone_verification', 'login_verification'

    @validator('otp_code')
    def validate_otp(cls, v):
        if not v.isdigit() or len(v) != 6:
            raise ValueError('OTP must be a 6-digit number')
        return v

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    is_verified: bool
    auth_method: str
    profile_photo_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    requires_otp: bool = False

class OTPResponse(BaseModel):
    message: str
    otp_sent_to: list[str]  # ['email', 'phone'] or just one

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None 