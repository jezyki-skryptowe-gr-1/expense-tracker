import db.connection
from entities.category import Category


def create_category(category: Category):
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO categories (user_id, name, color) VALUES (%s, %s, %s)",
                        (category.user_id, category.name, category.color))
            conn.commit()


def find_by_user(user_id) -> list[Category]:
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM categories WHERE user_id = %s", (user_id,))
            return [
                Category(
                    category["category_id"],
                    category["user_id"],
                    category["name"],
                    category["color"],
                )
                for category in cur
            ]


def save_category(category: Category):
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE categories SET user_id = %s, name = %s, color = %s WHERE category_id = %s",
                (category.user_id, category.name, category.color, category.category_id)
                )
            conn.commit()


def delete_category(category_id: int):
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM categories WHERE category_id = %s", (category_id,))
            conn.commit()
