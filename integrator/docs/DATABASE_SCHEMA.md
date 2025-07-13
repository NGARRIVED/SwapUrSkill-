# SkillCoterie Database Schema

## Overview
This document outlines the PostgreSQL database schema for the SkillCoterie platform, designed to support luxury skill exchange between professionals.

## Database Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(200),
    bio TEXT,
    location VARCHAR(200),
    profile_photo_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Skills Table
```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. User_Skills Table (Many-to-Many Relationship)
```sql
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    skill_type VARCHAR(20) NOT NULL CHECK (skill_type IN ('offering', 'seeking')),
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('beginner', 'intermediate', 'expert')),
    experience_years INTEGER,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id, skill_type)
);
```

### 4. Swap_Requests Table
```sql
CREATE TABLE swap_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requested_skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    offered_skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
    message TEXT,
    proposed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Messages Table
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swap_request_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Ratings Table
```sql
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swap_request_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
    rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rated_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(swap_request_id, rater_id, rated_user_id)
);
```

### 7. Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_is_available ON users(is_available);

-- User_Skills table indexes
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_user_skills_type ON user_skills(skill_type);
CREATE INDEX idx_user_skills_available ON user_skills(is_available);

-- Swap_Requests table indexes
CREATE INDEX idx_swap_requests_requester ON swap_requests(requester_id);
CREATE INDEX idx_swap_requests_recipient ON swap_requests(recipient_id);
CREATE INDEX idx_swap_requests_status ON swap_requests(status);
CREATE INDEX idx_swap_requests_created ON swap_requests(created_at);

-- Messages table indexes
CREATE INDEX idx_messages_swap_request ON messages(swap_request_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- Ratings table indexes
CREATE INDEX idx_ratings_rated_user ON ratings(rated_user_id);
CREATE INDEX idx_ratings_swap_request ON ratings(swap_request_id);

-- Notifications table indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

## Sample Data

### Skills Categories
- **Business & Finance**: Investment Planning, Portfolio Management, Tax Strategy
- **Technology**: Web Development, Data Science, Cybersecurity
- **Creative**: Graphic Design, Photography, Content Writing
- **Health & Wellness**: Nutrition, Fitness Training, Mental Health
- **Education**: Language Teaching, Academic Tutoring, Professional Training
- **Legal**: Contract Review, Legal Consultation, Compliance
- **Marketing**: Digital Marketing, Brand Strategy, SEO
- **Real Estate**: Property Investment, Market Analysis, Legal Guidance

## Relationships

1. **Users ↔ User_Skills**: One-to-Many (A user can offer/seek multiple skills)
2. **Skills ↔ User_Skills**: One-to-Many (A skill can be offered/sought by multiple users)
3. **Users ↔ Swap_Requests**: One-to-Many (A user can make/receive multiple requests)
4. **Swap_Requests ↔ Messages**: One-to-Many (A request can have multiple messages)
5. **Swap_Requests ↔ Ratings**: One-to-Many (A request can have multiple ratings)
6. **Users ↔ Notifications**: One-to-Many (A user can have multiple notifications)

## Security Considerations

- All passwords are hashed using bcrypt
- UUIDs for all primary keys (security through obscurity)
- Foreign key constraints for data integrity
- Check constraints for data validation
- Indexes for query performance 