from dataclasses import dataclass


from decimal import Decimal


@dataclass
class User:
    user_id: int
    username: str
    password_hash: str
    budget: Decimal
