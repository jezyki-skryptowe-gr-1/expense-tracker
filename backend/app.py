from __future__ import annotations

import os
from datetime import timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS

from services.categories_service import CategoriesService
from services.users_service import UsersService
from config import AppConfig
from services.expenses_service import ExpensesService
from services.summary_service import SummaryService
from services.charts_service import ChartsService
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies
)


def create_app() -> Flask:
    cfg = AppConfig.get_singleton()
    expenses_service = ExpensesService.get_singleton()
    categories_service = CategoriesService.get_singleton()
    users_service = UsersService.get_singleton()
    summary_service = SummaryService.get_singleton()
    charts_service = ChartsService.get_singleton()

    app = Flask(__name__)

    # JWT
    app.config['SECRET_KEY'] = cfg.secret_key
    app.config["JWT_SECRET_KEY"] = cfg.jwt_secret_key

    app.config['JWT_TOKEN_LOCATION'] = ['cookies']

    app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
    app.config['JWT_REFRESH_COOKIE_NAME'] = 'refresh_token_cookie'

    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_COOKIE_SECURE'] = False
    app.config['JWT_COOKIE_SAMESITE'] = 'Lax'

    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

    jwt = JWTManager(app)

    # CORS
    if cfg.cors_allow_all:
        CORS(app, supports_credentials=True)
    else:
        origins = [o.strip() for o in cfg.cors_origins.split(",") if o.strip()]
        CORS(app, resources={r"/*": {"origins": origins}}, supports_credentials=True)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    @app.get("/api/v1/me")
    @jwt_required()
    def me():
        lgn = get_jwt_identity()
        return jsonify({"login": lgn}), 200

    @app.post("/api/v1/register")
    def add_user():
        data = request.get_json()
        lgn = data["login"]
        password = data["password"]
        users_service.register_user(lgn, password)
        return "", 200

    @app.post("/api/v1/login")
    def login():
        data = request.get_json()
        lgn = data["login"]
        password = data["password"]
        if users_service.check_password(lgn, password):
            access_token = create_access_token(identity=lgn)
            refresh_token = create_refresh_token(identity=lgn)

            response = jsonify({"msg": "login successful"})
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response, 200
        else:
            return "", 401

    @app.put("/api/v1/refresh_token")
    @jwt_required(refresh=True)
    def refresh_token():
        # zwraca cookie http-only
        lgn = get_jwt_identity()
        response = {
            "auth_token": create_access_token(identity=lgn),
            "refresh_token": create_refresh_token(identity=lgn)
        }
        return jsonify(response), 200

    @app.put("/api/v1/update_user")
    @jwt_required()
    def update_user():
        data = request.get_json()
        budget = data["budget"]
        users_service.update_user(budget)
        return jsonify({"status": "ok"}), 200

    @app.post("/api/v1/add_expense")
    @jwt_required()
    def add_expense():
        data = request.get_json()
        category = data["category"]
        amount = data["amount"]
        expenses_service.add_expense(category, amount)
        return jsonify({"status": "ok"}), 200

    @app.put("/api/v1/update_expense")
    @jwt_required()
    def update_expense():
        data = request.get_json()
        expense_id = data["expense_id"]
        category = data["category"]
        amount = data["amount"]
        expenses_service.update_expense(expense_id, category, amount)
        return jsonify({"status": "ok"}), 200

    @app.delete("/api/v1/delete_expense")
    @jwt_required()
    def delete_expense():
        data = request.get_json()
        expense_id = data["expense_id"]
        expenses_service.delete_expense(expense_id)
        return jsonify({"status": "ok"}), 200

    @app.get("/api/v1/expenses")
    @jwt_required()
    def expenses():
        expenses_list = expenses_service.get_expenses_list()
        return jsonify(expenses_list), 200

    @app.post("/api/v1/add_category")
    @jwt_required()
    def add_category():
        data = request.get_json()
        category = data["category"]
        color = data["color"]
        categories_service.add_category(category, color)
        return jsonify({"status": "ok"}), 200

    @app.put("/api/v1/update_category")
    @jwt_required()
    def update_category():
        data = request.get_json()
        category_id = data["category_id"]
        category = data["category"]
        color = data["color"]
        categories_service.update_category(category_id, category, color)
        return jsonify({"status": "ok"}), 200

    @app.delete("/api/v1/delete_category")
    @jwt_required()
    def delete_category():
        data = request.get_json()
        category_id = data["category_id"]
        categories_service.delete_category(category_id)
        return jsonify({"status": "ok"}), 200

    @app.get("/api/v1/categories")
    @jwt_required()
    def categories():
        categories_list = categories_service.get_categories()
        return jsonify({"categories": categories_list}), 200

    @app.get("/api/v1/summary")
    @jwt_required()
    def summary():
        summary_data = summary_service.get_summary()
        return jsonify(summary_data), 200

    @app.get("/api/v1/charts")
    @jwt_required()
    def charts():
        charts_data = charts_service.get_charts_data()
        return jsonify(charts_data), 200

    return app


app = create_app()


if __name__ == "__main__":
    cfg = AppConfig.get_singleton()
    port = int(os.getenv("PORT", cfg.port))
    app.run(host=cfg.host, port=port, debug=cfg.debug)
