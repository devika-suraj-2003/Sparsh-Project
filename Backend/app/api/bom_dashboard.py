from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.dependencies import get_db

from app.models.bom import BOM
from app.models.vendor_quote import VendorQuote

from app.schemas.bom_dashboard import BOMDashboardResponse

router = APIRouter(tags=["BOM Dashboard"])


@router.get(
    "/bom-dashboard/{version_id}",
    response_model=BOMDashboardResponse
)
def bom_dashboard(
    version_id: int,
    db: Session = Depends(get_db)
):

    bom_items = (
        db.query(BOM)
        .filter(BOM.version_id == version_id)
        .all()
    )

    if not bom_items:
        raise HTTPException(
            status_code=404,
            detail="No BOM found for this version"
        )

    total_components = len(bom_items)

    quoted_components = 0
    total_cost = 0.0

    for item in bom_items:

        lowest_price = (
            db.query(func.min(VendorQuote.quoted_price))
            .filter(VendorQuote.bom_id == item.bom_id)
            .scalar()
        )

        if lowest_price is None:
            continue

        quoted_components += 1

        total_cost += (
            item.quantity_per_board * lowest_price
        )

    missing_quotes = total_components - quoted_components

    quote_coverage = round(
        (quoted_components / total_components) * 100,
        2
    )

    return BOMDashboardResponse(
        version_id=version_id,
        total_components=total_components,
        quoted_components=quoted_components,
        missing_quotes=missing_quotes,
        quote_coverage=quote_coverage,
        total_bom_cost=round(total_cost, 2)
    )