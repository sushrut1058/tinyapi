import re, jwt, datetime

# Secret key for encoding the JWT 
SECRET_KEY = "your_super_secret_key"
ACCESS_TOKEN_EXPIRATION = 60
REFRESH_TOKEN_EXPIRATION = 60*24

class API:    
    def generate_tokens(self, data):
        now = datetime.datetime.utcnow()
        access_token = jwt.encode(
            {
                "user_id": data,
                "exp": now + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRATION)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        refresh_token = jwt.encode(
            {
                "user_id":data,
                "exp":now+datetime.timedelta(minutes=REFRESH_TOKEN_EXPIRATION)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return access_token, refresh_token

    def handler(self, Request, Response):
        try:
            action = Request.params.get('action')
            token = Request.params.get('token')
            if action=='refresh':
                try:
                    decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                    new_access_token, new_refresh_token = self.generate_tokens(decoded['user_id'])
                    return Response({"message":"Token is valid", "user_id":decoded['user_id']}, 200)
                except jwt.ExpiredSignatureError:
                    return Response({"error":"Refresh token is expired"}, 401)
                except jwt.InvalidTokenError:
                    return Response({"error":"Refresh token is invalid"}, 401)
            else:
                return Response({"message":"Invalid action"}, 400)
        except Exception as e:
            return Response({"error":e}, 500)