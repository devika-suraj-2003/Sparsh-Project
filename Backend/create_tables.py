from app.db.database import Base, engine

# Import all models
from app.models.role import Role
from app.models.user import User
from app.models.project import Project
from app.models.board import Board
from app.models.version import Version
from app.models.vendor import Vendor
from app.models.vendor_quote import VendorQuote
from app.models.rfq import RFQ
from app.models.rfq_vendor import RFQVendor

Base.metadata.create_all(bind=engine)

print("Tables Created Successfully!")