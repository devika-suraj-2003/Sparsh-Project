from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class WorkOrderCreate(BaseModel):
    version_id: int
    planned_quantity: int
    start_date: date
    target_date: date
    remarks: str | None = None


class WorkOrderResponse(BaseModel):
    work_order_id: int
    work_order_number: str
    version_id: int
    planned_quantity: int
    start_date: date
    target_date: date
    status: str
    remarks: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)