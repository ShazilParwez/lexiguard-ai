from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes

app = FastAPI(
    title="LexiGuard API",
    description="API for LexiGuard Legal Document Intelligence Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api")

@app.get("/api/health")
async def health_check():
    from app.config import settings
    return {
        "status": "ok",
        "ai_connected": bool(settings.gemini_api_key)
    }
