from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.vendor import Vendor
from app.models.vendor_quote import VendorQuote

from app.schemas.cost_comparison import CostComparisonResponse

router = APIRouter(tags=["Cost Comparison"])


@router.get(
    "/cost-comparison/{bom_id}",
    response_model=CostComparisonResponse
)
def compare_vendor_quotes(
    bom_id: int,
    db: Session = Depends(get_db)
):

    quotes = (
        db.query(VendorQuote)
        .filter(VendorQuote.bom_id == bom_id)
        .all()
    )

    if not quotes:
        raise HTTPException(
            status_code=404,
            detail="No vendor quotes found for this BOM item"
        )

    lowest_price_quote = min(quotes, key=lambda q: q.quoted_price)
    fastest_quote = min(quotes, key=lambda q: q.lead_time_days)

    lowest_vendor = (
        db.query(Vendor)
        .filter(Vendor.id == lowest_price_quote.vendor_id)
        .first()
    )

    fastest_vendor = (
        db.query(Vendor)
        .filter(Vendor.id == fastest_quote.vendor_id)
        .first()
    )

    return CostComparisonResponse(
        bom_id=bom_id,
        quotes_received=len(quotes),
        lowest_price=lowest_price_quote.quoted_price,
        lowest_price_vendor=lowest_vendor.vendor_name,
        shortest_lead_time=fastest_quote.lead_time_days,
        fastest_vendor=fastest_vendor.vendor_name,
    )