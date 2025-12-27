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
            return Response({"message":"Duplicate API detected. This exact API configuration already exists."}, status=400)
        except exceptions.GenericDBException as e:
            print(f"Database error in ApiTest: {e}")
            return Response({"message":"Database error occurred. Please try again later."}, status=500)
        except requests.RequestException as e:
            print(f"Request error in ApiTest: {e}")
            return Response({"message":"Failed to connect to compilation service. Please try again."}, status=503)
        except Exception as e:
            print(f"Unexpected error in ApiTest: {e}")
            return Response({"message":"An unexpected error occurred. Please try again later."}, status=500)


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
                print(f"API serializer validation errors: {serializer.errors}")
                return Response({"message":"Invalid API data provided. Please check your input."}, 400)
        except exceptions.ApiHashConflict:
            return Response({"message":"Duplicate API detected. This exact API configuration already exists."}, status=400)
        except exceptions.GenericDBException as e:
            print(f"Database error in ApiDeploy: {e}")
            return Response({"message":"Database error occurred. Please try again later."}, status=500)
        except KeyError as e:
            print(f"Missing required field in ApiDeploy: {e}")
            return Response({"message":"Missing required field in request body."}, status=400)
        except Exception as e:
            print(f"Unexpected error in ApiDeploy: {e}")
            return Response({"message":"An unexpected error occurred. Please try again later."}, status=500)

    def get(self, request, endpoint=None):
        if endpoint==None:
            try:
                apis = Api.objects.filter(user=request.user.id)
                data = [{"name":api.api_name, "endpoint":api.endpoint, "method":api.method, "createdAt":api.created_at, "updatedAt":api.updated_at} for api in apis]
                print(f"Fetched {len(data)} APIs for user {request.user.id}")
                return JsonResponse(data, safe=False)
            except Exception as e:
                print(f"Error fetching APIs list: {e}")
                return JsonResponse({"message":"Failed to retrieve APIs. Please try again."}, status=500)
        else:
            try:
                api = Api.objects.get(user=request.user.id, endpoint=endpoint)
                api_data = json.loads(api.api_data)
                data = {"code":api.code, "api_url":api_data.get('api_url'), "method":api.method}
                return JsonResponse({"message": data}, status=200)
            except Api.DoesNotExist:
                print(f"API not found: {endpoint} for user {request.user.id}")
                return JsonResponse({"message":"API not found."}, status=404)
            except json.JSONDecodeError as e:
                print(f"Invalid JSON in API data: {e}")
                return JsonResponse({"message":"Invalid API configuration data."}, status=500)
            except Exception as e:
                print(f"Error getting API details: {e}")
                return JsonResponse({"message":"Failed to retrieve API details."}, status=500)

    
class ApiDelete(APIView):
    permission_classes=[IsAuthenticated]
    
    def post(self, request):
        try:
            user_id = request.user.id
            endpoint = request.data.get('endpoint')
            if endpoint:
                Api.objects.get(user=user_id, endpoint=endpoint).delete()
                print(f"Deleted API {endpoint} for user {user_id}")
                return JsonResponse({"message":"API removed successfully"}, status=200)
            else:
                return JsonResponse({"message":"Endpoint parameter is required."}, status=400)
        except Api.DoesNotExist:
            print(f"API not found for deletion: {endpoint} for user {user_id}")
            return JsonResponse({"message":"API not found."}, status=404)
        except Exception as e:
            print(f"Error deleting API {endpoint}: {e}")
            return JsonResponse({"message":"Failed to delete API. Please try again."}, status=500)

class ApiUpdate(APIView):
    permission_classes=[IsAuthenticated]

    def post(self, request):
        try:
            code = request.data.get('code')
            endpoint = request.data.get('endpoint')
            user_id = request.user.id

            if not code or not endpoint:
                return JsonResponse({"message": "Both 'code' and 'endpoint' are required."}, status=400)

            api = Api.objects.filter(user=user_id, endpoint=endpoint)
            if not api.exists():
                return JsonResponse({"message": "API not found."}, status=404)

            if api[0].code != code:
                api.update(code=code)
                print(f"Updated API {endpoint} for user {user_id}")
                return JsonResponse({"message": "API updated successfully"}, status=200)
            else:
                return JsonResponse({"message": "No changes detected."}, status=200)
        except Exception as e:
            print(f"Error updating API: {e}")
            return JsonResponse({"message": "Failed to update API. Please try again."}, status=500)

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
            print(f"Table creation failed: {str(e)}")
            return JsonResponse({"message": f"Table creation failed: {str(e)}"}, status=400)
        except exceptions.TableInvalidSerializerException as e:
            print(f"Invalid table specification: {str(e)}")
            return JsonResponse({"message":"Invalid table specifications. Please check column names and types."}, status=400)
        except exceptions.TableDuplicateName as e:
            print(f"Duplicate table name: {str(e)}")
            return JsonResponse({"message":"A table with this name already exists. Please choose a different name."}, status=400)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON in request: {str(e)}")
            return JsonResponse({"message":"Invalid JSON format in request body."}, status=400)
        except Exception as e:
            print(f"Unexpected error creating table: {str(e)}")
            return JsonResponse({"message":"Failed to create table. Please try again."}, status=500)

