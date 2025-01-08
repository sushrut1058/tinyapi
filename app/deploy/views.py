from rest_framework import viewsets
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from django.db import transaction, connections
import json, re
import requests

from .models import Api,Table
from .serializers import ApiSerializer, TableSerializer
from . import exceptions
from .helper_api import TableHelper, ApiHelper
import requests

class ApiTest(APIView, ApiHelper):
    permission_classes=[AllowAny]
    def post(self, request):
        try:
            # url = "http://localhost:8080/compile"
            url = "http://172.17.0.1:8080/compile"
            # get code, request payload, parse and send

            fwd_body = {}
            fwd_body["code"] = request.data.get('code')
            fwd_body["payload"] = request.data.get('payload')
            if fwd_body["payload"]==None:
                fwd_body["payload"] = {
                    "query_params": {},
                    "path_params": "",
                    "method": "",
                    "request":{
                        "body":"",
                        "headers":{}
                    }
                }
            else:
                path_params_raw = fwd_body["payload"].get("path_params")
                fwd_body["payload"]["path_params"] = self.parsePathParams_test(path_params_raw)
            fwd_body["user_id"] = 1
            response = requests.post(url, data=json.dumps(fwd_body))
            
            return Response(response.json(), status=200)
        except exceptions.ApiHashConflict:
            return Response({"message":"Duplicate API found. Sorry, this feature is currently not supported"}, status=400)
        except exceptions.GenericDBException:
            return Response({"message":"Something went wrong and we're working on it. Please try again later."}, status=500)
        except Exception as e:
            print(e)
            return Response({"message":"Something went wrong and we're working on it. Please try again later.."}, status=500)


class ApiDeploy(APIView):
    permission_classes=[AllowAny]
    
    def post(self, request):
        try:
            bodyObj = request.data['body']
            # serializer = ApiSerializer(endpoint=bodyObj['endpoint'], method=bodyObj['method'], code=bodyObj['code'], api_data=bodyObj['api_data'])
            serializer = ApiSerializer(data=bodyObj)
            if serializer.is_valid():
                serializer.save()
                return Response({"message":f"Successfully initiated API deployment.Can be accessed at: http://tinyapi.xyz/{serializer['endpoint']}"})
            else:
                print(serializer.errors)
                return Response({"message":"Failed to parse input data for api"}, 400)
        except exceptions.ApiHashConflict:
            return Response({"message":"Duplicate API found. Sorry, this feature is currently not supported"}, status=400)
        except exceptions.GenericDBException:
            return Response({"message":"Something went wrong and we're working on it. Please try again later."}, status=500)
        except Exception as e:
            print(e)
            return Response({"message":"Something went wrong and we're working on it. Please try again later."}, status=500)

    def get(self, request):
        apis = Api.objects.all()
        data = [{"endpoint":api.endpoint, "method":api.method, "updated":api.updated_at, "code":api.code} for api in apis]
        print("Data",data)
        return JsonResponse(data, safe=False)
    
class ApiDelete(APIView):
    permission_classes=[AllowAny]
    
    def post(self, request):
        try:
            print(request.data)
            endpoint = request.data['endpoint']
            Api.objects.get(endpoint=endpoint).delete()
            return JsonResponse({"message":"Deleted endpoint successfully"}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({"message":"Failed to delete endpoint"}, status=500)

class Tables(APIView, TableHelper):
    permission_classes=[AllowAny]
    
    def get(self, request, table_name=None):
        if table_name:    
            try:
                table_name_regex = r'^[a-zA-Z][a-zA-Z0-9_]*$'
                if not re.match(table_name_regex, table_name):
                    raise exceptions.InvalidValueException
                table = Table.objects.filter(table_name=table_name)
                if table.count()==1:
                    #actual table name
                    table_name_uuid = "table_"+str(table[0].table_uuid).replace('-','_')
                    [columns, table_data] = self._fetchTable(table_name_uuid)
                    response = {'name':table_name, 'columns':columns, 'data':table_data}
                    return JsonResponse({"message":response}, status=200)
                elif table.count()==0:
                    return JsonResponse({"message":"No table with the given name could be found"}, status=400)
                else:
                    #@todo: raise some internal flag
                    return JsonResponse({"message":"Something went wrong"}, status=500)                
            except Exception as e:
                print("Exception:", e)
                return JsonResponse({"message":"Something went wrong while fetching the table, please try again after some time..."}, status=500)
        else:
            try:
                tables = Table.objects.all()
                table_list = [{'name':item.table_name, 'fields':item.table_columns} for item in tables ]
                return JsonResponse({"message":table_list}, status=200)
            except Exception as e:
                print("Exception:", e)
                return JsonResponse({"message": "Something went wrong while fetching the table, please try again after some time..."}, status=500)

    def post(self, request):
        try:
            request_data = json.loads(request.body)
            with transaction.atomic():
                table_serializer = TableSerializer(data=request_data)
                if table_serializer.is_valid():
                    table_serializer.save()
                    request_data['table_name'] = (table_serializer.data)['table_uuid'] 
                    self._createTable(request_data)
                    return JsonResponse({"message":"Successfully created table with given specs"}, status=201)
                else:
                    raise exceptions.TableInvalidSerializerException("Invalid Serializer Data")
        except exceptions.TableCreationFailedException as e:
            print(f"Exception: {str(e)}")
            return JsonResponse({"message":"Something went wrong, please try again later..."}, status=400)
        except exceptions.TableInvalidSerializerException as e:
            print(f"Exception: {str(e)}")
            return JsonResponse({"message":"Couldn't create table with given specifications..."}, status=400)
        except Exception as e:
            print(f"Exception: {str(e)}")
            return JsonResponse({"message":"Something went wrong while creating the table, please try again after some time..."}, status=500)

    
    
