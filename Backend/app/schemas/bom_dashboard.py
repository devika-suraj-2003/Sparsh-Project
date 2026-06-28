from pydantic import BaseModel


class BOMDashboardResponse(BaseModel):
    version_id: int

    total_components: int

    quoted_components: int

    missing_quotes: int

    quote_coverage: float

    total_bom_cost: float