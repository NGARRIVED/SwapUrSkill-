from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    email = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String(20), unique=True)
    password_hash = Column(String(255))  # NULL for OAuth-only users
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    title = Column(String(200))
    bio = Column(Text)
    location = Column(String(200))
    profile_photo_url = Column(String(500))
    is_verified = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    auth_method = Column(String(20), default='email')
    last_login_at = Column(DateTime(timezone=True))
    last_login_device = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    oauth_accounts = relationship("OAuthAccount", back_populates="user", cascade="all, delete-orphan")
    otp_verifications = relationship("OTPVerification", back_populates="user", cascade="all, delete-orphan")
    user_sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    user_skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    swap_requests_sent = relationship("SwapRequest", foreign_keys="SwapRequest.requester_id", back_populates="requester")
    swap_requests_received = relationship("SwapRequest", foreign_keys="SwapRequest.recipient_id", back_populates="recipient")
    messages = relationship("Message", back_populates="sender")
    ratings_given = relationship("Rating", foreign_keys="Rating.rater_id", back_populates="rater")
    ratings_received = relationship("Rating", foreign_keys="Rating.rated_user_id", back_populates="rated_user")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class OAuthAccount(Base):
    __tablename__ = "oauth_accounts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    provider = Column(String(20), nullable=False)
    provider_user_id = Column(String(255), nullable=False)
    access_token = Column(String(1000))
    refresh_token = Column(String(1000))
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="oauth_accounts")
    
    __table_args__ = (
        CheckConstraint(provider.in_(['google', 'github']), name='valid_oauth_provider'),
    )

class OTPVerification(Base):
    __tablename__ = "otp_verifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    email = Column(String(255))
    phone_number = Column(String(20))
    otp_code = Column(String(10), nullable=False)
    otp_type = Column(String(20), nullable=False)
    is_used = Column(Boolean, default=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="otp_verifications")
    
    __table_args__ = (
        CheckConstraint(otp_type.in_(['email_verification', 'phone_verification', 'login_verification', 'password_reset']), name='valid_otp_type'),
    )

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    session_token = Column(String(500), unique=True, nullable=False)
    device_info = Column(String(500))
    ip_address = Column(String(45))
    user_agent = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_sessions")

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    name = Column(String(100), unique=True, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text)
    icon_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user_skills = relationship("UserSkill", back_populates="skill", cascade="all, delete-orphan")
    swap_requests_requested = relationship("SwapRequest", foreign_keys="SwapRequest.requested_skill_id", back_populates="requested_skill")
    swap_requests_offered = relationship("SwapRequest", foreign_keys="SwapRequest.offered_skill_id", back_populates="offered_skill")

class UserSkill(Base):
    __tablename__ = "user_skills"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id"), nullable=False)
    skill_type = Column(String(20), nullable=False)
    proficiency_level = Column(String(20))
    experience_years = Column(Integer)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")
    
    __table_args__ = (
        CheckConstraint(skill_type.in_(['offering', 'seeking']), name='valid_skill_type'),
        CheckConstraint(proficiency_level.in_(['beginner', 'intermediate', 'expert']), name='valid_proficiency_level'),
    )

class SwapRequest(Base):
    __tablename__ = "swap_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    requester_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    recipient_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    requested_skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id"), nullable=False)
    offered_skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id"), nullable=False)
    status = Column(String(20), nullable=False, default='pending')
    message = Column(Text)
    proposed_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    requester = relationship("User", foreign_keys=[requester_id], back_populates="swap_requests_sent")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="swap_requests_received")
    requested_skill = relationship("Skill", foreign_keys=[requested_skill_id], back_populates="swap_requests_requested")
    offered_skill = relationship("Skill", foreign_keys=[offered_skill_id], back_populates="swap_requests_offered")
    messages = relationship("Message", back_populates="swap_request", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="swap_request", cascade="all, delete-orphan")
    
    __table_args__ = (
        CheckConstraint(status.in_(['pending', 'accepted', 'rejected', 'completed', 'cancelled']), name='valid_swap_status'),
    )

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    swap_request_id = Column(UUID(as_uuid=True), ForeignKey("swap_requests.id"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    swap_request = relationship("SwapRequest", back_populates="messages")
    sender = relationship("User", back_populates="messages")

class Rating(Base):
    __tablename__ = "ratings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    swap_request_id = Column(UUID(as_uuid=True), ForeignKey("swap_requests.id"), nullable=False)
    rater_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    rated_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    swap_request = relationship("SwapRequest", back_populates="ratings")
    rater = relationship("User", foreign_keys=[rater_id], back_populates="ratings_given")
    rated_user = relationship("User", foreign_keys=[rated_user_id], back_populates="ratings_received")
    
    __table_args__ = (
        CheckConstraint(rating >= 1, rating <= 5, name='valid_rating_range'),
    )

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    related_id = Column(UUID(as_uuid=True))
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="notifications") 