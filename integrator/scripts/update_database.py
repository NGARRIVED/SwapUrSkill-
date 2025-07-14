#!/usr/bin/env python3
"""
Database Update Script for SkillCoterie
This script updates the existing database with new authentication tables and fields.
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

def update_database():
    """Update the existing database with new schema."""
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
        
        print("Updating database schema...")
        
        # Read the updated schema
        schema_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'src', 'database', 'schema.sql')
        schema_sql = read_sql_file(schema_path)
        
        # Split the SQL into individual statements
        statements = schema_sql.split(';')
        
        for statement in statements:
            statement = statement.strip()
            if statement and not statement.startswith('--'):
                try:
                    cursor.execute(statement)
                    print(f"Executed: {statement[:50]}...")
                except psycopg2.Error as e:
                    if "already exists" in str(e):
                        print(f"Skipped (already exists): {statement[:50]}...")
                    else:
                        print(f"Error executing: {statement[:50]}... - {e}")
        
        print("Database schema updated successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error updating database: {e}")
        sys.exit(1)

def main():
    """Main function to update the database."""
    print("🔄 Updating SkillCoterie Database Schema...")
    print("=" * 60)
    
    # Update database schema
    update_database()
    
    print("=" * 60)
    print("✅ Database update completed successfully!")
    print("You can now start the application!")

if __name__ == "__main__":
    main() 