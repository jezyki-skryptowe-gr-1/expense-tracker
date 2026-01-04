import pytest

import repository.budgets_repository as budgets_repository
import db.connection
from entities.budget import Budget


@pytest.fixture(scope="function", autouse=True)
def setup_test_user_and_categories():
    # Create a test user with id 1
    with db.connection.get_connection() as conn:
        conn.execute("INSERT INTO users (user_id, username, password_hash) VALUES (1, 'test_user', 'password')")
        # Insert test categories
        conn.execute("INSERT INTO categories (category_id, user_id, name) VALUES (1, 1, 'Test Category 1'), (2, 1, 'Test Category 2')")


def test_create_and_find_budget():
    # Create a budget
    budget = Budget(budget_id = None, user_id=1, category_id=1, limit_amount=1000.0)
    budgets_repository.create_budget(budget)

    # Retrieve budgets for the user
    user_budgets = budgets_repository.find_by_user(1)

    # Assertions
    assert len(user_budgets) == 1
    print(user_budgets)
    assert user_budgets[0].user_id == 1
    assert user_budgets[0].category_id == 1
    assert user_budgets[0].limit_amount == 1000.0


def test_find_by_user_no_budgets():
    # Retrieve budgets for a user with no budgets
    user_budgets = budgets_repository.find_by_user(1)

    # Assertions
    assert len(user_budgets) == 0


def test_find_by_user_multiple_budgets():
    # Create multiple budgets for the same user
    budget1 = Budget(budget_id = None, user_id=1, category_id=1, limit_amount=1000.0)
    budget2 = Budget(budget_id = None, user_id=1, category_id=2, limit_amount=2000.0)
    budgets_repository.create_budget(budget1)
    budgets_repository.create_budget(budget2)

    # Retrieve budgets for the user
    user_budgets = budgets_repository.find_by_user(1)

    # Assertions
    assert len(user_budgets) == 2
    assert {budget.category_id for budget in user_budgets} == {1, 2}
    assert {budget.limit_amount for budget in user_budgets} == {1000.0, 2000.0}
