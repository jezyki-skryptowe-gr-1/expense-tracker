from datetime import date

from flask_jwt_extended import get_jwt_identity

from decorators import singleton
from entities.transaction import Transaction
from repository import transactions_repository, users_repository


@singleton
class ExpensesService:
    def __init__(self):
        pass

    def _current_user(self):
        login = get_jwt_identity()
        return users_repository.get_user_by_username(login)

    def add_expense(self, category_id, amount, notes: str = ""):
        user = self._current_user()
        if user is None:
            return None

        transaction = Transaction(
            transaction_id=None,
            user_id=user.user_id,
            category_id=category_id,
            amount=amount,
            transaction_date=date.today(),
            notes=notes,
        )
        return transactions_repository.create_transaction(transaction)

    def update_expense(self, expense_id, category_id, amount, notes: str = None):
        user = self._current_user()
        if user is None:
            return

        existing = transactions_repository.get_transaction(expense_id)
        if existing is None or existing.user_id != user.user_id:
            return

        updated = Transaction(
            transaction_id=expense_id,
            user_id=user.user_id,
            category_id=category_id,
            amount=amount,
            transaction_date=existing.transaction_date,
            notes=notes if notes is not None else existing.notes,
        )
        transactions_repository.save_transaction(updated)

    def delete_expense(self, expense_id):
        user = self._current_user()
        if user is None:
            return

        existing = transactions_repository.get_transaction(expense_id)
        if existing is None or existing.user_id != user.user_id:
            return

        transactions_repository.delete_transaction(expense_id)

    def get_expenses_list(self):
        user = self._current_user()
        if user is None:
            return []
        return [t.__dict__ for t in transactions_repository.find_by_user(user.user_id)]
