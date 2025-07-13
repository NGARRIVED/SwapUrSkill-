#!/usr/bin/env python3
"""
Simple Database Setup Script for SkillCoterie (Local Development)
This script sets up the PostgreSQL database with schema and sample data.
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Hardcoded PostgreSQL password for local development
HARDCODED_PASSWORD = 'Yash@12345'

def read_sql_file(file_path):
    """Read SQL file content."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        print(f"Error: SQL file not found at {file_path}")
        sys.exit(1)

def create_database():
    """Create the database if it doesn't exist."""
    DB_NAME = 'skillcoterie'
    password = HARDCODED_PASSWORD
    try:
        # Connect to PostgreSQL server (not to a specific database)
        conn = psycopg2.connect(
            host='localhost',
            port='5432',
            user='postgres',
            password=password,
            database='postgres'  # Connect to default postgres database
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (DB_NAME,))
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Creating database '{DB_NAME}'...")
            cursor.execute(f'CREATE DATABASE "{DB_NAME}"')
            print(f"Database '{DB_NAME}' created successfully!")
        else:
            print(f"Database '{DB_NAME}' already exists.")
        
        cursor.close()
        conn.close()
        
        return DB_NAME, password
        
    except Exception as e:
        print(f"Error creating database: {e}")
        print("Make sure PostgreSQL is running and the password is correct")
        sys.exit(1)

def setup_schema(db_name, password):
    """Set up the database schema."""
    try:
        # Connect to the specific database
        conn = psycopg2.connect(
            host='localhost',
            port='5432',
            user='postgres',
            password=password,
            database=db_name
        )
        cursor = conn.cursor()
        
        # Read and execute schema file
        schema_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'src', 'database', 'schema.sql')
        schema_sql = read_sql_file(schema_path)
        
        print("Setting up database schema...")
        cursor.execute(schema_sql)
        conn.commit()
        print("Database schema created successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error setting up schema: {e}")
        sys.exit(1)

def insert_sample_data(db_name, password):
    """Insert sample data into the database."""
    try:
        # Connect to the database
        conn = psycopg2.connect(
            host='localhost',
            port='5432',
            user='postgres',
            password=password,
            database=db_name
        )
        cursor = conn.cursor()
        
        # Read and execute sample data file
        sample_data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'src', 'database', 'sample_data.sql')
        sample_data_sql = read_sql_file(sample_data_path)
        
        print("Inserting sample data...")
        cursor.execute(sample_data_sql)
        conn.commit()
        print("Sample data inserted successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error inserting sample data: {e}")
        sys.exit(1)

def main():
    """Main function to set up the database."""
    print("🚀 Setting up SkillCoterie Database (Local Development)...")
    print("=" * 60)
    
    # Create database
    db_name, password = create_database()
    
    # Set up schema
    setup_schema(db_name, password)
    
    # Insert sample data
    insert_sample_data(db_name, password)
    
    print("=" * 60)
    print("✅ Database setup completed successfully!")
    print(f"Database: {db_name}")
    print("Host: localhost:5432")
    print("User: postgres")
    print("You can now start the application!")

if __name__ == "__main__":
    main() 