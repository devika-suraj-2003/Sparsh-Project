from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from app.db.database import Base


class RFQ(Base):
    __tablename__ = "rfqs"

    rfq_id = Column(Integer, primary_key=True, index=True)

    version_id = Column(
        Integer,
        ForeignKey("versions.version_id"),
        nullable=False
    )

    rfq_number = Column(
        String,
        unique=True,
        nullable=False
    )

    title = Column(String, nullable=False)

    description = Column(String)

    issue_date = Column(Date)

    due_date = Column(Date)

    status = Column(
        String,
        default="Draft"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )