# Nwgt7Hrp
import re, hashlib

class API:
    def __init__(self, db):
        db.connect()
        self.table = db.load("dum")

    def handler(self, Request, Response):
        # Get user details
        email = Request.body.get("email")
        password = Request.body.get("password")
        username = Request.body.get("username")

        # Validate inputs
        if not all([email, password, username]):
            return Response({"error": "Missing required fields"}, 400)
        
        # Validate username        
        if not re.match(r"^[a-zA-Z0-9_]+$", username):
            return Response({"error": "Invalid username format"}, 400)

        # Validate email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return Response({"error": "Invalid email format"},400)

        # Validate password strength
        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters"},400)

        try:
            # Hash password
            hashed_password = hashlib.sha256(password.encode('utf-8'))

            # Store user in database (simplified)
            new_user = {
                "username": username,
                "email": email,
                "password": hashed_password.hexdigest()
            }
            status, affected_rows = self.table.insert(new_user)  # Insert data into table
            if status and affected_rows==1:
                return Response({
                    "message": "User registered successfully",
                    "username": username
                }, 200)
            else:
                return Response({"error":"Internal server error"}, 500)
            
        except Exception as e:
            return Response({"error": str(e)}, 500)
        
# {
#     "username":"sushrut1058",
#     "email": "sushrut1058@gmail.com",
#     "password":"3dsrfsfsffs242"
# }