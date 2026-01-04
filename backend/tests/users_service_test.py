import db.connection
import repository.budgets_repository as budgets_repository
import repository.users_repository as users_repository
from entities.budget import Budget
from services.users_service import UsersService


def _set_user(login: str, user_id: int):
    with db.connection.get_connection() as conn:
        conn.execute(
            "INSERT INTO users (user_id, username, password_hash) VALUES (%s, %s, 'pw')",
            (user_id, login),
        )


def _set_category(category_id: int, user_id: int, name: str | None = None):
    with db.connection.get_connection() as conn:
        conn.execute(
            "INSERT INTO categories (category_id, user_id, name) VALUES (%s, %s, %s)",
            (category_id, user_id, name or f"cat-{category_id}"),
        )


def test_update_user_replaces_budgets(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1)
    _set_category(2, 1)

    budgets_repository.create_budget(Budget(1, 1, 1, 50.0))
    budgets_repository.create_budget(Budget(2, 1, 2, 75.0))

    monkeypatch.setattr("services.users_service.get_jwt_identity", lambda: "u1")
    service = UsersService.get_singleton()

    service.update_user([{"category_id": 1, "limit_amount": 200.0}])

    user_budgets = budgets_repository.find_by_user(1)
    assert len(user_budgets) == 1
    assert user_budgets[0].category_id == 1
    assert float(user_budgets[0].limit_amount) == 200.0


def test_update_user_ignores_invalid_entries(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1)

    monkeypatch.setattr("services.users_service.get_jwt_identity", lambda: "u1")
    service = UsersService.get_singleton()

    service.update_user([{"category_id": 1}, "not-a-dict", {"limit_amount": 10}])

    assert budgets_repository.find_by_user(1) == []


def test_check_password(monkeypatch):
    users_repository.create_user("user1", "secret")
    service = UsersService.get_singleton()

    assert service.check_password("user1", "secret") is True
    assert service.check_password("user1", "wrong") is False
    assert service.check_password("missing", "any") is False
