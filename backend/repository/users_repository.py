import hashlib
import db.connection
from entities.user import User
from typing import Optional


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def create_user(username, password, budget=0):
    password_hash = hash_password(password)

    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO users (username, password_hash, budget) VALUES (%s, %s, %s)",
                        (username, password_hash, budget))
            conn.commit()


def get_all_users() -> list[User]:
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users")
            return [User(user_id, username, password_hash, budget) for user_id, username, password_hash, budget in cur]


def get_user_by_username(username) -> Optional[User]:
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE username = %s", (username,))
            result = cur.fetchone()
            if result is not None:
                return User(result["user_id"], result["username"], result["password_hash"], result["budget"])
            else:
                return None


def update_user_budget(user_id: int, budget: float):
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET budget = %s WHERE user_id = %s", (budget, user_id))
            conn.commit()


