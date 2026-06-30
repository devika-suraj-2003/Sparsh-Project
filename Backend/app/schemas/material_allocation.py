from datetime import datetime
from pydantic import BaseModel, ConfigDict


class MaterialAllocationResponse(BaseModel):
    allocation_id: int
    work_order_id: int
    item_id: int
    required_quantity: int
    issued_quantity: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)