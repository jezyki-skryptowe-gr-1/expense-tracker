from decorators import singleton
from config import AppConfig
from repository.users_repository import create_user, get_all_users, get_user_by_username, hash_password
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from repository import budgets_repository
from entities.budget import Budget


@singleton
class UsersService:
    """
    Singleton users service
    """

    def __init__(self) -> None:
        self.config = AppConfig.get_singleton()

    def _current_user(self):
        login = get_jwt_identity()
        return get_user_by_username(login)

    def register(self, login, password):
        create_user(login, password)

    def register_user(self, login, password):
        self.register(login, password)

    def check_password(self, login, password):
        user = get_user_by_username(login)
        if user is None:
            return False

        return user.password_hash == hash_password(password)

    def refresh_token(self):
        user = get_jwt_identity()
        return {
            "auth_token": create_access_token(identity=user),
            "refresh_token": create_refresh_token(identity=user)
        }

    def update_user(self, *_args, **_kwargs):
        budgets = _kwargs.get("budget") if _kwargs else None
        if budgets is None and len(_args) > 0:
            budgets = _args[0]

        user = self._current_user()
        if user is None or budgets is None:
            return

        budgets_list = budgets if isinstance(budgets, list) else [budgets]
        budgets_repository.delete_by_user(user.user_id)
        for item in budgets_list:
            if not isinstance(item, dict):
                continue
            category_id = item.get("category_id")
            limit_amount = item.get("limit_amount")
            if category_id is None or limit_amount is None:
                continue
            budgets_repository.create_budget(Budget(None, user.user_id, category_id, limit_amount))
