from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.vendor import Vendor
from app.models.vendor_quote import VendorQuote

from app.schemas.quote_comparison import (
    VendorComparison,
    QuoteComparisonResponse,
)

router = APIRouter(tags=["Quote Comparison"])


@router.get(
    "/quote-comparison/{rfq_id}",
    response_model=QuoteComparisonResponse
)
def quote_comparison(
    rfq_id: int,
    db: Session = Depends(get_db)
):

    quotes = (
        db.query(VendorQuote)
        .filter(VendorQuote.rfq_id == rfq_id)
        .all()
    )

    if not quotes:
        raise HTTPException(
            status_code=404,
            detail="No quotes found for this RFQ"
        )

    quotes = sorted(
        quotes,
        key=lambda q: q.quoted_price
    )

    vendor_list = []

    prices = []

    for rank, quote in enumerate(quotes, start=1):

        vendor = (
            db.query(Vendor)
            .filter(Vendor.id == quote.vendor_id)
            .first()
        )

        prices.append(quote.quoted_price)

        vendor_list.append(
            VendorComparison(
                vendor_name=vendor.vendor_name,
                quote_number=quote.quote_number,
                quoted_price=quote.quoted_price,
                currency=quote.currency,
                moq=quote.moq,
                lead_time_days=quote.lead_time_days,
                valid_until=quote.valid_until,
                payment_terms=quote.payment_terms,
                quote_status=quote.quote_status,
                rank=rank
            )
        )

    return QuoteComparisonResponse(
        rfq_id=rfq_id,
        total_quotes=len(quotes),
        lowest_price=min(prices),
        highest_price=max(prices),
        average_price=round(sum(prices) / len(prices), 2),
        best_vendor=vendor_list[0].vendor_name,
        vendors=vendor_list
    )