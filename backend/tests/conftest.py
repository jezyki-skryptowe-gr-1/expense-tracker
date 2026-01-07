import pytest
import sys
import os

from testcontainers.postgres import PostgresContainer
import db.connection

# /backend
BACKEND_DIR = os.path.dirname(os.path.dirname(__file__))

# Dodaj backend do sys.path
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)


@pytest.fixture(scope="session", autouse=True)
def postgres_container():
    with PostgresContainer("postgres:17-alpine") as postgres:
        os.environ["DB_CONN"] = postgres.get_connection_url()
        os.environ["DB_HOST"] = postgres.get_container_host_ip()
        os.environ["DB_PORT"] = str(postgres.get_exposed_port(5432))
        os.environ["DB_USERNAME"] = postgres.username
        os.environ["DB_PASSWORD"] = postgres.password
        os.environ["DB_NAME"] = postgres.dbname
        yield postgres


@pytest.fixture(scope="session", autouse=True)
def setup_date(postgres_container):
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    init_sql_path = os.path.join(root_dir, "sql", "init.sql")

    with db.connection.get_connection() as conn:
        conn.execute(open(init_sql_path).read())


@pytest.fixture(scope="function", autouse=True)
def clean_data(postgres_container):
    with db.connection.get_connection() as conn:
        conn.execute("TRUNCATE TABLE users CASCADE; TRUNCATE TABLE categories CASCADE; TRUNCATE TABLE transactions CASCADE; TRUNCATE TABLE budgets CASCADE;")
