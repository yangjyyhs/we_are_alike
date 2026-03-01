from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.routes import rooms, participants, admin

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
    )
    
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    application.include_router(rooms.router, prefix=f"{settings.API_V1_STR}/rooms", tags=["rooms"])
    application.include_router(participants.router, prefix=f"{settings.API_V1_STR}", tags=["participants"])
    application.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
    
    @application.get("/health")
    def health_check():
        return {"status": "ok"}
        
    return application

app = create_application()
