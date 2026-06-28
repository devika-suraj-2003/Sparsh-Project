from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.rfq import RFQ
from app.schemas.rfq import RFQCreate, RFQResponse

router = APIRouter(tags=["RFQ"])


@router.post("/rfqs", response_model=RFQResponse)
def create_rfq(
    rfq: RFQCreate,
    db: Session = Depends(get_db)
):

    new_rfq = RFQ(**rfq.model_dump())

    db.add(new_rfq)
    db.commit()
    db.refresh(new_rfq)

    return new_rfq


@router.get("/rfqs", response_model=list[RFQResponse])
def get_rfqs(db: Session = Depends(get_db)):
    return db.query(RFQ).all()


@router.get("/rfqs/{rfq_id}", response_model=RFQResponse)
def get_rfq(
    rfq_id: int,
    db: Session = Depends(get_db)
):

    rfq = db.query(RFQ).filter(
        RFQ.rfq_id == rfq_id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    return rfq


@router.put("/rfqs/{rfq_id}", response_model=RFQResponse)
def update_rfq(
    rfq_id: int,
    rfq_data: RFQCreate,
    db: Session = Depends(get_db)
):

    rfq = db.query(RFQ).filter(
        RFQ.rfq_id == rfq_id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    rfq.version_id = rfq_data.version_id
    rfq.rfq_number = rfq_data.rfq_number
    rfq.title = rfq_data.title
    rfq.description = rfq_data.description
    rfq.issue_date = rfq_data.issue_date
    rfq.due_date = rfq_data.due_date
    rfq.status = rfq_data.status

    db.commit()
    db.refresh(rfq)

    return rfq


@router.delete("/rfqs/{rfq_id}")
def delete_rfq(
    rfq_id: int,
    db: Session = Depends(get_db)
):

    rfq = db.query(RFQ).filter(
        RFQ.rfq_id == rfq_id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    db.delete(rfq)
    db.commit()

    return {
        "message": "RFQ deleted successfully"
    }