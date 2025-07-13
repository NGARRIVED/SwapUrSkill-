from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .routes import auth
from .database.database import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="SkillCoterie API",
    description="Luxury Skill Exchange Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")

@app.get('/')
def read_root():
    return {
        "message": "Welcome to SkillCoterie API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get('/health')
def health_check():
    return {"status": "healthy"} 