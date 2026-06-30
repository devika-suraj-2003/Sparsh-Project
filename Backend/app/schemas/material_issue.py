from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class MaterialIssueCreate(BaseModel):
    item_id: int
    quantity: int
    issue_date: date
    issued_to: str
    remarks: str | None = None


class MaterialIssueResponse(BaseModel):
    issue_id: int
    issue_number: str
    item_id: int
    quantity: int
    issue_date: date
    issued_to: str
    remarks: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)