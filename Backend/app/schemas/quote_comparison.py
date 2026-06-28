from pydantic import BaseModel
from typing import List
from datetime import date


class VendorComparison(BaseModel):
    vendor_name: str
    quote_number: str | None = None

    quoted_price: float

    currency: str

    moq: int | None = None

    lead_time_days: int | None = None

    valid_until: date | None = None

    payment_terms: str | None = None

    quote_status: str | None = None

    rank: int


class QuoteComparisonResponse(BaseModel):
    rfq_id: int

    total_quotes: int

    lowest_price: float

    highest_price: float

    average_price: float

    best_vendor: str

    vendors: List[VendorComparison]