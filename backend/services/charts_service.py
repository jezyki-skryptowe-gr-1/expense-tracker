from collections import defaultdict
from flask_jwt_extended import get_jwt_identity

from decorators import singleton
from repository import transactions_repository, categories_repository, users_repository


@singleton
class ChartsService:
    def __init__(self):
        pass

    def _current_user(self):
        login = get_jwt_identity()
        return users_repository.get_user_by_username(login)

    def get_charts_data(self):
        user = self._current_user()
        if user is None:
            return None

        # Get all transactions for the user
        all_transactions = transactions_repository.find_by_user(user.user_id)

        # Get all categories for the user
        categories = categories_repository.find_by_user(user.user_id)

        # Create category lookup map
        category_map = {cat.category_id: cat.name for cat in categories}

        # Group transactions by month
        transactions_by_month = defaultdict(list)

        for transaction in all_transactions:
            # Format month as "YYYY-MM"
            month_key = transaction.transaction_date.strftime("%Y-%m")

            expense_data = {
                "expense_id": transaction.transaction_id,
                "category": category_map.get(transaction.category_id, "Unknown"),
                "amount": float(transaction.amount),
                "date": transaction.transaction_date.isoformat(),
                "description": transaction.notes or ""
            }

            transactions_by_month[month_key].append(expense_data)

        # Convert to array format sorted by month
        bar_chart_data = [
            {
                "month": month,
                "expenses": expenses
            }
            for month, expenses in sorted(transactions_by_month.items())
        ]

        # Create category data with colors from database
        category_data = [
            {
                "category_id": cat.category_id,
                "name": cat.name,
                "color": cat.color
            }
            for cat in categories
        ]

        return {
            "barChartData": bar_chart_data,
            "categoryData": category_data
        }
