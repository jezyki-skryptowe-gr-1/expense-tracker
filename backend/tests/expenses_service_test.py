from datetime import date
from decimal import Decimal

import db.connection
import repository.transactions_repository as transactions_repository
from services.expenses_service import ExpensesService


def _set_user(login: str, user_id: int):
    with db.connection.get_connection() as conn:
        conn.execute(
            "INSERT INTO users (user_id, username, password_hash) VALUES (%s, %s, 'pw')",
            (user_id, login),
        )


def _set_category(category_id: int, user_id: int, name: str = "cat", color: str = "#000000"):
    with db.connection.get_connection() as conn:
        conn.execute(
            "INSERT INTO categories (category_id, user_id, name, color) VALUES (%s, %s, %s, %s)",
            (category_id, user_id, name, color),
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


def test_get_expenses_list_filters_by_amount(monkeypatch):
    _set_user("u3", 3)
    _set_category(3, 3)
    monkeypatch.setattr("services.expenses_service.get_jwt_identity", lambda: "u3")
    service = ExpensesService.get_singleton()

    service.add_expense(3, 10, transaction_date=date(2026, 1, 1))
    service.add_expense(3, 20, transaction_date=date(2026, 1, 2))
    service.add_expense(3, 30, transaction_date=date(2026, 1, 3))

    def amounts(expenses):
        return sorted(float(t.amount) for t in expenses)

    assert amounts(service.get_expenses_list()) == [10.0, 20.0, 30.0]
    assert amounts(service.get_expenses_list(min_amount=Decimal("20"))) == [20.0, 30.0]
    assert amounts(service.get_expenses_list(max_amount=Decimal("20"))) == [10.0, 20.0]
    assert amounts(service.get_expenses_list(min_amount=Decimal("15"), max_amount=Decimal("25"))) == [20.0]
    assert amounts(service.get_expenses_list(from_date=date(2026, 1, 2))) == [20.0, 30.0]
    assert amounts(service.get_expenses_list(to_date=date(2026, 1, 2))) == [10.0, 20.0]
    assert amounts(service.get_expenses_list(from_date=date(2026, 1, 2), to_date=date(2026, 1, 2))) == [20.0]


def test_get_expenses_list_filters_by_category(monkeypatch):
    _set_user("u4", 4)
    _set_category(4, 4, "food")
    _set_category(5, 4, "travel")
    monkeypatch.setattr("services.expenses_service.get_jwt_identity", lambda: "u4")
    service = ExpensesService.get_singleton()

    service.add_expense(4, 10, transaction_date=date(2026, 2, 1))
    service.add_expense(5, 20, transaction_date=date(2026, 2, 2))
    service.add_expense(4, 30, transaction_date=date(2026, 2, 3))

    def categories(expenses):
        return sorted(t.category_id for t in expenses)

    assert categories(service.get_expenses_list()) == [4, 4, 5]
    assert categories(service.get_expenses_list(category_id=4)) == [4, 4]
    assert categories(service.get_expenses_list(category_id=5)) == [5]
