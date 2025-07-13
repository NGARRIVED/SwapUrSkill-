from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

from ..database.database import get_db
from ..models.auth import (
    UserSignup, UserLogin, OAuthLogin, OTPVerification, 
    AuthResponse, UserResponse, OTPResponse
)
from ..services.auth_service import AuthService
from ..services.email_service import EmailService
from ..services.sms_service import SMSService
from ..models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

# Initialize services
email_service = EmailService()
sms_service = SMSService()

@router.post("/signup", response_model=OTPResponse)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """
    Register a new user with email/password and send OTP for verification.
    """
    try:
        auth_service = AuthService(db)
        result = auth_service.register_user(user_data)
        
        # Send OTP via email
        await email_service.send_otp_email(
            email=user_data.email,
            otp_code=result["email_otp"],
            user_name=f"{user_data.first_name} {user_data.last_name}"
        )
        
        # Send OTP via SMS if phone number provided
        otp_sent_to = ["email"]
        if result.get("phone_otp") and user_data.phone_number:
            await sms_service.send_otp_sms(
                phone_number=user_data.phone_number,
                otp_code=result["phone_otp"]
            )
            otp_sent_to.append("phone")
        
        return OTPResponse(
            message="Account created successfully. Please verify your email and phone number.",
            otp_sent_to=otp_sent_to
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )

@router.post("/verify-email", response_model=dict)
async def verify_email_otp(user_id: str, otp_code: str, db: Session = Depends(get_db)):
    """
    Verify email OTP and mark user as verified.
    """
    try:
        auth_service = AuthService(db)
        if auth_service.verify_email_otp(user_id, otp_code):
            return {"message": "Email verified successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during verification"
        )

@router.post("/verify-phone", response_model=dict)
async def verify_phone_otp(user_id: str, otp_code: str, db: Session = Depends(get_db)):
    """
    Verify phone OTP.
    """
    try:
        auth_service = AuthService(db)
        if auth_service.verify_phone_otp(user_id, otp_code):
            return {"message": "Phone number verified successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during verification"
        )

@router.post("/login", response_model=AuthResponse)
async def login(
    login_data: UserLogin, 
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Login user with email/password. May require OTP if user is logged in on another device.
    """
    try:
        auth_service = AuthService(db)
        device_info = f"{request.headers.get('User-Agent', 'Unknown')} - {request.client.host if request.client else 'Unknown'}"
        
        result = auth_service.login_user(login_data, device_info)
        
        if result.get("requires_otp"):
            # Send OTP for login verification
            user = db.query(User).filter(User.id == result["user_id"]).first()
            
            # Send OTP via email
            await email_service.send_login_otp_email(
                email=user.email,
                otp_code=result.get("otp_code"),
                user_name=f"{user.first_name} {user.last_name}"
            )
            
            # Send OTP via SMS if phone number exists
            if user.phone_number and "phone" in result.get("otp_sent_to", []):
                await sms_service.send_login_otp_sms(
                    phone_number=user.phone_number,
                    otp_code=result.get("otp_code")
                )
            
            return AuthResponse(
                access_token="",
                token_type="",
                user=UserResponse.from_orm(user),
                requires_otp=True
            )
        
        return AuthResponse(
            access_token=result["access_token"],
            token_type=result["token_type"],
            user=UserResponse.from_orm(result["user"]),
            requires_otp=False
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@router.post("/verify-login-otp", response_model=AuthResponse)
async def verify_login_otp(user_id: str, otp_code: str, db: Session = Depends(get_db)):
    """
    Verify OTP for login and complete authentication.
    """
    try:
        auth_service = AuthService(db)
        result = auth_service.verify_login_otp(user_id, otp_code)
        
        return AuthResponse(
            access_token=result["access_token"],
            token_type=result["token_type"],
            user=UserResponse.from_orm(result["user"]),
            requires_otp=False
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during OTP verification"
        )

@router.post("/oauth/login", response_model=AuthResponse)
async def oauth_login(oauth_data: OAuthLogin, db: Session = Depends(get_db)):
    """
    Login or register user with OAuth (Google/GitHub).
    """
    try:
        auth_service = AuthService(db)
        result = auth_service.oauth_login(oauth_data)
        
        return AuthResponse(
            access_token=result["access_token"],
            token_type=result["token_type"],
            user=UserResponse.from_orm(result["user"]),
            requires_otp=False
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during OAuth login"
        )

@router.post("/logout")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Logout user by deactivating their session.
    """
    try:
        auth_service = AuthService(db)
        token_data = auth_service.verify_token(credentials.credentials)
        
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        auth_service.logout_user(token_data["sub"], credentials.credentials)
        return {"message": "Logged out successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during logout"
        )

@router.post("/resend-otp")
async def resend_otp(
    user_id: str,
    otp_type: str,  # 'email_verification', 'phone_verification', 'login_verification'
    db: Session = Depends(get_db)
):
    """
    Resend OTP for verification.
    """
    try:
        auth_service = AuthService(db)
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Generate new OTP
        if otp_type == "email_verification":
            otp_code = auth_service.create_otp_verification(
                user_id=user.id,
                email=user.email,
                phone_number=None,
                otp_type=otp_type
            )
            await email_service.send_otp_email(
                email=user.email,
                otp_code=otp_code,
                user_name=f"{user.first_name} {user.last_name}"
            )
            return {"message": "OTP sent to email"}
            
        elif otp_type == "phone_verification" and user.phone_number:
            otp_code = auth_service.create_otp_verification(
                user_id=user.id,
                email=None,
                phone_number=user.phone_number,
                otp_type=otp_type
            )
            await sms_service.send_otp_sms(
                phone_number=user.phone_number,
                otp_code=otp_code
            )
            return {"message": "OTP sent to phone"}
            
        elif otp_type == "login_verification":
            otp_code = auth_service.create_otp_verification(
                user_id=user.id,
                email=user.email,
                phone_number=user.phone_number,
                otp_type=otp_type
            )
            
            # Send to both email and phone
            await email_service.send_login_otp_email(
                email=user.email,
                otp_code=otp_code,
                user_name=f"{user.first_name} {user.last_name}"
            )
            
            if user.phone_number:
                await sms_service.send_login_otp_sms(
                    phone_number=user.phone_number,
                    otp_code=otp_code
                )
            
            return {"message": "OTP sent to email and phone"}
        
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP type or missing phone number"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while sending OTP"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user information.
    """
    try:
        auth_service = AuthService(db)
        token_data = auth_service.verify_token(credentials.credentials)
        
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        user = db.query(User).filter(User.id == token_data["sub"]).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse.from_orm(user)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching user information"
        ) 