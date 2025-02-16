from rest_framework import viewsets
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
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
    permission_classes=[IsAuthenticated]

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
            fwd_body["user_id"] = request.user.id
            
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
    permission_classes=[IsAuthenticated]
    
    def post(self, request):
        try:
            bodyObj = request.data['body']
            bodyObj['user'] = request.user.id
            # serializer = ApiSerializer(endpoint=bodyObj['endpoint'], method=bodyObj['method'], code=bodyObj['code'], api_data=bodyObj['api_data'])
            serializer = ApiSerializer(data=bodyObj)
            if serializer.is_valid():
                serializer.save()
                return Response({"message":f"https://tinyapi.xyz/api/{serializer.data['endpoint']}"})
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

    def get(self, request, endpoint=None):
        if endpoint==None:
            try:
                apis = Api.objects.filter(user=request.user.id)
                data = [{"name":api.api_name, "endpoint":api.endpoint, "method":api.method, "createdAt":api.created_at, "updatedAt":api.updated_at} for api in apis]
                print("Data",data)
                return JsonResponse(data, safe=False)
            except Exception as e:
                print(e)
                return JsonResponse({"message":"Something went wrong"}, status=500)
        else:
            try:
                api = Api.objects.get(user=request.user.id, endpoint=endpoint)
                api_data = json.loads(api.api_data)
                data = {"code":api.code, "api_url":api_data.get('api_url'), "method":api.method}
                return JsonResponse({"message": data}, status=200)
            except Exception as e:
                print(e)
                return JsonResponse({"message":"Error getting details"}, status=500)

    
