import db.connection
import repository.users_repository as users_repository
from services.users_service import UsersService


def _set_user(login: str, user_id: int, budget: float = 0):
    with db.connection.get_connection() as conn:
        conn.execute(
            "INSERT INTO users (user_id, username, password_hash, budget) VALUES (%s, %s, 'pw', %s)",
            (user_id, login, budget),
        )


def _get_user_budget(user_id: int) -> float:
    with db.connection.get_connection() as conn:
        result = conn.execute("SELECT budget FROM users WHERE user_id = %s", (user_id,)).fetchone()
        return float(result["budget"]) if result else 0.0


def test_update_user_updates_budget(monkeypatch):
    _set_user("u1", 1, 50.0)

    monkeypatch.setattr("services.users_service.get_jwt_identity", lambda: "u1")
    service = UsersService.get_singleton()

    service.update_user_budget(200.0)

    assert _get_user_budget(1) == 200.0


def test_update_user_ignores_invalid_entries(monkeypatch):
    _set_user("u1", 1, 75.0)

    monkeypatch.setattr("services.users_service.get_jwt_identity", lambda: "u1")
    service = UsersService.get_singleton()

    service.update_user_budget({"not": "numeric"})

    assert _get_user_budget(1) == 75.0


def test_check_password(monkeypatch):
    users_repository.create_user("user1", "secret")
    service = UsersService.get_singleton()

    assert service.check_password("user1", "secret") is True
    assert service.check_password("user1", "wrong") is False
    assert service.check_password("missing", "any") is False
