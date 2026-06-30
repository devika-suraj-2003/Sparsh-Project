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
from app.models.vendor_selection import VendorSelection
from app.models.purchase_order import PurchaseOrder
from app.models.goods_receipt import GoodsReceipt
from app.models.purchase_order_item import PurchaseOrderItem
from app.models.item_master import ItemMaster
from app.models.stock_ledger import StockLedger
from app.models.material_issue import MaterialIssue
from app.models.stock_adjustment import StockAdjustment
from app.models.work_order import WorkOrder
from app.models.material_allocation import MaterialAllocation
from app.models.production_entry import ProductionEntry

Base.metadata.create_all(bind=engine)

print("Tables Created Successfully!")