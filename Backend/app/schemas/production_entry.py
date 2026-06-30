from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class ProductionEntryCreate(BaseModel):
    work_order_id: int
    produced_quantity: int
    rejected_quantity: int = 0
    production_date: date
    remarks: str | None = None


class ProductionEntryResponse(BaseModel):
    production_id: int
    work_order_id: int
    produced_quantity: int
    rejected_quantity: int
    production_date: date
    remarks: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)