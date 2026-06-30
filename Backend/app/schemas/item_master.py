from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ItemMasterBase(BaseModel):
    manufacturer_part_number: str
    component_name: str
    description: Optional[str] = None
    unit: str
    category: Optional[str] = None
    minimum_stock: int = 0
    reorder_level: int = 0
    is_active: bool = True


class ItemMasterCreate(ItemMasterBase):
    pass


class ItemMasterUpdate(BaseModel):
    manufacturer_part_number: Optional[str] = None
    component_name: Optional[str] = None
    description: Optional[str] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    minimum_stock: Optional[int] = None
    reorder_level: Optional[int] = None
    is_active: Optional[bool] = None


class ItemMasterResponse(ItemMasterBase):
    item_id: int
    item_code: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)