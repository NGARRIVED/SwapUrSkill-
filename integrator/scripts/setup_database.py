#!/usr/bin/env python3
"""
Database Setup Script for SkillCoterie
This script sets up the PostgreSQL database with schema and sample data.
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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
    # Database connection parameters
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '5432')
    DB_USER = os.getenv('DB_USER', 'postgres')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'skillcoterie')
    
    try:
        # Connect to PostgreSQL server (not to a specific database)
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
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
        
        return DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
        
    except Exception as e:
        print(f"Error creating database: {e}")
        sys.exit(1)

def setup_schema(host, port, user, password, db_name):
    """Set up the database schema."""
    try:
        # Connect to the specific database
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
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

def insert_sample_data(host, port, user, password, db_name):
    """Insert sample data into the database."""
    try:
        # Connect to the database
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
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
    print("🚀 Setting up SkillCoterie Database...")
    print("=" * 50)
    
    # Create database
    db_config = create_database()
    
    # Set up schema
    setup_schema(*db_config)
    
    # Insert sample data
    insert_sample_data(*db_config)
    
    print("=" * 50)
    print("✅ Database setup completed successfully!")
    print(f"Database: {db_config[4]}")
    print(f"Host: {db_config[0]}:{db_config[1]}")
    print("You can now start the application!")

if __name__ == "__main__":
    main() 