from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.item_master import ItemMaster
from app.schemas.item_master import (
    ItemMasterCreate,
    ItemMasterUpdate,
    ItemMasterResponse,
)

router = APIRouter(
    prefix="/items",
    tags=["Item Master"]
)


def generate_item_code(db: Session):
    latest = (
        db.query(ItemMaster)
        .order_by(ItemMaster.item_id.desc())
        .first()
    )

    if latest:
        next_number = latest.item_id + 1
    else:
        next_number = 1

    return f"ITM{next_number:06d}"


@router.post("/", response_model=ItemMasterResponse)
def create_item(item: ItemMasterCreate, db: Session = Depends(get_db)):

    existing = (
        db.query(ItemMaster)
        .filter(
            ItemMaster.manufacturer_part_number
            == item.manufacturer_part_number
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Manufacturer Part Number already exists."
        )

    db_item = ItemMaster(
        item_code=generate_item_code(db),
        **item.model_dump()
    )

    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    return db_item


@router.get("/", response_model=list[ItemMasterResponse])
def get_items(db: Session = Depends(get_db)):
    return db.query(ItemMaster).all()


@router.get("/{item_id}", response_model=ItemMasterResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):

    item = db.query(ItemMaster).filter(
        ItemMaster.item_id == item_id
    ).first()

    if not item:
        raise HTTPException(404, "Item not found")

    return item


@router.put("/{item_id}", response_model=ItemMasterResponse)
def update_item(
    item_id: int,
    item: ItemMasterUpdate,
    db: Session = Depends(get_db)
):

    db_item = db.query(ItemMaster).filter(
        ItemMaster.item_id == item_id
    ).first()

    if not db_item:
        raise HTTPException(404, "Item not found")

    update_data = item.model_dump(exclude_unset=True)

    if "manufacturer_part_number" in update_data:

        duplicate = (
            db.query(ItemMaster)
            .filter(
                ItemMaster.manufacturer_part_number
                == update_data["manufacturer_part_number"],
                ItemMaster.item_id != item_id
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                400,
                "Manufacturer Part Number already exists."
            )

    for key, value in update_data.items():
        setattr(db_item, key, value)

    db.commit()
    db.refresh(db_item)

    return db_item


@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db)
):

    db_item = db.query(ItemMaster).filter(
        ItemMaster.item_id == item_id
    ).first()

    if not db_item:
        raise HTTPException(404, "Item not found")

    db_item.is_active = False

    db.commit()

    return {"message": "Item deactivated successfully"}