from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.db.database import Base


class MaterialAllocation(Base):
    __tablename__ = "material_allocations"

    allocation_id = Column(Integer, primary_key=True, index=True)

    work_order_id = Column(
        Integer,
        ForeignKey("work_orders.work_order_id"),
        nullable=False
    )

    item_id = Column(
        Integer,
        ForeignKey("item_master.item_id"),
        nullable=False
    )

    required_quantity = Column(Integer, nullable=False)

    issued_quantity = Column(Integer, default=0)

    status = Column(
        String,
        default="Pending"
    )
    # Pending → Issued

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )