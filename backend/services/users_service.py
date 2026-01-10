from decorators import singleton
from config import AppConfig
from repository.users_repository import create_user, get_all_users, get_user_by_username, hash_password, update_user_budget
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from entities.category import Category
from repository import categories_repository


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

    def register(self, login, password, budget=0):
        create_user(login, password, budget)

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

    def update_user_budget(self, budget):
        user = self._current_user()
        if user is None or budget is None:
            return

        if isinstance(budget, (int, float, str)):
            update_user_budget(user.user_id, float(budget))
