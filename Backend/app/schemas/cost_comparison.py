from pydantic import BaseModel


class CostComparisonResponse(BaseModel):
    bom_id: int

    quotes_received: int

    lowest_price: float
    lowest_price_vendor: str

    shortest_lead_time: int
    fastest_vendor: str