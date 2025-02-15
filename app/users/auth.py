import jwt
from django.conf import settings
from django.db import transaction, connections, DatabaseError
from deploy.serializers import TableSerializer
from deploy.helper_api import TableHelper

def generate_jwt(payload):
    secret_key = settings.SECRET_KEY
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token

def create_default_tables(id, tearDown=TableHelper()._TableHelper__tearDown):
    status=False
    try:
        # add a row to deploy_table
        table_uuid = ""
        table_data = {
            'table_name':'Users',
            'table_columns':[
                {'name':'email','type':'string'},
                {'name':'username','type':'string'},
                {'name':'password','type':'string'}
            ],
            'user':id
        }

        table_data = TableHelper()._addIDField(table_data)
        
        print(table_data)
        table_serializer = TableSerializer(data=table_data)
        if table_serializer.is_valid():
            with transaction.atomic():
                before_save = transaction.savepoint()
                table_serializer.save()
                # add a table in user_tables.sqlite3
                table_uuid = "table_"+str(table_serializer.data['table_uuid']).replace('-','_')
                users_table_query = f"CREATE TABLE {table_uuid} (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, email VARCHAR(255) NOT NULL UNIQUE, username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL);"
                # now will first create a table, and on success will add the row.
                try:
                    with connections['user_tables'].cursor() as cursor:
                        cursor.execute(users_table_query)
                        print(f"Created table: {table_uuid}")
                        status=True
                except DatabaseError as e:
                    transaction.savepoint_rollback(before_save)
                    raise e
        else:
            raise Exception(table_serializer.errors)
    except Exception as e:
        print("create default tables error:", e)
        tearDown(table_uuid)
    return status