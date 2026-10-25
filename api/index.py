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

class VercelPathFixMiddleware:
    """
    Normalizes PATH_INFO when Vercel rewrites routes to /api/index.py
    Ensures Flask receives the original matched path (e.g. /api/status, /api/attacks)
    """
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        matched_path = environ.get("HTTP_X_MATCHED_PATH")
        if matched_path and matched_path not in ("/api/index.py", "/api/index"):
            environ["PATH_INFO"] = matched_path
        elif environ.get("PATH_INFO") in ("/api/index.py", "/api/index"):
            environ["PATH_INFO"] = "/api"
        return self.wsgi_app(environ, start_response)

app.wsgi_app = VercelPathFixMiddleware(app.wsgi_app)

# Vercel Serverless WSGI Handler
handler = app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
