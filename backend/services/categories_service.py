from flask_jwt_extended import get_jwt_identity

from decorators import singleton
from entities.category import Category
from repository import categories_repository, users_repository


@singleton
class CategoriesService:
    def __init__(self):
        pass

    def _current_user(self):
        login = get_jwt_identity()
        return users_repository.get_user_by_username(login)

    def add_category(self, name, color):
        user = self._current_user()
        if user is None:
            return
        categories_repository.create_category(Category(None, user.user_id, name, color))

    def update_category(self, category_id, name, color=None):
        user = self._current_user()
        if user is None:
            return
        user_categories = categories_repository.find_by_user(user.user_id)
        existing = next((c for c in user_categories if c.category_id == category_id), None)
        if existing:
            updated_color = color if color is not None else existing.color
            categories_repository.save_category(
                Category(category_id, user.user_id, name, updated_color))

    def delete_category(self, category_id):
        user = self._current_user()
        if user is None:
            return

        user_categories = categories_repository.find_by_user(user.user_id)
        if any(c.category_id == category_id for c in user_categories):
            categories_repository.delete_category(category_id)

    def get_categories(self):
        user = self._current_user()
        if user is None:
            return []
        return [c.__dict__ for c in categories_repository.find_by_user(user.user_id)]
