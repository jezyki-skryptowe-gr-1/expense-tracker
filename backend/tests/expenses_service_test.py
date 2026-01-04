import db.connection
import repository.categories_repository as categories_repository
import repository.transactions_repository as transactions_repository
import repository.users_repository as users_repository
from services.expenses_service import ExpensesService


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


def test_delete_expense_allows_owner(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1)
    monkeypatch.setattr("services.expenses_service.get_jwt_identity", lambda: "u1")

    service = ExpensesService.get_singleton()
    expense_id = service.add_expense(1, 50)

    assert transactions_repository.get_transaction(expense_id) is not None
    service.delete_expense(expense_id)
    assert transactions_repository.get_transaction(expense_id) is None


def test_delete_expense_blocks_other_user(monkeypatch):
    _set_user("u1", 1)
    _set_user("u2", 2)
    _set_category(1, 1)
    monkeypatch.setattr("services.expenses_service.get_jwt_identity", lambda: "u1")
    service = ExpensesService.get_singleton()
    expense_id = service.add_expense(1, 75)

    monkeypatch.setattr("services.expenses_service.get_jwt_identity", lambda: "u2")
    service.delete_expense(expense_id)

    # Still present because owner differs
    assert transactions_repository.get_transaction(expense_id) is not None


def test_update_expense_updates_owned(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1)
    monkeypatch.setattr("services.expenses_service.get_jwt_identity", lambda: "u1")
    service = ExpensesService.get_singleton()
    expense_id = service.add_expense(1, 50, "old")

    service.update_expense(expense_id, 1, 75, "updated")

    txn = transactions_repository.get_transaction(expense_id)
    assert txn is not None
    assert float(txn.amount) == 75.0
    assert txn.notes == "updated"


def test_update_expense_blocks_other_user(monkeypatch):
    _set_user("u1", 1)
    _set_user("u2", 2)
    _set_category(1, 1)
    monkeypatch.setattr("services.expenses_service.get_jwt_identity", lambda: "u1")
    service = ExpensesService.get_singleton()
    expense_id = service.add_expense(1, 25, "original")

    monkeypatch.setattr("services.expenses_service.get_jwt_identity", lambda: "u2")
    service.update_expense(expense_id, 1, 999, "hijack")

    txn = transactions_repository.get_transaction(expense_id)
    assert txn is not None
    assert float(txn.amount) == 25.0
    assert txn.notes == "original"
