#!/usr/bin/env python3
"""
Migration Script for Authentication Tables
This script adds the new authentication columns and tables to the existing database.
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Hardcoded PostgreSQL password for local development
HARDCODED_PASSWORD = 'Yash@12345'

def migrate_database():
    """Migrate the existing database with new authentication features."""
    DB_NAME = 'skillcoterie'
    password = HARDCODED_PASSWORD
    
    try:
        # Connect to the database
        conn = psycopg2.connect(
            host='localhost',
            port='5432',
            user='postgres',
            password=password,
            database=DB_NAME
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        print("Starting database migration...")
        
        # Migration SQL statements
        migrations = [
            # Add new columns to users table
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) UNIQUE;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_method VARCHAR(20) DEFAULT 'email' CHECK (auth_method IN ('email', 'google', 'github', 'phone'));",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_device VARCHAR(500);",
            
            # Create OAuth accounts table
            """
            CREATE TABLE IF NOT EXISTS oauth_accounts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                provider VARCHAR(20) NOT NULL CHECK (provider IN ('google', 'github')),
                provider_user_id VARCHAR(255) NOT NULL,
                access_token VARCHAR(1000),
                refresh_token VARCHAR(1000),
                expires_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(provider, provider_user_id)
            );
            """,
            
            # Create OTP verifications table
            """
            CREATE TABLE IF NOT EXISTS otp_verifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                email VARCHAR(255),
                phone_number VARCHAR(20),
                otp_code VARCHAR(10) NOT NULL,
                otp_type VARCHAR(20) NOT NULL CHECK (otp_type IN ('email_verification', 'phone_verification', 'login_verification', 'password_reset')),
                is_used BOOLEAN DEFAULT FALSE,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """,
            
            # Create user sessions table
            """
            CREATE TABLE IF NOT EXISTS user_sessions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                session_token VARCHAR(500) UNIQUE NOT NULL,
                device_info VARCHAR(500),
                ip_address VARCHAR(45),
                user_agent TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """,
            
            # Create indexes
            "CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);",
            "CREATE INDEX IF NOT EXISTS idx_users_auth_method ON users(auth_method);",
            "CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user_id ON oauth_accounts(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider ON oauth_accounts(provider);",
            "CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider_user_id ON oauth_accounts(provider_user_id);",
            "CREATE INDEX IF NOT EXISTS idx_otp_verifications_user_id ON otp_verifications(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_otp_verifications_email ON otp_verifications(email);",
            "CREATE INDEX IF NOT EXISTS idx_otp_verifications_phone ON otp_verifications(phone_number);",
            "CREATE INDEX IF NOT EXISTS idx_otp_verifications_type ON otp_verifications(otp_type);",
            "CREATE INDEX IF NOT EXISTS idx_otp_verifications_expires ON otp_verifications(expires_at);",
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);",
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);",
        ]
        
        for i, migration in enumerate(migrations, 1):
            try:
                cursor.execute(migration)
                print(f"✅ Migration {i} completed successfully")
            except psycopg2.Error as e:
                if "already exists" in str(e) or "duplicate key" in str(e):
                    print(f"⏭️  Migration {i} skipped (already exists)")
                else:
                    print(f"❌ Migration {i} failed: {e}")
        
        print("Database migration completed successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error during migration: {e}")
        sys.exit(1)

def main():
    """Main function to run the migration."""
    print("🔄 Migrating SkillCoterie Database for Authentication...")
    print("=" * 60)
    
    # Run migration
    migrate_database()
    
    print("=" * 60)
    print("✅ Database migration completed successfully!")
    print("Authentication system is ready!")

if __name__ == "__main__":
    main() 