from pydantic import BaseModel


class BOMCreate(BaseModel):
    version_id: int
    line_no: int

    reference_designator: str
    manufacturer_part_number: str

    component_name: str
    description: str

    quantity_per_board: int

    unit: str

    dnp: bool = False

    remarks: str


class BOMResponse(BOMCreate):
    bom_id: int

    class Config:
        from_attributes = True