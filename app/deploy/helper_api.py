from . import exceptions
from django.db import connections
import json
import re

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
    def _validate_identifier(self, identifier):
        """Validate SQL identifiers (table/column names) to prevent SQL injection"""
        if not isinstance(identifier, str):
            raise exceptions.TableCreationFailedException("Invalid identifier type")
        # Allow only alphanumeric characters and underscores, must start with letter or underscore
        if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', identifier):
            raise exceptions.TableCreationFailedException(f"Invalid identifier: {identifier}")
        # Prevent SQL keywords (basic list)
        sql_keywords = {'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TABLE', 'FROM', 'WHERE'}
        if identifier.upper() in sql_keywords:
            raise exceptions.TableCreationFailedException(f"SQL keyword not allowed as identifier: {identifier}")
        return identifier

    def _validate_column_name(self, column_name):
        """Validate column names"""
        return self._validate_identifier(column_name)

    def _createTable(self, jsonObj):
        #serialize
        table_name_raw = jsonObj.get("table_name").replace('-','_')
        table_name = "table_" + table_name_raw
        # Validate table name
        self._validate_identifier(table_name)

        raw_table_columns = jsonObj.get("table_columns")[1:]
        col_dict_ref = {
            "string": "VARCHAR(255)",
            "integer":"INTEGER",
            "float":"FLOAT",
            "boolean":"BOOLEAN",
            "date":"DATETIME DEFAULT CURRENT_TIMESTAMP"
            }

        # Validate column names and types
        table_columns = []
        for item in raw_table_columns:
            col_name = self._validate_column_name(item["name"])
            col_type = col_dict_ref.get(item["type"])
            if not col_type:
                raise exceptions.TableCreationFailedException(f"Invalid column type: {item['type']}")
            table_columns.append({"name": col_name, "type": col_type})

        print("Processed columns:", table_columns)

        ########### CREATE TABLE ############
        try:
            primary_key = "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT"
            # Column names are validated, safe to use in query
            column_definitions = ", ".join(f"{col['name']} {col['type']}" for col in table_columns)
            create_table_query = f"CREATE TABLE {table_name} ({primary_key}, {column_definitions});"
            print("Create table query:", create_table_query)
            with connections['user_tables'].cursor() as cursor:
                cursor.execute(create_table_query)
                print(f"Created Table: {table_name}")
        except Exception as e:
            print(f"Couldn't create table: {table_name} - Error: {e}")
            self.__tearDown(table_name)
            raise exceptions.TableCreationFailedException(f"Table creation failed: {str(e)}")
    
    def __tearDown(self, table_name):
        try:
            # Validate table name before dropping
            self._validate_identifier(table_name)
            drop_table_query = f"DROP TABLE {table_name};"
            with connections["user_tables"].cursor() as cursor:
                cursor.execute(drop_table_query)
            print(f"Dropped Table {table_name}")
        except Exception as e:
            print(f"Warning: Failed to drop table {table_name}: {e}")
            # Log this error - table cleanup failed

    def _fetchTable(self, table_name):
        try:
            # Validate table name
            self._validate_identifier(table_name)
            fetch_query = f"SELECT * FROM {table_name};"
            with connections["user_tables"].cursor() as cursor:
                cursor.execute(fetch_query)
                columns = [col[0] for col in cursor.description]
                rows = cursor.fetchall()
                data = [dict(zip(columns, row)) for row in rows]
                return [columns, data]
        except Exception as e:
            print(f"Error fetching table {table_name}: {e}")
            raise
        
    def _deleteTable(self, table_name):
        try:
            # Validate table name
            self._validate_identifier(table_name)
            delete_query = f"DROP table {table_name};"
            with connections["user_tables"].cursor() as cursor:
                cursor.execute(delete_query)
            connections["user_tables"].commit()
            return True
        except Exception as e:
            print(f"Error deleting table {table_name}: {e}")
            return False
        
    def getUUID(self, rawData):
        return "table_"+str(rawData).replace('-','_')
    
    def _addIDField(self, rawData):
        obj = rawData['table_columns']
        for item in obj:
            if item['name']=='id':
                raise Exception("Please use a different field name, id is already taken for default primary key")
        rawData['table_columns'].insert(0,{'name':'id', 'type':'integer'})
        return rawData
    
    def updateRow(self, tableName, dataDict):
        try:
            # Validate table name
            self._validate_identifier(tableName)

            where_clause = f"id = %s"
            columns = []
            values = []
            row_id = dataDict.get('id')

            if not row_id:
                raise ValueError("Row ID is required for update")

            for key in dataDict:
                if key != 'id':
                    # Validate column names to prevent SQL injection
                    self._validate_column_name(key)
                    columns.append(key)
                    values.append(dataDict[key])

            if not columns:
                raise ValueError("No columns to update")

            set_clause = ", ".join(f"{column} = %s" for column in columns)
            query = f"UPDATE {tableName} SET {set_clause} WHERE {where_clause}"
            values.append(row_id)

            with connections['user_tables'].cursor() as cursor:
                cursor.execute(query, values)
            connections['user_tables'].commit()
            return True
        except Exception as e:
            print(f"Error updating row in {tableName}: {e}")
            return False
    
    def deleteRow(self, tableName, row_id):
        try:
            # Validate table name
            self._validate_identifier(tableName)

            # Use parameterized query to prevent SQL injection
            query = f"DELETE FROM {tableName} WHERE id = %s"
            print(f"Deleting row {row_id} from {tableName}")

            with connections['user_tables'].cursor() as cursor:
                cursor.execute(query, [int(row_id)])
            connections['user_tables'].commit()
            return True
        except (ValueError, TypeError) as e:
            print(f"Invalid row ID: {e}")
            return False
        except Exception as e:
            print(f"Error deleting row from {tableName}: {e}")
            return False
    
    def createRow(self, tableName, dataDict):
        try:
            # Validate table name
            self._validate_identifier(tableName)

            if 'id' in dataDict:
                del dataDict['id']

            if not dataDict:
                raise ValueError("No data provided for row creation")

            # Validate all column names
            validated_columns = []
            for key in dataDict.keys():
                self._validate_column_name(key)
                validated_columns.append(key)

            columns = ", ".join(validated_columns)
            values = list(dataDict.values())
            placeholders = ", ".join(["%s"] * len(dataDict))
            query = f"INSERT INTO {tableName}({columns}) VALUES({placeholders})"
            print(f"Creating row in {tableName}")

            with connections['user_tables'].cursor() as cursor:
                cursor.execute(query, values)
                new_id = cursor.lastrowid
            connections['user_tables'].commit()
            return new_id
        except Exception as e:
            print(f"Error creating row in {tableName}: {e}")
            return None