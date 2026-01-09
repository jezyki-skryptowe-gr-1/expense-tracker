from datetime import date, timedelta
from decimal import Decimal
import db.connection
from services.summary_service import SummaryService


def _set_user(login: str, user_id: int, budget: Decimal | int | float = 0):
    with db.connection.get_connection() as conn:
        conn.execute(
            "INSERT INTO users (user_id, username, password_hash, budget) VALUES (%s, %s, 'pw', %s)",
            (user_id, login, budget),
        )


def _set_category(category_id: int, user_id: int, name: str = "cat", color: str = "#000000"):
    with db.connection.get_connection() as conn:
        conn.execute(
            "INSERT INTO categories (category_id, user_id, name, color) VALUES (%s, %s, %s, %s)",
            (category_id, user_id, name, color),
        )


def _set_transaction(transaction_id: int,
                     user_id: int,
                     category_id: int,
                     amount: Decimal,
                     transaction_date: date,
                     notes: str = ""):
    with db.connection.get_connection() as conn:
        conn.execute(
            """INSERT INTO transactions
                (transaction_id, user_id, category_id, amount, transaction_date, notes)
            VALUES (%s, %s, %s, %s, %s, %s)""",
            (transaction_id, user_id, category_id, amount, transaction_date, notes),
        )


def test_get_summary_returns_correct_data(monkeypatch):
    _set_user("u1", 1, Decimal("700"))
    _set_category(1, 1, "Food")
    _set_category(2, 1, "Transport")

    # Current month transactions
    today = date.today()
    first_day = today.replace(day=1)
    _set_transaction(1, 1, 1, Decimal("100"), first_day, "Groceries")
    _set_transaction(2, 1, 2, Decimal("50"), today, "Bus")

    # Previous month transaction (should not be included)
    prev_month = first_day - timedelta(days=1)
    _set_transaction(3, 1, 1, Decimal("200"), prev_month, "Old expense")

    monkeypatch.setattr("services.summary_service.get_jwt_identity", lambda: "u1")
    service = SummaryService.get_singleton()
    summary = service.get_summary()

    assert summary is not None
    assert summary["totalBalance"] == 700.0
    assert summary["monthlyExpenses"] == 150.0
    assert summary["budgetRemaining"] == 550.0
    assert abs(summary["percentageUsed"] - 21.428571) < 0.01


def test_get_summary_with_no_budgets(monkeypatch):
    _set_user("u1", 1, Decimal("0"))
    _set_category(1, 1, "Food")

    today = date.today()
    _set_transaction(1, 1, 1, Decimal("100"), today, "Expense")

    monkeypatch.setattr("services.summary_service.get_jwt_identity", lambda: "u1")
    service = SummaryService.get_singleton()
    summary = service.get_summary()

    assert summary is not None
    assert summary["totalBalance"] == 0.0
    assert summary["monthlyExpenses"] == 100.0
    assert summary["budgetRemaining"] == -100.0
    assert summary["percentageUsed"] == 0.0


def test_get_summary_with_no_expenses(monkeypatch):
    _set_user("u1", 1, Decimal("500"))
    _set_category(1, 1, "Food")

    monkeypatch.setattr("services.summary_service.get_jwt_identity", lambda: "u1")
    service = SummaryService.get_singleton()
    summary = service.get_summary()

    assert summary is not None
    assert summary["totalBalance"] == 500.0
    assert summary["monthlyExpenses"] == 0.0
    assert summary["budgetRemaining"] == 500.0
    assert summary["percentageUsed"] == 0.0


def test_get_summary_isolates_users(monkeypatch):
    _set_user("u1", 1, Decimal("500"))
    _set_user("u2", 2, Decimal("1000"))
    _set_category(1, 1, "Food")
    _set_category(2, 2, "Food")

    today = date.today()
    _set_transaction(1, 1, 1, Decimal("100"), today, "U1 expense")
    _set_transaction(2, 2, 2, Decimal("200"), today, "U2 expense")

    monkeypatch.setattr("services.summary_service.get_jwt_identity", lambda: "u1")
    service = SummaryService.get_singleton()
    summary = service.get_summary()

    assert summary["totalBalance"] == 500.0
    assert summary["monthlyExpenses"] == 100.0


def test_get_summary_percentage_over_budget(monkeypatch):
    _set_user("u1", 1, Decimal("100"))
    _set_category(1, 1, "Food")

    today = date.today()
    _set_transaction(1, 1, 1, Decimal("150"), today, "Over budget")

    monkeypatch.setattr("services.summary_service.get_jwt_identity", lambda: "u1")
    service = SummaryService.get_singleton()
    summary = service.get_summary()

    assert summary["totalBalance"] == 100.0
    assert summary["monthlyExpenses"] == 150.0
    assert summary["budgetRemaining"] == -50.0
    assert summary["percentageUsed"] == 150.0
