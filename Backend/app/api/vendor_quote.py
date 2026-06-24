from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.vendor_quote import VendorQuote

from app.schemas.vendor_quote import (
    VendorQuoteCreate,
    VendorQuoteResponse
)

router = APIRouter(tags=["Vendor Quotes"])


@router.post(
    "/vendor-quotes",
    response_model=VendorQuoteResponse
)
def create_vendor_quote(
    quote: VendorQuoteCreate,
    db: Session = Depends(get_db)
):

    new_quote = VendorQuote(
        vendor_id=quote.vendor_id,
        bom_id=quote.bom_id,
        quoted_price=quote.quoted_price,
        currency=quote.currency,
        moq=quote.moq,
        lead_time_days=quote.lead_time_days,
        quote_date=quote.quote_date,
        remarks=quote.remarks
    )

    db.add(new_quote)
    db.commit()
    db.refresh(new_quote)

    return new_quote


@router.get(
    "/vendor-quotes",
    response_model=list[VendorQuoteResponse]
)
def get_vendor_quotes(
    db: Session = Depends(get_db)
):
    return db.query(VendorQuote).all()


@router.get(
    "/vendor-quotes/{quote_id}",
    response_model=VendorQuoteResponse
)
def get_vendor_quote(
    quote_id: int,
    db: Session = Depends(get_db)
):

    quote = db.query(VendorQuote).filter(
        VendorQuote.id == quote_id
    ).first()

    if not quote:
        raise HTTPException(
            status_code=404,
            detail="Vendor quote not found"
        )

    return quote


@router.put(
    "/vendor-quotes/{quote_id}",
    response_model=VendorQuoteResponse
)
def update_vendor_quote(
    quote_id: int,
    quote_data: VendorQuoteCreate,
    db: Session = Depends(get_db)
):

    quote = db.query(VendorQuote).filter(
        VendorQuote.id == quote_id
    ).first()

    if not quote:
        raise HTTPException(
            status_code=404,
            detail="Vendor quote not found"
        )

    quote.vendor_id = quote_data.vendor_id
    quote.bom_id = quote_data.bom_id
    quote.quoted_price = quote_data.quoted_price
    quote.currency = quote_data.currency
    quote.moq = quote_data.moq
    quote.lead_time_days = quote_data.lead_time_days
    quote.quote_date = quote_data.quote_date
    quote.remarks = quote_data.remarks

    db.commit()
    db.refresh(quote)

    return quote


@router.delete("/vendor-quotes/{quote_id}")
def delete_vendor_quote(
    quote_id: int,
    db: Session = Depends(get_db)
):

    quote = db.query(VendorQuote).filter(
        VendorQuote.id == quote_id
    ).first()

    if not quote:
        raise HTTPException(
            status_code=404,
            detail="Vendor quote not found"
        )

    db.delete(quote)
    db.commit()

    return {
        "message": "Vendor quote deleted successfully"
    }