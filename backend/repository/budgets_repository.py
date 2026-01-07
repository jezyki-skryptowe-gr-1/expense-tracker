import db.connection
from entities.budget import Budget

def create_budget(budget: Budget):
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO budgets (user_id, category_id, limit_amount) VALUES (%s, %s, %s)",
                        (budget.user_id, budget.category_id, budget.limit_amount))
            conn.commit()

def find_by_user(user_id) -> list[Budget]:
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM budgets WHERE user_id = %s", (user_id,))
            return [Budget(b["budget_id"], b["user_id"], b["category_id"], b["limit_amount"]) for b in cur]


def delete_by_user(user_id: int):
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM budgets WHERE user_id = %s", (user_id,))
            conn.commit()


