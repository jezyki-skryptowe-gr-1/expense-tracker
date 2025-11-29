from dataclasses import dataclass
from decimal import Decimal


@dataclass
class Budget:
    budget_id: int
    user_id: int
    category_id: int
    limit_amount: Decimal
