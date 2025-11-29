import threading
from typing import Type, Any


def singleton(cls: Type[Any]) -> Type[Any]:
    """
    Class decorator to make any class a thread-safe singleton and inject
    a `get_singleton()` classmethod for accessing the singleton.

    Usage:
        @singleton
        class MyService:
            ...

        svc = MyService.get_singleton()
    """
    lock = threading.Lock()
    _instance_attr = "_singleton_instance"

    # Ensure no name collision
    if hasattr(cls, _instance_attr):
        raise AttributeError(f"{cls.__name__} already defines '{_instance_attr}'") # Hello!

    setattr(cls, _instance_attr, None)

    @classmethod
    def get_singleton(inner_cls, *args, **kwargs):
        # Double-checked locking
        if getattr(inner_cls, _instance_attr) is None:
            with lock:
                if getattr(inner_cls, _instance_attr) is None:
                    instance = inner_cls(*args, **kwargs)  # type: ignore[misc]
                    setattr(inner_cls, _instance_attr, instance)
        return getattr(inner_cls, _instance_attr)

    # Attach the accessor
    setattr(cls, "get_singleton", get_singleton)
    return cls

