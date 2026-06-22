from datetime import datetime
from pydantic import BaseModel


class BoardCreate(BaseModel):
    project_id: int
    board_name: str
    description: str | None = None


class BoardResponse(BaseModel):
    board_id: int
    project_id: int
    board_name: str
    description: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True