import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FraudGuard AI"
    VERSION: str = "2.6.0"
    API_V1_STR: str = "/api"
    HOST: str = "0.0.0.0"
    PORT: int = 8008
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:5000",
        "*"
    ]
    # Default to SQLite with easy PostgreSQL override
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./fraudguard.db")
    MODEL_DIR: str = os.getenv("MODEL_DIR", "D:/SQL/fraudshield_ai_v2/fraud_app/models")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

