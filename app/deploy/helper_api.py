from . import exceptions
from django.db import connections
import json

class ApiHelper:
    def parsePathParams_test(self, path_params_raw):
        path_params = {}
        for item in path_params_raw:
            path_params[item['key']]=item['value']
        return path_params

    def parsePathParams_deploy(self, path_params_raw):
        path_params = [item['key'] for item in path_params_raw]
        return path_params

class TableHelper:
    def _createTable(self, jsonObj):
        #serialize
        table_name = "table_"+jsonObj.get("table_name").replace('-','_')
        raw_table_columns = jsonObj.get("table_columns")[1:]
        col_dict_ref = {
            "string": "VARCHAR(255)",
            "integer":"INTEGER",
            "float":"FLOAT",
            "boolean":"BOOLEAN",
            "date":"DATETIME DEFAULT CURRENT_TIMESTAMP"
            }
        table_columns = [{"name":item["name"],"type":col_dict_ref[item["type"]]} for item in raw_table_columns]
        print("Processed col",table_columns)
        '''
        @todo: validation of columns required
        '''
        ########### CREATE TABLE ############
        try:
            primary_key = "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT"
            column_definitions = ", ".join(f"{col['name']} {col['type']}" for col in table_columns)
            create_table_query = f"CREATE TABLE {table_name} ({primary_key}, {column_definitions});"
            print(column_definitions, create_table_query)
            with connections['user_tables'].cursor() as cursor:
                cursor.execute(create_table_query)
                print(f"Created Table: {table_name}")
        except Exception as e:
            print(f"Couldn't create table:{table_name}")
            self.__tearDown(table_name)
            raise exceptions.TableCreationFailedException(f"[Table creation failed- {e}]")
    
    def __tearDown(self, table_name):
        try:
            #DROP TABLE
            drop_table_query = f"DROP TABLE {table_name};"
            with connections["user_tables"].cursor() as cursor:
                cursor.execute(drop_table_query)
            print(f"Dropped Table {table_name}")
        except Exception as e:
            #@todo: raise internal alarm 
            pass

    def _fetchTable(self, table_name):
        try:
            fetch_query = f"SELECT * FROM {table_name};"
            with connections["user_tables"].cursor() as cursor:
                cursor.execute(fetch_query)
                columns = [col[0] for col in cursor.description]
                rows = cursor.fetchall()
                data = [dict(zip(columns, row)) for row in rows]
                return [columns, data]
        except Exception as e:
            raise e
        
    def getUUID(self, rawData):
        return "table_"+str(rawData).replace('-','_')
    
    def _addIDField(self, rawData):
        obj = rawData['table_columns']
        for item in obj:
            if item['name']=='id':
                raise Exception("Please use a different field name, id is already taken for default primary key")
        rawData['table_columns'].insert(0,{'name':'id', 'type':'integer'})
        return rawData