from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.db.database import Base


class BOM(Base):
    __tablename__ = "bom"

    bom_id = Column(Integer, primary_key=True, index=True)

    version_id = Column(
        Integer,
        ForeignKey("versions.version_id")
    )

    line_no = Column(Integer)

    reference_designator = Column(String)
    manufacturer_part_number = Column(String)

    component_name = Column(String)
    description = Column(String)

    quantity_per_board = Column(Integer)

    unit = Column(String)

    dnp = Column(Boolean, default=False)

    remarks = Column(String)

    version = relationship("Version")

