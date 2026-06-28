from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class RFQBase(BaseModel):
    version_id: int
    rfq_number: str
    title: str

    description: Optional[str] = None

    issue_date: date
    due_date: date

    status: Optional[str] = "Draft"


class RFQCreate(RFQBase):
    pass


class RFQResponse(RFQBase):
    rfq_id: int
    created_at: datetime

    class Config:
        from_attributes = True