from datetime import date, datetime
from pydantic import BaseModel


class ProjectCreate(BaseModel):
    project_code: str
    project_name: str
    customer_name: str
    description: str | None = None
    start_date: date | None = None
    target_date: date | None = None


class ProjectResponse(BaseModel):
    project_id: int
    project_code: str
    project_name: str
    customer_name: str
    description: str | None = None
    start_date: date | None = None
    target_date: date | None = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True