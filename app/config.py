"""Application configuration."""

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    # ClickHouse configuration
    clickhouse_host: str = "localhost"
    clickhouse_port: int = 8123
    clickhouse_user: str = "default"
    clickhouse_password: str = ""
    clickhouse_database: str = "matchmaking"

    # API configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    # Logging configuration
    log_level: str = "INFO"

    # MCP Server configuration
    mcp_server_url: str = "http://localhost:3000"
    s3_bucket_name: str = "pitch-decks"

    # Embedding configuration
    embedding_model: str = "text-embedding-ada-002"
    embedding_dimension: int = 768

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
