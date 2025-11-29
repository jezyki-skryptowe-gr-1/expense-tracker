import pytest
import os
from testcontainers.postgres import PostgresContainer

import repository.users_repository as users_repository
import db.connection

postgres = PostgresContainer("postgres:17-alpine")


@pytest.fixture(scope="module", autouse=True)
def setup(request):
    postgres.start()

    def remove_container():
        postgres.stop()

    request.addfinalizer(remove_container)
    os.environ["DB_CONN"] = postgres.get_connection_url()
    os.environ["DB_HOST"] = postgres.get_container_host_ip()
    os.environ["DB_PORT"] = str(postgres.get_exposed_port(5432))
    os.environ["DB_USERNAME"] = postgres.username
    os.environ["DB_PASSWORD"] = postgres.password
    os.environ["DB_NAME"] = postgres.dbname


@pytest.fixture(scope="function", autouse=True)
def setup_date():
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    init_sql_path = os.path.join(root_dir, "sql", "init.sql")

    with db.connection.get_connection() as conn:
        conn.execute(open(init_sql_path).read())



def test_all_users():
    users_repository.create_user("test", "pass")
    all_users = users_repository.get_all_users()

    assert len(all_users) == 1
