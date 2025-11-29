from __future__ import annotations

import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from services.categories_service import CategoriesService
from services.users_service import UsersService
from config import AppConfig
from services.expenses_service import ExpensesService


def create_app() -> Flask:
    cfg = AppConfig.get_singleton()
    expenses_service = ExpensesService.get_singleton()
    categories_service = CategoriesService.get_singleton() #123
    users_service = UsersService.get_singleton()

    app = Flask(__name__)

    # CORS
    if cfg.cors_allow_all:
        CORS(app)
    else:
        origins = [o.strip() for o in cfg.cors_origins.split(",") if o.strip()]
        CORS(app, resources={r"/*": {"origins": origins}})

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    @app.post("/api/v1/me")
    def add_user():
        data = request.get_json()
        lgn = data["login"]
        password = data["password"]
        # zwraca 401 jeśli nie jest zalogowany
        # przyjmuje cookie
        return "", 200

    @app.post("/api/v1/register")
    def add_user_2():
        data = request.get_json()
        lgn = data["login"]
        password = data["password"]
        return "", 200

    @app.post("/api/v1/login")
    def login():
        data = request.get_json()
        lgn = data["login"]
        password = data["password"]
        response = {
            "auth_token": 123   # todo
        }
        return response, 200

    @app.put("/api/v1/refresh_token")
    def refresh_token():
        # zwraca cookie http-only
        response = {
            "refresh_token": users_service.refresh_token()
        }
        return jsonify(response), 200

    @app.put("/api/v1/update_user")
    def update_user():
        data = request.get_json()
        budget = data["budget"]
        users_service.update_user(budget)
        return jsonify({"status": "ok"}), 200

    @app.post("/api/v1/add_expense")
    def add_expense():
        data = request.get_json()
        category = data["category"]
        amount = data["amount"]
        expenses_service.add_expense(category, amount)
        return jsonify({"status": "ok"}), 200

    @app.put("/api/v1/update_expense")
    def update_expense():
        data = request.get_json()
        expense_id = data["expense_id"]
        category = data["category"]
        amount = data["amount"]
        expenses_service.update_expense(expense_id, category, amount)
        return jsonify({"status": "ok"}), 200

    @app.delete("/api/v1/delete_expense")
    def register():
        data = request.get_json()
        expense_id = data["expense_id"]
        expenses_service.delete_expense(expense_id)
        return jsonify({"status": "ok"}), 200

    @app.get("/api/v1/expenses")
    def expenses():
        expenses_list = expenses_service.get_expenses_list()
        return jsonify(expenses_list), 200

    @app.post("/api/v1/add_category")
    def add_category():
        data = request.get_json()
        category = data["category"]
        categories_service.add_category(category)
        return jsonify({"status": "ok"}), 200

    @app.put("/api/v1/update_category")
    def update_category():
        data = request.get_json()
        category_id = data["category_id"]
        category = data["category"]
        categories_service.update_category(category_id, category)
        return jsonify({"status": "ok"}), 200

    @app.delete("/api/v1/delete_category")
    def delete_category():
        data = request.get_json()
        category_id = data["category_id"]
        categories_service.delete_category(category_id)
        return jsonify({"status": "ok"}), 200

    @app.get("/api/v1/categories")
    def categories():
        categories_list = categories_service.get_categories()
        return jsonify({"categories": categories_list}), 200

    return app


app = create_app()


if __name__ == "__main__":
    cfg = AppConfig.get_singleton()
    port = int(os.getenv("PORT", cfg.port))
    app.run(host=cfg.host, port=port, debug=cfg.debug)
