from datetime import date, timedelta
from flask_jwt_extended import get_jwt_identity

from decorators import singleton
from repository import transactions_repository, budgets_repository, users_repository


@singleton
class SummaryService:
    def __init__(self):
        pass

    def _current_user(self):
        login = get_jwt_identity()
        return users_repository.get_user_by_username(login)

    def get_summary(self):
        user = self._current_user()
        if user is None:
            return None

        # Get current month's date range
        today = date.today()
        first_day_of_month = today.replace(day=1)
        # Calculate last day of month
        if today.month == 12:
            last_day_of_month = today.replace(
                year=today.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            last_day_of_month = today.replace(month=today.month + 1, day=1) - timedelta(days=1)

        # Get all transactions for the user
        all_transactions = transactions_repository.find_by_user(user.user_id)

        # Filter transactions for current month
        monthly_transactions = [
            t for t in all_transactions
            if first_day_of_month <= t.transaction_date <= last_day_of_month
        ]

        # Calculate monthly expenses
        monthly_expenses = sum(t.amount for t in monthly_transactions)

        # Total balance is the global budget from the user entity
        total_balance = user.budget

        # Calculate budget remaining
        budget_remaining = total_balance - monthly_expenses

        # Calculate percentage used
        percentage_used = (monthly_expenses / total_balance * 100) if total_balance > 0 else 0

        return {
            "totalBalance": float(total_balance),
            "monthlyExpenses": float(monthly_expenses),
            "budgetRemaining": float(budget_remaining),
            "percentageUsed": float(percentage_used)
        }
