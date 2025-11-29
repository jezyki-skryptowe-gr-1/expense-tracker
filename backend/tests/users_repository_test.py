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


@pytest.fixture(scope="module", autouse=True)
def setup_date():
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    init_sql_path = os.path.join(root_dir, "sql", "init.sql")

    with db.connection.get_connection() as conn:
        conn.execute(open(init_sql_path).read())


@pytest.fixture(scope="function", autouse=True)
def clean_data():
    with db.connection.get_connection() as conn:
        conn.execute("TRUNCATE TABLE users CASCADE; TRUNCATE TABLE categories CASCADE; TRUNCATE TABLE transactions CASCADE; TRUNCATE TABLE budgets CASCADE;")


def test_all_users():
    users_repository.create_user("test", "pass")
    all_users = users_repository.get_all_users()

    assert len(all_users) == 1


def test_get_by_username():
    users_repository.create_user("test", "pass")
    users_repository.create_user("test2", "pass")
    user1 = users_repository.get_user_by_username("test")
    user2 = users_repository.get_user_by_username("test2")
    nonExistingUser = users_repository.get_user_by_username("nonexisting")

    assert user1 is not None
    assert user1.username == "test"

    assert user2 is not None
    assert user2.username == "test2"

    assert nonExistingUser is None
