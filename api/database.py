import sqlite3
from sqlite3.dbapi2 import Cursor
import config
database_name = config.database
log_file= config.log_file

class database:
    def init_table():
        table_query = '''CREATE TABLE IF NOT EXISTS metadata(
        entityId varchar(255) primary key,
        signOnUrl varchar(255));'''
        database.execute_sql_query(table_query)
        
    def execute_sql_query(sql_query):
        conn = sqlite3.connect(database_name)
        with conn:
            try:
                cursor = conn.cursor()
                cursor.execute(sql_query)
            except sqlite3.Error as err:
                f = open(log_file, "a")
                f.write(str(err) + "\n")
                f.close()
            return cursor.fetchall()
        

