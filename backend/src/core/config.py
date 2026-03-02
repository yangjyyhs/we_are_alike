from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Interactive Rating Game"
    API_V1_STR: str = "/api/v1"
    
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    MAIL_USERNAME: str | None = None
    MAIL_PASSWORD: str | None = None
    MAIL_FROM: str | None = None
    MAIL_PORT: int = 587
    MAIL_SERVER: str | None = None
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True
    
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "https://we-are-alike.vercel.app"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
