import db.connection
import repository.categories_repository as categories_repository
import repository.users_repository as users_repository
from services.categories_service import CategoriesService


def _set_user(login: str, user_id: int):
    with db.connection.get_connection() as conn:
        conn.execute(
            "INSERT INTO users (user_id, username, password_hash) VALUES (%s, %s, 'pw')",
            (user_id, login),
        )


def _set_category(category_id: int, user_id: int, name: str = "cat"):
    with db.connection.get_connection() as conn:
        conn.execute(
            "INSERT INTO categories (category_id, user_id, name) VALUES (%s, %s, %s)",
            (category_id, user_id, name),
        )


def test_delete_category_allows_owner(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1, "to-delete")
    monkeypatch.setattr("services.categories_service.get_jwt_identity", lambda: "u1")
    service = CategoriesService.get_singleton()

    service.delete_category(1)

    assert categories_repository.find_by_user(1) == []


def test_delete_category_blocks_other_user(monkeypatch):
    _set_user("u1", 1)
    _set_user("u2", 2)
    _set_category(1, 1, "owned")
    monkeypatch.setattr("services.categories_service.get_jwt_identity", lambda: "u2")
    service = CategoriesService.get_singleton()

    service.delete_category(1)

    # Category remains because user 2 is not the owner
    assert len(categories_repository.find_by_user(1)) == 1
