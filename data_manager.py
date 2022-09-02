import database_connection


@database_connection.connection_handler
def add_user(cursor, username, password):
    query = """
    INSERT INTO users(username, password)
    VALUES(%(un)s, %(pw)s);
    """
    cursor.execute(query, {'un': username, 'pw': password})


@database_connection.connection_handler
def get_user(cursor, username):
    query = """
    SELECT username, password FROM users WHERE username = %(un)s;
    """
    cursor.execute(query, {'un': username})
    return cursor.fetchone()
