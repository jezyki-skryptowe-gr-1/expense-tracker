import hashlib
import db.connection
from entities.user import User
from typing import Optional


def create_user(username, password):
    password_hash = hashlib.sha512(password.encode('utf-8')).hexdigest()

    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO users (username, password_hash) VALUES (%s, %s)",
                        (username, password_hash))
            conn.commit()


def get_all_users() -> list[User]:
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users")
            return [User(user_id, username, password_hash) for user_id, username, password_hash in cur]


def get_user_by_username(username) -> Optional[User]:
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE username = %s", (username,))
            result = cur.fetchone()
            if result is not None:
                return User(result["user_id"], result["username"], result["password_hash"])
            else:
                return None


