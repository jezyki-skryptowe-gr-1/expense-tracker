from datetime import date
from decimal import Decimal
import db.connection
from services.charts_service import ChartsService


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


def _set_transaction(transaction_id: int,
                     user_id: int,
                     category_id: int,
                     amount: Decimal,
                     transaction_date: date,
                     notes: str = ""):
    with db.connection.get_connection() as conn:
        conn.execute(
            """
            INSERT INTO
                transactions (transaction_id, user_id, category_id, amount, transaction_date, notes)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (transaction_id, user_id, category_id, amount, transaction_date, notes),
        )


def test_get_charts_data_returns_correct_structure(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1, "Food")
    _set_category(2, 1, "Transport")

    _set_transaction(1, 1, 1, Decimal("100"), date(2024, 1, 15), "Groceries")
    _set_transaction(2, 1, 2, Decimal("50"), date(2024, 1, 20), "Bus")
    _set_transaction(3, 1, 1, Decimal("200"), date(2024, 2, 10), "Restaurant")

    monkeypatch.setattr("services.charts_service.get_jwt_identity", lambda: "u1")
    service = ChartsService.get_singleton()
    charts = service.get_charts_data()

    assert charts is not None
    assert "barChartData" in charts
    assert "categoryData" in charts
    assert isinstance(charts["barChartData"], list)
    assert isinstance(charts["categoryData"], list)


def test_get_charts_data_groups_by_month(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1, "Food")

    _set_transaction(1, 1, 1, Decimal("100"), date(2024, 1, 15), "Jan expense 1")
    _set_transaction(2, 1, 1, Decimal("50"), date(2024, 1, 20), "Jan expense 2")
    _set_transaction(3, 1, 1, Decimal("200"), date(2024, 2, 10), "Feb expense")

    monkeypatch.setattr("services.charts_service.get_jwt_identity", lambda: "u1")
    service = ChartsService.get_singleton()
    charts = service.get_charts_data()

    bar_chart = charts["barChartData"]
    assert len(bar_chart) == 2
    assert bar_chart[0]["month"] == "2024-01"
    assert len(bar_chart[0]["expenses"]) == 2
    assert bar_chart[1]["month"] == "2024-02"
    assert len(bar_chart[1]["expenses"]) == 1


def test_get_charts_data_expense_format(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1, "Food")

    _set_transaction(1, 1, 1, Decimal("100.50"), date(2024, 1, 15), "Test expense")

    monkeypatch.setattr("services.charts_service.get_jwt_identity", lambda: "u1")
    service = ChartsService.get_singleton()
    charts = service.get_charts_data()

    expense = charts["barChartData"][0]["expenses"][0]
    assert expense["expense_id"] == 1
    assert expense["category"] == "Food"
    assert expense["amount"] == 100.50
    assert expense["date"] == "2024-01-15"
    assert expense["description"] == "Test expense"


def test_get_charts_data_category_data(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1, "Food")
    _set_category(2, 1, "Transport")
    _set_category(3, 1, "Entertainment")

    monkeypatch.setattr("services.charts_service.get_jwt_identity", lambda: "u1")
    service = ChartsService.get_singleton()
    charts = service.get_charts_data()

    category_data = charts["categoryData"]
    assert len(category_data) == 3

    for cat in category_data:
        assert "category_id" in cat
        assert "name" in cat
        assert "color" in cat
        assert cat["color"].startswith("#")


def test_get_charts_data_isolates_users(monkeypatch):
    _set_user("u1", 1)
    _set_user("u2", 2)
    _set_category(1, 1, "Food")
    _set_category(2, 2, "Food")

    _set_transaction(1, 1, 1, Decimal("100"), date(2024, 1, 15), "U1 expense")
    _set_transaction(2, 2, 2, Decimal("200"), date(2024, 1, 15), "U2 expense")

    monkeypatch.setattr("services.charts_service.get_jwt_identity", lambda: "u1")
    service = ChartsService.get_singleton()
    charts = service.get_charts_data()

    assert len(charts["barChartData"][0]["expenses"]) == 1
    assert charts["barChartData"][0]["expenses"][0]["expense_id"] == 1
    assert len(charts["categoryData"]) == 1
    assert charts["categoryData"][0]["name"] == "Food"


def test_get_charts_data_empty_transactions(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1, "Food")

    monkeypatch.setattr("services.charts_service.get_jwt_identity", lambda: "u1")
    service = ChartsService.get_singleton()
    charts = service.get_charts_data()

    assert charts["barChartData"] == []
    assert len(charts["categoryData"]) == 1


def test_get_charts_data_sorts_months(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1, "Food")

    _set_transaction(1, 1, 1, Decimal("100"), date(2024, 3, 15), "March")
    _set_transaction(2, 1, 1, Decimal("50"), date(2024, 1, 20), "January")
    _set_transaction(3, 1, 1, Decimal("200"), date(2024, 2, 10), "February")

    monkeypatch.setattr("services.charts_service.get_jwt_identity", lambda: "u1")
    service = ChartsService.get_singleton()
    charts = service.get_charts_data()

    months = [item["month"] for item in charts["barChartData"]]
    assert months == ["2024-01", "2024-02", "2024-03"]


def test_get_charts_data_handles_empty_notes(monkeypatch):
    _set_user("u1", 1)
    _set_category(1, 1, "Food")

    _set_transaction(1, 1, 1, Decimal("100"), date(2024, 1, 15), "")

    monkeypatch.setattr("services.charts_service.get_jwt_identity", lambda: "u1")
    service = ChartsService.get_singleton()
    charts = service.get_charts_data()

    expense = charts["barChartData"][0]["expenses"][0]
    assert expense["description"] == ""
