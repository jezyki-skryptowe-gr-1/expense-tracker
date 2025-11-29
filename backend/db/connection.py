import psycopg
from psycopg.rows import dict_row

from config import AppConfig


def get_connection():
    cfg = AppConfig.get_singleton()
    host = cfg.db_host
    port = cfg.db_port
    username = cfg.db_username
    password = cfg.db_password
    database = cfg.database
    return psycopg.connect(f"host={host} dbname={database} user={username} password={password} port={port}", row_factory=dict_row)
