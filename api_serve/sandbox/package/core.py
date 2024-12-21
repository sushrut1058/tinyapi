#there's no proper exception handling
#table name needs to replaced in error messages
import sqlite3
import exceptions
from table_dict import table_dict

class Table:
    def __init__(self,table_name: str, connection: sqlite3.Connection = None):
        self.table_name = table_dict[table_name]
        self.connection = connection

    def __checkTableAuthorization():
        pass

    def insert(self,row_data:dict):
        #@todo sql injection prevention
        if not row_data:
            raise exceptions.EmptyArgument
        placeholders = ",".join(["?"]*len(row_data))
        columns = ",".join(row_data.keys())
        values = list(row_data.values())
        query = f"INSERT INTO {self.table_name}({columns}) VALUES({placeholders});"
        self.__execute_query(query, values)

    def fetch(self, filters:dict=None):
        if filters:
            where_clause = " AND ".join(f"{key} = ?" for key in filters)
            query = f"SELECT * FROM {self.table_name} WHERE {where_clause};"
            values = list(filters.values())
        else:
            query = f"SELECT * FROM {self.table_name};"
            values = []
        result = self.__execute_query(query, values)
        return result
    
    def update(self, filters:dict=None, row_data:dict=None):
        if not row_data:
            raise exceptions.EmptyArgument
        set_clause = ", ".join(f"{key} = ?" for key in row_data)
        where_clause = " AND ".join(f"{key} = ?" for key in filters)
        query = f"UPDATE {self.table_name} SET {set_clause} WHERE {where_clause}"
        values = list(set_clause.values()) + list(where_clause.values())
        result = self.__execute_query(query, values)        

    def delete(self, filters:dict=None):
        if not filters:
            pass
        else:
            where_clause = " AND ".join(f"{key} = ?" for key in filters)
            values = list(filters.values())
            query = f"DELETE FROM {self.table_name} WHERE {where_clause}"
            
    def __execute_query(self, query: str, values: list = [], flag: int = 0):
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, values)
            if flag==1:
                pass
            elif flag==2:
                pass
            self.connection.commit()
        except Exception as e:
            self.connection.rollback()
            raise RuntimeError(f"Database Error: {e}")
        finally:
            self.connection.close()

class Executable():
    pass