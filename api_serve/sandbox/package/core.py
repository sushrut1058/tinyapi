#there's no proper exception handling
#table name needs to replaced in error messages
import sqlite3, sys
from table_dict import table_dict
import utils

class DB:
    def __init__(self):
        self.table_name = ""
        self.table : Table = None
        self.conn : sqlite3.Connection = None

    def connect(self):
        self.conn = sqlite3.connect("/db/user_tables.sqlite3")

    def load(self,table_name):
        self.table_name = table_name
        self.table = Table(table_name, self.conn)
        return self.table

class Table:
    def __init__(self,table_name: str, connection: sqlite3.Connection = None):
        self.table_name = table_dict[table_name]
        self.connection = connection

    def __checkTableAuthorization(self):
        if self.table_name==None:
            return False
        return True

    def insert(self,row_data:dict) -> bool:
        #@todo sql injection prevention
        try:
            if not row_data:
                raise utils.EmptyArgument
            elif not isinstance(row_data,dict):
                raise TypeError
            try:
                placeholders = ",".join(["?"]*len(row_data))
                columns = ",".join(row_data.keys())
                values = list(row_data.values())
                query = f"INSERT INTO {self.table_name}({columns}) VALUES({placeholders});"
            except:
                raise utils.InvalidArgs
            retVal, affected_rows = self.__execute_query(query, values)
            return retVal, affected_rows
        except utils.InvalidArgs:
            print("Invalid argument passed to insert(arg: dict)", file=sys.stderr)
            return False, 0  
        except utils.EmptyArgument:
            print("Expecting at least 1 argument to insert(arg: dict)", file=sys.stderr)
            return False, 0
        except Exception as e:
            print("Something went wrong with inserting your row", file=sys.stderr)
            return False, 0

    def fetch(self, filters:dict=None) -> bool:
        try:
            if filters:
                if not isinstance(filters, dict):
                    raise utils.InvalidArgs
                where_clause = " AND ".join(f"{key} = ?" for key in filters)
                query = f"SELECT * FROM {self.table_name} WHERE {where_clause};"
                values = list(filters.values())
            else:
                query = f"SELECT * FROM {self.table_name};"
                values = []
        except:
            print ("Invalid arguments provided to fetch(filters: dict)", file=sys.stderr)
            return []
        try:
            result = self.__execute_query(query, values, 1)
            return result
        except:
            print("Query failed, invalid input", file=sys.stderr)
            return []
    
    def update(self, filters:dict=None, row_data:dict=None):
        if not row_data:
            raise utils.EmptyArgument
        try:
            set_clause = ", ".join(f"{key} = ?" for key in row_data)
            where_clause = " AND ".join(f"{key} = ?" for key in filters)
            query = f"UPDATE {self.table_name} SET {set_clause} WHERE {where_clause}"
            values = list(row_data.values()) + list(filters.values())
            result, affected_rows = self.__execute_query(query, values)  
            return result, affected_rows
        except:
            print("Invalid arguments passed to update(filters: dict, row_data: dict)", file=sys.stderr)
            return False, 0

    def delete(self, filters:dict=None):
        if not filters:
            return False, 0
        else:
            where_clause = " AND ".join(f"{key} = ?" for key in filters)
            values = list(filters.values())
            query = f"DELETE FROM {self.table_name} WHERE {where_clause}"
            retVal, affected_rows = self.__execute_query(query, values)
            return retVal, affected_rows
            
    def __execute_query(self, query: str, values: list = [], flag: int = 0):
        retVal = False
        affected_rows = 0
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, values)
            affected_rows = cursor.rowcount
            if flag==1:
                rows = cursor.fetchall()
                if isinstance(rows, list):
                    return rows
                else:
                    return []
            self.connection.commit()
            retVal = True
        except Exception as e:
            self.connection.rollback()
            print (f"Database Error: {e}", file=sys.stderr)
        return retVal, affected_rows