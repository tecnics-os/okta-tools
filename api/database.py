import sqlite3
import config
database_name = config.database
log_file= config.log_file

class database:
    def init_table(self):
        table_query = '''CREATE TABLE IF NOT EXISTS metadata(
        entityId varchar(255) primary key,
        signOnUrl varchar(255));'''
        database.execute_sql_query(table_query)
        
    def execute_sql_query(sql_query):
        connection = sqlite3.connect(database_name)
        try:
            cursor = connection.cursor()
            cursor.execute(sql_query)
            connection.commit()
            
        except sqlite3.Error as err:
            f = open(log_file, "a")
            f.write(str(err))
            f.close()
        return cursor.fetchall()
        

