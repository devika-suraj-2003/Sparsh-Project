from pydantic import BaseModel
from datetime import date, datetime


class PurchaseRequisitionCreate(BaseModel):
    selection_id: int

    requested_by: int | None = None

    required_date: date

    priority: str = "Normal"

    remarks: str | None = None


class PurchaseRequisitionResponse(BaseModel):
    pr_id: int

    pr_number: str

    selection_id: int

    requested_by: int | None = None

    required_date: date

    priority: str

    status: str

    remarks: str | None = None

    created_at: datetime

    class Config:
        from_attributes = True

class PurchaseRequisitionUpdate(BaseModel):
    required_date: date

    priority: str

    remarks: str | None = None