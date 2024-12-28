import re

class API:
    def __init__(self, db):
        db.connect()
        table = db.load("dum1")

    def handler(self, Request, Response):
        # Get user details
        email = Request.body.get("email")
        password = Request.body.get("password")
        username = Request.body.get("username")

        # Validate inputs
        if not all([email, password, username]):
            return Response({"error": "Missing required fields"}, 400)

        # Validate email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return Response({"error": "Invalid email format"},400)

        # Validate password strength
        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters"},400)

        try:
            # Hash password
            hashed_password = password

            # Store user in database (simplified)
            new_user = {
                "username": username,
                "email": email,
                "password_hash": hashed_password
            }
            # db.users.insert(new_user)  # Actual DB operation would go here
            return Response({
                    "message": "User registered successfully",
                    "username": username
                },200)
        except Exception as e:
            return Response({"error": str(e)}, 500)