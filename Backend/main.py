from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.user import router as user_router
from app.api.project import router as project_router
from app.api.board import router as board_router
from app.api.version import router as version_router
from app.api.bom import router as bom_router
from app.api.bom_upload import router as bom_upload
from app.api.vendor import router as vendor_router
from app.api.vendor_quote import router as vendor_quote_router
from app.api.cost_comparison import router as cost_comparison_router
from app.api.bom_cost import router as bom_cost_router
from app.api.rfq import router as rfq_router
from app.api.rfq_vendor import router as rfq_vendor_router
from app.api.quote_comparison import router as quote_comparison_router
from app.api.vendor_selection import router as vendor_selection_router
from app.api.purchase_requisition import router as purchase_requisition_router
from app.api.purchase_order import router as purchase_order_router
from app.api.vendor_quote_upload import router as vendor_quote_upload_router
from app.api.goods_receipt import router as goods_receipt_router
from app.api.item_master import router as item_router
from app.api.stock_ledger import router as stock_router
from app.api.material_issue import router as material_issue_router
from app.api.stock_adjustment import router as stock_adjustment_router
from app.api.inventory_reports import router as inventory_reports_router
from app.api.work_order import router as work_order_router
from app.api.material_allocation import router as material_allocation_router
from app.api.production_entry import router as production_entry_router
from app.api.finished_goods_receipt import router as finished_goods_receipt_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(project_router)
app.include_router(board_router)
app.include_router(version_router)
app.include_router(bom_router)
app.include_router(bom_upload)
app.include_router(vendor_router)
app.include_router(vendor_quote_router)
app.include_router(cost_comparison_router)
app.include_router(bom_cost_router)
app.include_router(rfq_router)
app.include_router(rfq_vendor_router)
app.include_router(quote_comparison_router)
app.include_router(vendor_selection_router)
app.include_router(purchase_requisition_router)
app.include_router(purchase_order_router)
app.include_router(vendor_quote_upload_router)
app.include_router(goods_receipt_router)
app.include_router(item_router)
app.include_router(stock_router)
app.include_router(material_issue_router)
app.include_router(stock_adjustment_router)
app.include_router(inventory_reports_router)
app.include_router(work_order_router)
app.include_router(material_allocation_router)
app.include_router(production_entry_router)
app.include_router(finished_goods_receipt_router)

@app.get("/")
def root():
    return {"message": "SparshIQ Backend Running"}