import sqlite3
import os

# Always create database inside backend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "firewall.db")

def get_connection():
    return sqlite3.connect(DB_NAME)

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS firewall (
        id INTEGER PRIMARY KEY,
        strength INTEGER
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attack_type TEXT,
        severity TEXT,
        damage INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS firewall_actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("SELECT COUNT(*) FROM firewall")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO firewall (strength) VALUES (100)")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_tables()
    print("Database initialized successfully")
