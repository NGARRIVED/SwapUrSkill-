import os
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import httpx
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from ..models.auth import UserSignup, UserLogin, OAuthLogin, OTPVerification
from ..database.models import User, OAuthAccount, OTPVerification as OTPModel, UserSession
from ..config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Create a JWT access token."""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode a JWT token."""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None

    def generate_otp(self) -> str:
        """Generate a 6-digit OTP."""
        return ''.join(secrets.choice(string.digits) for _ in range(6))

    def create_otp_verification(self, user_id: Optional[str], email: Optional[str], 
                               phone_number: Optional[str], otp_type: str) -> str:
        """Create an OTP verification record."""
        otp_code = self.generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=10)  # OTP expires in 10 minutes
        
        otp_verification = OTPModel(
            user_id=user_id,
            email=email,
            phone_number=phone_number,
            otp_code=otp_code,
            otp_type=otp_type,
            expires_at=expires_at
        )
        
        self.db.add(otp_verification)
        self.db.commit()
        self.db.refresh(otp_verification)
        
        return otp_code

    def verify_otp(self, email: Optional[str], phone_number: Optional[str], 
                   otp_code: str, otp_type: str) -> bool:
        """Verify an OTP code."""
        query = and_(
            OTPModel.otp_code == otp_code,
            OTPModel.otp_type == otp_type,
            OTPModel.is_used == False,
            OTPModel.expires_at > datetime.utcnow()
        )
        
        if email:
            query = and_(query, OTPModel.email == email)
        if phone_number:
            query = and_(query, OTPModel.phone_number == phone_number)
        
        otp_record = self.db.query(OTPModel).filter(query).first()
        
        if otp_record:
            otp_record.is_used = True
            self.db.commit()
            return True
        
        return False

    def register_user(self, user_data: UserSignup) -> Dict[str, Any]:
        """Register a new user with email/password."""
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Create new user
        hashed_password = self.get_password_hash(user_data.password)
        user = User(
            email=user_data.email,
            phone_number=user_data.phone_number,
            password_hash=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            auth_method="email"
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        # Generate OTP for email verification
        otp_code = self.create_otp_verification(
            user_id=user.id,
            email=user.email,
            phone_number=None,
            otp_type="email_verification"
        )
        
        # If phone number provided, also send OTP to phone
        phone_otp = None
        if user_data.phone_number:
            phone_otp = self.create_otp_verification(
                user_id=user.id,
                email=None,
                phone_number=user_data.phone_number,
                otp_type="phone_verification"
            )
        
        return {
            "user_id": user.id,
            "email_otp": otp_code,
            "phone_otp": phone_otp,
            "requires_verification": True
        }

    def login_user(self, login_data: UserLogin, device_info: str = None) -> Dict[str, Any]:
        """Login a user with email/password."""
        user = self.db.query(User).filter(User.email == login_data.email).first()
        
        if not user or not user.password_hash:
            raise ValueError("Invalid email or password")
        
        if not self.verify_password(login_data.password, user.password_hash):
            raise ValueError("Invalid email or password")
        
        # Check if user is verified
        if not user.is_verified:
            raise ValueError("Please verify your email and phone number before logging in")
        
        # Check for existing sessions (multi-device login detection)
        existing_sessions = self.db.query(UserSession).filter(
            and_(UserSession.user_id == user.id, UserSession.is_active == True)
        ).all()
        
        requires_otp = len(existing_sessions) > 0
        
        if requires_otp:
            # Generate OTP for login verification
            otp_code = self.create_otp_verification(
                user_id=user.id,
                email=user.email,
                phone_number=user.phone_number,
                otp_type="login_verification"
            )
            
            return {
                "user_id": user.id,
                "requires_otp": True,
                "otp_sent_to": ["email", "phone"] if user.phone_number else ["email"]
            }
        
        # Create session and return access token
        access_token = self.create_access_token(data={"sub": user.id})
        self.create_user_session(user.id, access_token, device_info)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
            "requires_otp": False
        }

    def verify_login_otp(self, user_id: str, otp_code: str) -> Dict[str, Any]:
        """Verify OTP for login and complete authentication."""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Verify OTP
        if not self.verify_otp(user.email, user.phone_number, otp_code, "login_verification"):
            raise ValueError("Invalid or expired OTP")
        
        # Create session and return access token
        access_token = self.create_access_token(data={"sub": user.id})
        self.create_user_session(user.id, access_token)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
            "requires_otp": False
        }

    def oauth_login(self, oauth_data: OAuthLogin) -> Dict[str, Any]:
        """Handle OAuth login (Google/GitHub)."""
        if oauth_data.provider not in ["google", "github"]:
            raise ValueError("Unsupported OAuth provider")
        
        # Get user info from OAuth provider
        user_info = self.get_oauth_user_info(oauth_data.provider, oauth_data.access_token)
        
        # Check if OAuth account exists
        oauth_account = self.db.query(OAuthAccount).filter(
            and_(
                OAuthAccount.provider == oauth_data.provider,
                OAuthAccount.provider_user_id == user_info["id"]
            )
        ).first()
        
        if oauth_account:
            # Existing OAuth user - login
            user = self.db.query(User).filter(User.id == oauth_account.user_id).first()
            access_token = self.create_access_token(data={"sub": user.id})
            self.create_user_session(user.id, access_token)
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": user,
                "requires_otp": False
            }
        else:
            # New OAuth user - create account
            user = User(
                email=user_info["email"],
                first_name=user_info["first_name"],
                last_name=user_info["last_name"],
                profile_photo_url=user_info.get("picture"),
                auth_method=oauth_data.provider,
                is_verified=True  # OAuth users are pre-verified
            )
            
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            
            # Create OAuth account
            oauth_account = OAuthAccount(
                user_id=user.id,
                provider=oauth_data.provider,
                provider_user_id=user_info["id"],
                access_token=oauth_data.access_token
            )
            
            self.db.add(oauth_account)
            self.db.commit()
            
            access_token = self.create_access_token(data={"sub": user.id})
            self.create_user_session(user.id, access_token)
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": user,
                "requires_otp": False
            }

    async def get_oauth_user_info(self, provider: str, access_token: str) -> Dict[str, Any]:
        """Get user information from OAuth provider."""
        if provider == "google":
            url = "https://www.googleapis.com/oauth2/v2/userinfo"
        elif provider == "github":
            url = "https://api.github.com/user"
        else:
            raise ValueError("Unsupported OAuth provider")
        
        headers = {"Authorization": f"Bearer {access_token}"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
        
        if provider == "google":
            return {
                "id": data["id"],
                "email": data["email"],
                "first_name": data.get("given_name", ""),
                "last_name": data.get("family_name", ""),
                "picture": data.get("picture")
            }
        elif provider == "github":
            # GitHub doesn't provide first/last name, so we'll use the name field
            name_parts = data.get("name", "").split(" ", 1)
            return {
                "id": str(data["id"]),
                "email": data["email"],
                "first_name": name_parts[0] if name_parts else "",
                "last_name": name_parts[1] if len(name_parts) > 1 else "",
                "picture": data.get("avatar_url")
            }

    def create_user_session(self, user_id: str, session_token: str, device_info: str = None):
        """Create a new user session."""
        session = UserSession(
            user_id=user_id,
            session_token=session_token,
            device_info=device_info,
            is_active=True
        )
        
        self.db.add(session)
        self.db.commit()

    def logout_user(self, user_id: str, session_token: str):
        """Logout user by deactivating session."""
        session = self.db.query(UserSession).filter(
            and_(
                UserSession.user_id == user_id,
                UserSession.session_token == session_token,
                UserSession.is_active == True
            )
        ).first()
        
        if session:
            session.is_active = False
            self.db.commit()

    def verify_email_otp(self, user_id: str, otp_code: str) -> bool:
        """Verify email OTP and mark user as verified."""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        
        if self.verify_otp(user.email, None, otp_code, "email_verification"):
            user.is_verified = True
            self.db.commit()
            return True
        
        return False

    def verify_phone_otp(self, user_id: str, otp_code: str) -> bool:
        """Verify phone OTP."""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or not user.phone_number:
            return False
        
        if self.verify_otp(None, user.phone_number, otp_code, "phone_verification"):
            return True
        
        return False 