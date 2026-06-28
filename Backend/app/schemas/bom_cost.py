from pydantic import BaseModel


class BOMCostResponse(BaseModel):
    version_id: int
    total_components: int
    total_bom_cost: float