class TablesFetch(APIView, TableHelper):
    permission_classes=[IsAuthenticated]
    def get(self, request, table_name=None, category=None):
        if table_name:    
            try:
                table_name_regex = r'^[a-zA-Z][a-zA-Z0-9_]*$'
                if not re.match(table_name_regex, table_name):
                    return JsonResponse({"message":"Invalid table name format. Use only alphanumeric characters and underscores."}, status=400)

                table = Table.objects.filter(table_name=table_name, user=request.user.id)
                if table.count()==1:
                    #actual table name
                    table_name_uuid = self.getUUID(table[0].table_uuid)
                    [columns, table_data] = self._fetchTable(table_name_uuid)
                    response = {'name':table_name, 'fields':table[0].table_columns, 'data':table_data}
                    return JsonResponse({"message":response}, status=200)
                elif table.count()==0:
                    return JsonResponse({"message":"Table not found."}, status=404)
                else:
                    # Multiple tables with same name (data integrity issue)
                    print(f"Warning: Multiple tables found with name {table_name} for user {request.user.id}")
                    return JsonResponse({"message":"Data integrity error detected. Please contact support."}, status=500)
            except Exception as e:
                print(f"Error fetching table {table_name}: {e}")
                return JsonResponse({"message":"Failed to fetch table data. Please try again."}, status=500)
        elif category=="schema":
            try:
                tables = Table.objects.filter(user=request.user.id)
                table_list = [{'name':item.table_name, 'fields':item.table_columns} for item in tables ]
                return JsonResponse({"message":table_list}, status=200)
            except Exception as e:
                print(f"Error fetching table schemas: {e}")
                return JsonResponse({"message": "Failed to fetch table schemas. Please try again."}, status=500)
        else:
            try:
                tables = Table.objects.filter(user=request.user.id)
                table_list = [[self.getUUID(item.table_uuid),len(item.table_columns)] for item in tables]
                return JsonResponse({"message":table_list}, status=200)
            except Exception as e:
                print(f"Error fetching tables list: {e}")
                return JsonResponse({"message": "Failed to fetch tables. Please try again."}, status=500)

class TablesDelete(APIView, TableHelper):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_id = request.user.id
            table_name = request.data.get('name')

            if not table_name:
                return JsonResponse({"message": "Table name is required."}, status=400)

            tableRow = Table.objects.get(table_name=table_name, user=user_id)
            table_uuid = self.getUUID(tableRow.table_uuid)
            tableRow.delete()
            status = self._deleteTable(table_uuid)

            if status:
                print(f"Deleted table {table_name} for user {user_id}")
                return JsonResponse({"message": f"Table '{table_name}' deleted successfully"}, status=200)
            else:
                print(f"Failed to delete physical table {table_uuid}")
                return JsonResponse({"message": f"Failed to delete table data. Metadata removed."}, status=500)
        except Table.DoesNotExist:
            print(f"Table not found for deletion: {table_name} for user {user_id}")
            return JsonResponse({"message": "Table not found."}, status=404)
        except Exception as e:
            print(f"Error deleting table {table_name}: {e}")
            return JsonResponse({"message": "Failed to delete table. Please try again."}, status=500)



class TablesEdit(APIView, TableHelper):
    permission_classes=[IsAuthenticated]

    def post(self, request, action=None):
        if action=="update":
            try:
                user_id = request.user.id
                table_name = request.data.get('name')
                table_row = request.data.get('row')

                if not table_name or not table_row:
                    return JsonResponse({"message": "Both 'name' and 'row' are required."}, status=400)

                tableRow = Table.objects.get(table_name=table_name, user=user_id)
                table_uuid = self.getUUID(tableRow.table_uuid)
                retVal = self.updateRow(table_uuid, table_row)

                if retVal:
                    print(f"Updated row in table {table_name} for user {user_id}")
                    return JsonResponse({"message": "Row updated successfully"}, status=200)
                else:
                    return JsonResponse({"message": "Failed to update row. Check your data."}, status=400)
            except Table.DoesNotExist:
                return JsonResponse({"message": "Table not found."}, status=404)
            except Exception as e:
                print(f"Error updating row in {table_name}: {e}")
                return JsonResponse({"message": "Failed to update row. Please try again."}, status=500)
        elif action=="delete":
            try:
                user_id = request.user.id
                table_name = request.data.get('name')
                row_id = request.data.get('row')

                if not table_name or not row_id:
                    return JsonResponse({"message": "Both 'name' and 'row' are required."}, status=400)

                tableRow = Table.objects.get(table_name=table_name, user=user_id)
                table_uuid = self.getUUID(tableRow.table_uuid)
                retVal = self.deleteRow(table_uuid, row_id)

                if retVal:
                    print(f"Deleted row {row_id} from table {table_name}")
                    return JsonResponse({"message": "Row deleted successfully"}, status=200)
                else:
                    return JsonResponse({"message": "Failed to delete row. Row may not exist."}, status=400)
            except Table.DoesNotExist:
                return JsonResponse({"message": "Table not found."}, status=404)
            except Exception as e:
                print(f"Error deleting row from {table_name}: {e}")
                return JsonResponse({"message": "Failed to delete row. Please try again."}, status=500)
        elif action=="create":
            try:
                user_id = request.user.id
                table_name = request.data.get('name')
                table_row = request.data.get('row')

                if not table_name or not table_row:
                    return JsonResponse({"message": "Both 'name' and 'row' are required."}, status=400)

                tableRow = Table.objects.get(table_name=table_name, user=user_id)
                table_uuid = self.getUUID(tableRow.table_uuid)
                newIndex = self.createRow(table_uuid, table_row)

                if newIndex:
                    print(f"Created row {newIndex} in table {table_name}")
                    return JsonResponse({"message": newIndex}, status=200)
                else:
                    return JsonResponse({"message": "Failed to create row. Check your data."}, status=400)
            except Table.DoesNotExist:
                return JsonResponse({"message": "Table not found."}, status=404)
            except Exception as e:
                print(f"Error creating row in {table_name}: {e}")
                return JsonResponse({"message": "Failed to create row. Please try again."}, status=500)
        else:
            return JsonResponse({"message": f"Invalid action '{action}'. Use 'create', 'update', or 'delete'."}, status=400)