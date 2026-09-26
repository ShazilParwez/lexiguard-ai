from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    # gemini-embedding-001 is also available if gemini-embedding-2 has quota issues
    gemini_embedding_model: str = "gemini-embedding-2"
    google_cloud_project: str = ""
    max_file_size_mb: int = 10
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
