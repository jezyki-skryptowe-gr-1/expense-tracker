import db.connection
from entities.transaction import Transaction


def create_transaction(transaction: Transaction):
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            transaction_id = transaction.transaction_id
            if transaction_id is None:
                cur.execute("SELECT COALESCE(MAX(transaction_id), 0) + 1 AS next_id FROM transactions")
                row = cur.fetchone()
                transaction_id = row["next_id"]

            cur.execute(
                "INSERT INTO transactions (transaction_id, user_id, category_id, amount, transaction_date, notes) VALUES (%s, %s, %s, %s, %s, %s)",
                (
                    transaction_id,
                    transaction.user_id,
                    transaction.category_id,
                    transaction.amount,
                    transaction.transaction_date,
                    transaction.notes,
                ),
            )
            conn.commit()
            return transaction_id


def find_by_user(user_id, from_date=None, to_date=None, min_amount=None, max_amount=None) -> list[Transaction]:
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            query = "SELECT * FROM transactions WHERE user_id = %s"
            params = [user_id]

            if from_date:
                query += " AND transaction_date >= %s"
                params.append(from_date)

            if to_date:
                query += " AND transaction_date <= %s"
                params.append(to_date)

            if min_amount is not None:
                query += " AND amount >= %s"
                params.append(min_amount)

            if max_amount is not None:
                query += " AND amount <= %s"
                params.append(max_amount)

            cur.execute(query, params)
            return [
                Transaction(
                    t["transaction_id"],
                    t["user_id"],
                    t["category_id"],
                    t["amount"],
                    t["transaction_date"],
                    t["notes"],
                )
                for t in cur
            ]


def save_transaction(transaction: Transaction):
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE transactions SET user_id = %s, category_id = %s, amount = %s, transaction_date = %s, notes = %s WHERE transaction_id = %s",
                (
                    transaction.user_id,
                    transaction.category_id,
                    transaction.amount,
                    transaction.transaction_date,
                    transaction.notes,
                    transaction.transaction_id,
                ),
            )
            conn.commit()


def get_transaction(transaction_id: int) -> Transaction | None:
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM transactions WHERE transaction_id = %s", (transaction_id,))
            row = cur.fetchone()
            if row is None:
                return None
            return Transaction(
                row["transaction_id"],
                row["user_id"],
                row["category_id"],
                row["amount"],
                row["transaction_date"],
                row["notes"],
            )


def delete_transaction(transaction_id: int):
    with db.connection.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM transactions WHERE transaction_id = %s", (transaction_id,))
            conn.commit()
