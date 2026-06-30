from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.work_order import WorkOrder
from app.models.material_allocation import MaterialAllocation
from app.models.bom import BOM
from app.models.item_master import ItemMaster

from app.schemas.material_allocation import MaterialAllocationResponse

from app.services.inventory.inventory_service import (
    get_current_stock,
    remove_stock
)

router = APIRouter(
    prefix="/material-allocations",
    tags=["Material Allocation"]
)


@router.post(
    "/{work_order_id}/generate",
    response_model=list[MaterialAllocationResponse]
)
def generate_material_allocation(
    work_order_id: int,
    db: Session = Depends(get_db)
):

    work_order = db.query(WorkOrder).filter(
        WorkOrder.work_order_id == work_order_id
    ).first()

    if not work_order:
        raise HTTPException(
            status_code=404,
            detail="Work Order not found."
        )

    existing = db.query(MaterialAllocation).filter(
        MaterialAllocation.work_order_id == work_order_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Material Allocation already generated."
        )

    bom_items = db.query(BOM).filter(
        BOM.version_id == work_order.version_id
    ).all()

    if not bom_items:
        raise HTTPException(
            status_code=404,
            detail="No BOM found."
        )

    item_requirements = {}

    for bom in bom_items:

        item = db.query(ItemMaster).filter(
            ItemMaster.manufacturer_part_number ==
            bom.manufacturer_part_number
        ).first()

        if not item:
            continue

        required_qty = (
            work_order.planned_quantity *
            bom.quantity_per_board
        )

        item_requirements[item.item_id] = (
            item_requirements.get(item.item_id, 0)
            + required_qty
        )

    for item_id, required_qty in item_requirements.items():

        current_stock = get_current_stock(
            db=db,
            item_id=item_id
        )

        allocation = MaterialAllocation(
            work_order_id=work_order.work_order_id,
            item_id=item_id,
            required_quantity=required_qty,
            issued_quantity=0,
            status=(
                "Ready"
                if current_stock >= required_qty
                else "Insufficient Stock"
            )
        )

        db.add(allocation)

    db.commit()

    return db.query(MaterialAllocation).filter(
        MaterialAllocation.work_order_id == work_order_id
    ).all()


@router.post("/{work_order_id}/issue")
def issue_materials(
    work_order_id: int,
    db: Session = Depends(get_db)
):

    work_order = db.query(WorkOrder).filter(
        WorkOrder.work_order_id == work_order_id
    ).first()

    if not work_order:
        raise HTTPException(
            status_code=404,
            detail="Work Order not found."
        )

    allocations = db.query(MaterialAllocation).filter(
        MaterialAllocation.work_order_id == work_order_id
    ).all()

    if not allocations:
        raise HTTPException(
            status_code=404,
            detail="Material Allocation not found."
        )

    for allocation in allocations:

        stock = get_current_stock(
            db=db,
            item_id=allocation.item_id
        )

        if stock < allocation.required_quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for Item {allocation.item_id}"
            )

    for allocation in allocations:

        remove_stock(
            db=db,
            item_id=allocation.item_id,
            quantity=allocation.required_quantity,
            transaction_type="PRODUCTION_ISSUE",
            reference_type="WORK_ORDER",
            reference_id=work_order.work_order_id,
            remarks=f"Material issued for {work_order.work_order_number}"
        )

        allocation.issued_quantity = allocation.required_quantity
        allocation.status = "Issued"

    work_order.status = "In Progress"

    db.commit()

    return {
        "message": "Materials issued successfully."
    }


@router.get(
    "/{work_order_id}",
    response_model=list[MaterialAllocationResponse]
)
def get_material_allocations(
    work_order_id: int,
    db: Session = Depends(get_db)
):

    return db.query(MaterialAllocation).filter(
        MaterialAllocation.work_order_id == work_order_id
    ).all()