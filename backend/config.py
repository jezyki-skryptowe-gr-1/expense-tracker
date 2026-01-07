import os
from decorators import singleton


@singleton
class AppConfig:
    """Application configuration as a Singleton accessible via Config.get_instance()."""

    def __init__(self) -> None:
        # Backend
        self.host: str = os.getenv("HOST", "0.0.0.0")
        self.port: int = int(os.getenv("PORT", "5000"))
        self.debug: bool = os.getenv("FLASK_DEBUG", "false").lower() == "true"

        # CORS
        self.cors_allow_all: bool = os.getenv("CORS_ALLOW_ALL", "true").lower() == "true"
        self.cors_origins: str = os.getenv("CORS_ORIGINS", "*")  # comma-separated

        #DB
        self.db_host = os.getenv("DB_HOST", "0.0.0.0")
        self.db_port = os.getenv("DB_PORT", "5432")
        self.db_username = os.getenv("DB_USERNAME", "postgres")
        self.db_password = os.getenv("DB_PASSWORD", "postgres")
        self.database = os.getenv("DB_NAME", "postgres")

        # Security
        self.secret_key = os.getenv("SECRET_KEY", "your_strong_secret_key")
        self.jwt_secret_key = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")

