from dataclasses import dataclass
from decimal import Decimal
from datetime import date


@dataclass
class Transaction:
    transaction_id: int
    user_id: int
    category_id: int

    amount: Decimal
    transaction_date: date
    notes: str
