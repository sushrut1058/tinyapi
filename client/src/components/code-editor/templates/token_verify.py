import jwt

# Secret key for encoding the JWT 
SECRET_KEY = "your_super_secret_key"

class API:
    def handler(self, Request, Response):
        try:
            action = Request.params.get('action')
            token = Request.params.get('token')
            if action=='verify':
                try:
                    decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                    return Response({"message":"Token is valid", "user_id":decoded['user_id']}, 200)
                except jwt.ExpiredSignatureError:
                    return Response({"error":"Token has expired"}, 401)
                except jwt.InvalidTokenError:
                    return Response({"error":"Invalid token"}, 401)
            else:
                return Response({"message":"Invalid action"}, 400)
        except Exception as e:
            return Response({"error":e}, 500)