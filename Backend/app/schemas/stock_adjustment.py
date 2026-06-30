from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class StockAdjustmentCreate(BaseModel):
    item_id: int
    quantity: int
    adjustment_type: str   # INCREASE or DECREASE
    adjustment_date: date
    remarks: str | None = None


class StockAdjustmentResponse(BaseModel):
    adjustment_id: int
    adjustment_number: str
    item_id: int
    quantity: int
    adjustment_type: str
    adjustment_date: date
    remarks: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)