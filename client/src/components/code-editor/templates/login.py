import re, hashlib, jwt, sys
from datetime import datetime, timedelta

class API:
    def __init__(self, db):
        db.connect()
        self.table = db.load("dum")
    
    def generate_jwt(self, email):
        """Generate a JWT for the user."""
        secret_key = "YOUR_SECRET_KEY"  # Replace with your secret key
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour
        }
        token = jwt.encode(payload, secret_key, algorithm="HS256")
        return token

    def handler(self, Request, Response):
        # Get user details
        email = Request.body.get("email")
        password = Request.body.get("password")

        # Validate inputs
        if not all([email, password]):
            return Response({"error": "Missing required fields"}, 400)
        
        # Validate email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return Response({"error": "Invalid email format"},400)

        # Validate password strength
        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters"},400)
        
        try:
            hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
            rows = self.table.fetch({'email':email, 'password':hashed_password})
            if len(rows)>0:
                print(rows[0], file=sys.stderr)
                token = self.generate_jwt(email)
                return Response({"message":{"token":token}}, 200)
            else:
                return Response({"message":"Please check your credentials"}, 401)
        except Exception as e:
            print(e, file=sys.stderr)
            return Response({"error":"Something went wrong"}, 500)  