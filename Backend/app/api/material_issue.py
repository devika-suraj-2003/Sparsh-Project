from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.material_issue import MaterialIssue
from app.schemas.material_issue import (
    MaterialIssueCreate,
    MaterialIssueResponse,
)
from app.services.inventory.inventory_service import remove_stock

router = APIRouter(
    prefix="/material-issues",
    tags=["Material Issue"]
)

@router.post(
    "/",
    response_model=MaterialIssueResponse
)
def create_material_issue(
    issue: MaterialIssueCreate,
    db: Session = Depends(get_db)
):
    count = db.query(MaterialIssue).count() + 1

    year = datetime.now().year

    issue_number = f"MI-{year}-{count:04d}"

    remove_stock(
        db=db,
        item_id=issue.item_id,
        quantity=issue.quantity,
        transaction_type="MATERIAL_ISSUE",
        reference_type="MATERIAL_ISSUE",
        reference_id=count,
        remarks=issue.remarks
    )

    material_issue = MaterialIssue(
        issue_number=issue_number,
        item_id=issue.item_id,
        quantity=issue.quantity,
        issue_date=issue.issue_date,
        issued_to=issue.issued_to,
        remarks=issue.remarks
    )

    db.add(material_issue)
    db.commit()
    db.refresh(material_issue)

    return material_issue

@router.get(
    "/",
    response_model=list[MaterialIssueResponse]
)
def get_material_issues(
    db: Session = Depends(get_db)
):
    return (
        db.query(MaterialIssue)
        .order_by(MaterialIssue.created_at.desc())
        .all()
    )

@router.get(
    "/{issue_id}",
    response_model=MaterialIssueResponse
)
def get_material_issue(
    issue_id: int,
    db: Session = Depends(get_db)
):
    issue = (
        db.query(MaterialIssue)
        .filter(MaterialIssue.issue_id == issue_id)
        .first()
    )

    if not issue:
        raise HTTPException(
            status_code=404,
            detail="Material Issue not found"
        )

    return issue

