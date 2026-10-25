import sqlite3
import os
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# On Vercel serverless environment, filesystem is read-only except /tmp
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    DB_DIR = "/tmp"
    DB_NAME = os.path.join(DB_DIR, "firewall.db")
    seed_db = os.path.join(BASE_DIR, "firewall.db")
    if not os.path.exists(DB_NAME) and os.path.exists(seed_db):
        try:
            shutil.copyfile(seed_db, DB_NAME)
        except Exception:
            pass
else:
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
