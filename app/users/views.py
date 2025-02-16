import json
import jwt
from google.auth.transport import requests
from google.oauth2 import id_token
from django.conf import settings
from django.http import JsonResponse
from decouple import config
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import UserSerializer
from deploy.models import Table
from deploy.serializers import TableSerializer
from .auth import generate_jwt, create_default_tables
  
class AuthView(APIView):
    permission_classes = [AllowAny]
  
    def post(self, request):
        try:
            # verify credential
            google_auth_token = request.data.get('token')
            id_info = id_token.verify_oauth2_token(google_auth_token, requests.Request(), config('GOOGLE_CLIENT_ID'), clock_skew_in_seconds=10)
            # find user
            email = id_info.get('email')
            social_full_name = id_info.get('name')
            user, created = CustomUser.objects.get_or_create(email=email)

            # create table(s)
            if created:
                print("User not signed up")
                tables_status = create_default_tables(user.id)
                if tables_status==False:
                    raise Exception("Unable to create tables!")
            else:
                print("User already has an account!")
            #create jwt
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return JsonResponse({"access_token": access_token, "user": {"email": email, "name": user.full_name}}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({"message": "Sorry something went wrong, please try logging in after some time..."}, status=500)

class AuthStatus(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return JsonResponse({},status=200)