import os
import sys

# Ensure root and backend are in Python search path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from backend.app import app

# Vercel Serverless WSGI Handler
handler = app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