class ApiDelete(APIView):
    permission_classes=[IsAuthenticated]
    
    def post(self, request):
        try:
            user_id = request.user.id
            endpoint = request.data.get('endpoint')
            if endpoint:
                Api.objects.get(user=user_id, endpoint=endpoint).delete()
                return JsonResponse({"message":"Removed API successfully"}, status=200)
            else:
                return JsonResponse({"message":"Invalid request"}, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({"message":"Failed to remove endpoint"}, status=500)

class ApiUpdate(APIView):
    permission_classes=[IsAuthenticated]

    def post(self, request):
        try:
            code = request.data.get('code')
            endpoint = request.data.get('endpoint')
            user_id = request.user.id
            if code and endpoint and user_id:
                api = Api.objects.filter(user=user_id, endpoint=endpoint)
                if len(api) and api[0].code!=code:
                    api.update(code=code)
                return JsonResponse({"message": "Successfully updated API"}, status=200)    
            else:
                return JsonResponse({"message": "Empty body not allowed."}, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({"message": "Failed to update API"}, status=500)

class TablesCreate(APIView, TableHelper):
    permission_classes=[IsAuthenticated]
    
    def post(self, request):
        try:
            request_data = json.loads(request.body)
            request_data['user'] = request.user.id
            request_data = self._addIDField(request_data)
            print(request_data)
            with transaction.atomic():
                table_serializer = TableSerializer(data=request_data)
                if table_serializer.is_valid():
                    table_serializer.save()
                    request_data['table_name'] = (table_serializer.data)['table_uuid'] 
                    self._createTable(request_data)
                    return JsonResponse({"message":"Successfully created table with given specs"}, status=201)
                else:
                    print(table_serializer.errors)
                    raise exceptions.TableInvalidSerializerException("Invalid Serializer Data")
        
        except exceptions.TableCreationFailedException as e:
            print(f"Exception: {str(e)}")
            return JsonResponse({"message":"Something went wrong, please try again later..."}, status=400)
        except exceptions.TableInvalidSerializerException as e:
            print(f"Exception: {str(e)}")
            return JsonResponse({"message":"Couldn't create table with given specifications..."}, status=400)
        except exceptions.TableDuplicateName as e:
            print(f"Exception: {str(e)}")
            return JsonResponse({"message":"Table with the same name already exists"}, status=400)
        except Exception as e:
            print(f"Exception: {str(e)}")
            return JsonResponse({"message":"Something went wrong while creating the table, please try again after some time..."}, status=500)

class TablesFetch(APIView, TableHelper):
    permission_classes=[IsAuthenticated]
    def get(self, request, table_name=None, category=None):
        if table_name:    
            try:
                table_name_regex = r'^[a-zA-Z][a-zA-Z0-9_]*$'
                if not re.match(table_name_regex, table_name):
                    raise exceptions.InvalidValueException
                table = Table.objects.filter(table_name=table_name, user=request.user.id)
                if table.count()==1:
                    #actual table name
                    table_name_uuid = self.getUUID(table[0].table_uuid)
                    [columns, table_data] = self._fetchTable(table_name_uuid)
                    response = {'name':table_name, 'fields':table[0].table_columns, 'data':table_data}
                    return JsonResponse({"message":response}, status=200)
                elif table.count()==0:
                    return JsonResponse({"message":"No table with the given name could be found"}, status=400)
                else:
                    #@todo: raise some internal flag
                    return JsonResponse({"message":"Something went wrong"}, status=500)                
            except Exception as e:
                print("Exception:", e)
                return JsonResponse({"message":"Something went wrong while fetching the table, please try again after some time..."}, status=500)
        elif category=="schema":
            try:
                tables = Table.objects.filter(user=request.user.id)
                table_list = [{'name':item.table_name, 'fields':item.table_columns} for item in tables ]
                return JsonResponse({"message":table_list}, status=200)
            except Exception as e:
                print("Exception:", e)
                return JsonResponse({"message": "Something went wrong while fetching the table, please try again after some time..."}, status=500)
        else:
            try:
                tables = Table.objects.filter(user=request.user.id)
                table_list = [[self.getUUID(item.table_uuid),len(item.table_columns)] for item in tables]
                # query_lists = 
                return JsonResponse({"message":table_list}, status=200)
            except Exception as e:
                print("Exception:", e)
                return JsonResponse({"message": "Something went wrong while fetching the table, please try again after some time..."}, status=500)

class TablesDelete(APIView, TableHelper):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_id = request.user.id
            table_name = request.data.get('name')
            if table_name:
                tableRow = Table.objects.get(table_name=table_name, user=user_id)
                table_uuid = self.getUUID(tableRow.table_uuid)
                tableRow.delete()
                status = self._deleteTable(table_uuid)
                if status:
                    return JsonResponse({"message": f"Removed table {table_name}"}, status=200)
                else:
                    return JsonResponse({"message": f"Couldn't remove {table_name}"}, status=400)
            else:
                return JsonResponse({"message": f"Invalid request"}, status=400)
        except:
            return JsonResponse({"message": "Something went wrong while removing table"}, status=500)



class TablesEdit(APIView, TableHelper):
    permission_classes=[IsAuthenticated]

    def post(self, request, action=None):
        if action=="update":
            try:
                user_id = request.user.id
                table_name = request.data.get('name')
                table_row = request.data.get('row')
                if table_name and table_row:
                    tableRow = Table.objects.get(table_name=table_name, user=user_id)
                    table_uuid = self.getUUID(tableRow.table_uuid)
                    retVal = self.updateRow(table_uuid, table_row)
                    if retVal:
                        return JsonResponse({"message": "Row updated successfully"}, status=200)
                    else:
                        return JsonResponse({"message": "Couldn't update row"}, status=400)
                else:
                    return JsonResponse({"message": "Invalid request!"}, status=400)
            except Exception as e:
                return JsonResponse({"message": "Something went wrong"}, status=500)
        elif action=="delete":
            try:
                user_id = request.user.id
                table_name = request.data.get('name')
                row_id = request.data.get('row')
                if table_name and row_id:
                    tableRow = Table.objects.get(table_name=table_name, user=user_id)
                    table_uuid = self.getUUID(tableRow.table_uuid)
                    retVal = self.deleteRow(table_uuid, row_id)
                    if retVal:
                        return JsonResponse({"message": "Row deleted successfully"}, status=200)
                    else:
                        return JsonResponse({"message": "Couldn't delete row"}, status=400)
                else:
                    return JsonResponse({"message": "Invalid request!"}, status=400)
            except Exception as e:
                return JsonResponse({"message": "Something went wrong"}, status=500)
        elif action=="create":
            try:
                user_id = request.user.id
                table_name = request.data.get('name')
                table_row = request.data.get('row')
                if table_name and table_row:
                    tableRow = Table.objects.get(table_name=table_name, user=user_id)
                    table_uuid = self.getUUID(tableRow.table_uuid)
                    newIndex = self.createRow(table_uuid, table_row)
                    if newIndex:
                        return JsonResponse({"message": newIndex}, status=200)
                    else:
                        return JsonResponse({"message": "Couldn't delete row"}, status=400)
                else:
                    return JsonResponse({"message": "Invalid request!"}, status=400)
            except Exception as e:
                return JsonResponse({"message": "Something went wrong"}, status=500)
        else:
            return JsonResponse({"message": "Bad Request"}, status=400)