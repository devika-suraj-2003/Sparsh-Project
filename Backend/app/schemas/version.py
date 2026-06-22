from datetime import datetime
from pydantic import BaseModel


class VersionCreate(BaseModel):
    board_id: int
    version_name: str
    description: str | None = None


class VersionResponse(BaseModel):
    version_id: int
    board_id: int
    version_name: str
    description: str | None = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True