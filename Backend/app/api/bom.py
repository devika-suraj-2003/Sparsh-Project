from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.bom import BOM
from app.schemas.bom import BOMCreate, BOMResponse

router = APIRouter(tags=["BOM"])


@router.post("/bom", response_model=BOMResponse)
def create_bom(
    bom_data: BOMCreate,
    db: Session = Depends(get_db)
):

    bom = BOM(
        version_id=bom_data.version_id,
        line_no=bom_data.line_no,

        reference_designator=bom_data.reference_designator,
        manufacturer_part_number=bom_data.manufacturer_part_number,

        component_name=bom_data.component_name,
        description=bom_data.description,

        quantity_per_board=bom_data.quantity_per_board,

        unit=bom_data.unit,

        dnp=bom_data.dnp,

        remarks=bom_data.remarks
    )

    db.add(bom)
    db.commit()
    db.refresh(bom)

    return bom

@router.get("/bom", response_model=list[BOMResponse])
def get_bom_items(
    db: Session = Depends(get_db)
):
    return db.query(BOM).all()

from fastapi import HTTPException

@router.get("/bom/{bom_id}", response_model=BOMResponse)
def get_bom_item(
    bom_id: int,
    db: Session = Depends(get_db)
):

    bom = db.query(BOM).filter(
        BOM.bom_id == bom_id
    ).first()

    if not bom:
        raise HTTPException(
            status_code=404,
            detail="BOM item not found"
        )

    return bom

@router.put("/bom/{bom_id}", response_model=BOMResponse)
def update_bom(
    bom_id: int,
    bom_data: BOMCreate,
    db: Session = Depends(get_db)
):

    bom = db.query(BOM).filter(
        BOM.bom_id == bom_id
    ).first()

    if not bom:
        raise HTTPException(
            status_code=404,
            detail="BOM item not found"
        )

    bom.version_id = bom_data.version_id
    bom.line_no = bom_data.line_no

    bom.reference_designator = bom_data.reference_designator
    bom.manufacturer_part_number = bom_data.manufacturer_part_number

    bom.component_name = bom_data.component_name
    bom.description = bom_data.description

    bom.quantity_per_board = bom_data.quantity_per_board

    bom.unit = bom_data.unit

    bom.dnp = bom_data.dnp

    bom.remarks = bom_data.remarks

    db.commit()
    db.refresh(bom)

    return bom

@router.delete("/bom/{bom_id}")
def delete_bom(
    bom_id: int,
    db: Session = Depends(get_db)
):

    bom = db.query(BOM).filter(
        BOM.bom_id == bom_id
    ).first()

    if not bom:
        raise HTTPException(
            status_code=404,
            detail="BOM item not found"
        )

    db.delete(bom)
    db.commit()

    return {"message": "BOM item deleted successfully"}