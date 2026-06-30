from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.db.database import Base


class MaterialIssue(Base):
    __tablename__ = "material_issues"

    issue_id = Column(Integer, primary_key=True, index=True)

    issue_number = Column(String, unique=True, nullable=False)

    item_id = Column(
        Integer,
        ForeignKey("item_master.item_id"),
        nullable=False
    )

    quantity = Column(Integer, nullable=False)

    issue_date = Column(Date, nullable=False)

    issued_to = Column(String, nullable=False)

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )