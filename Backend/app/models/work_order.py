from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.db.database import Base


class WorkOrder(Base):
    __tablename__ = "work_orders"

    work_order_id = Column(Integer, primary_key=True, index=True)

    work_order_number = Column(String, unique=True, nullable=False)

    version_id = Column(
        Integer,
        ForeignKey("versions.version_id"),
        nullable=False
    )

    planned_quantity = Column(Integer, nullable=False)

    start_date = Column(Date, nullable=False)

    target_date = Column(Date, nullable=False)

    status = Column(
        String,
        default="Planned"
    )
    # Planned → Released → In Progress → Completed → Closed

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )