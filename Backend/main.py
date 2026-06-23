from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.user import router as user_router
from app.api.project import router as project_router
from app.api.board import router as board_router
from app.api.version import router as version_router
from app.api.bom import router as bom_router
from app.api.bom_upload import router as bom_upload


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(project_router)
app.include_router(board_router)
app.include_router(version_router)
app.include_router(bom_router)
app.include_router(bom_upload)

@app.get("/")
def root():
    return {"message": "SparshIQ Backend Running"}