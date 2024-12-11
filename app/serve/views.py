from rest_framework import viewsets
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from deploy.models import Api
from deploy.serializers import ApiSerializer
from .tasks import execute_api
from celery.result import AsyncResult

class ApiServe(APIView):
    permission_classes=[AllowAny]
    def get(self, request, endpoint):
        try:
            print(endpoint)
            result = execute_api.apply(args=(endpoint, request.data)).get(timeout=10)
            if result==None:
                raise Exception
            return JsonResponse({"result": result})
            # return JsonResponse({"message":endpoint})
        except Exception as e:
            print(e)
            return JsonResponse({"message":"Apologies, the enpoint doesn't exist"})