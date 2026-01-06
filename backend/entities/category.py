from dataclasses import dataclass


@dataclass
class Category:
    category_id: int
    user_id: int
    name: str
    color: str
