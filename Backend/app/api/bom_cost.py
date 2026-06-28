from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.dependencies import get_db

from app.models.bom import BOM
from app.models.vendor_quote import VendorQuote

from app.schemas.bom_cost import BOMCostResponse

router = APIRouter(tags=["BOM Cost"])


@router.get(
    "/bom-cost/{version_id}",
    response_model=BOMCostResponse
)
def calculate_bom_cost(
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

    total_cost = 0.0

    for item in bom_items:

        lowest_quote = (
            db.query(func.min(VendorQuote.quoted_price))
            .filter(VendorQuote.bom_id == item.bom_id)
            .scalar()
        )

        if lowest_quote is None:
            continue

        total_cost += (
            item.quantity_per_board * lowest_quote
        )

    return BOMCostResponse(
        version_id=version_id,
        total_components=len(bom_items),
        total_bom_cost=round(total_cost, 2)
    )