import { useMemo, useState } from 'react';
import { AlertCircle, AlertTriangle, Boxes, Edit2, Package, Plus, Search, Trash2, TrendingUp, Warehouse } from 'lucide-react';
import Layout from './Layout';

type InventoryItem = {
  id: string | number;
  name: string;
  sku?: string;
  batch?: string;
  quantity: number;
  available?: number;
  reserved?: number;
  reorderLevel: number;
  location?: string;
  category?: string;
  unitPrice?: number;
  lastUpdated?: string;
};

type Allocation = {
  id: string | number;
  project: string;
  component: string;
  allocQty: number;
  date: string;
};

type FlowPoint = {
  month: string;
  received: number;
  consumed: number;
  returned: number;
};

const INVENTORY_FLOW = [
  'Received Inventory',
  'Inventory Batch',
  'Project Allocation',
  'Reserved Inventory',
  'Production Consumption',
  'Returned Inventory',
];

function StatusBadge({ status }: { status?: string }) {
  if (status === 'Out of Stock') return <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600">Out of Stock</span>;
  if (status === 'Low Stock') return <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-600">Low Stock</span>;
  return <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">In Stock</span>;
}

function getItemStatus(item: InventoryItem) {
  const available = item.available ?? item.quantity;
  if (available <= 0) return 'Out of Stock';
  if (available < item.reorderLevel) return 'Low Stock';
  return 'In Stock';
}

function MiniFlowChart({ data }: { data: FlowPoint[] }) {
  const width = 720;
  const height = 220;
  const padding = 28;
  const maxValue = Math.max(1, ...data.flatMap((point) => [point.received, point.consumed, point.returned]));

  const linePath = (key: keyof Omit<FlowPoint, 'month'>) => {
    if (data.length === 0) return '';
    return data.map((point, index) => {
      const x = data.length === 1 ? width / 2 : padding + (index * (width - padding * 2)) / (data.length - 1);
      const y = height - padding - (point[key] / maxValue) * (height - padding * 2);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  if (data.length === 0) {
    return <div className="h-56 flex items-center justify-center text-sm text-gray-500">No inventory flow data yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[640px] w-full h-56" role="img" aria-label="Inventory flow trend">
        {[0, 1, 2, 3].map((tick) => {
          const y = padding + tick * ((height - padding * 2) / 3);
          return <line key={tick} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#f1f5f9" />;
        })}
        <path d={linePath('received')} fill="none" stroke="#3B82F6" strokeWidth="3" />
        <path d={linePath('consumed')} fill="none" stroke="#10B981" strokeWidth="3" />
        <path d={linePath('returned')} fill="none" stroke="#F59E0B" strokeWidth="3" />
        {data.map((point, index) => {
          const x = data.length === 1 ? width / 2 : padding + (index * (width - padding * 2)) / (data.length - 1);
          return (
            <text key={point.month} x={x} y={height - 6} textAnchor="middle" className="fill-gray-500 text-[11px]">
              {point.month}
            </text>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Received</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Consumed</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Returned</span>
      </div>
    </div>
  );
}

function InventoryModal({ item, onClose, onSave }: { item?: InventoryItem; onClose: () => void; onSave: (item: InventoryItem) => void }) {
  const [form, setForm] = useState({
    name: item?.name ?? '',
    sku: item?.sku ?? '',
    batch: item?.batch ?? '',
    quantity: item?.quantity ?? 0,
    available: item?.available ?? item?.quantity ?? 0,
    reserved: item?.reserved ?? 0,
    reorderLevel: item?.reorderLevel ?? 10,
    location: item?.location ?? '',
    category: item?.category ?? 'Component',
    unitPrice: item?.unitPrice ?? 0,
  });

  const handleSave = () => {
    if (!form.name.trim()) return;

    onSave({
      id: item?.id ?? Date.now().toString(),
      name: form.name.trim(),
      sku: form.sku.trim(),
      batch: form.batch.trim(),
      quantity: Number(form.quantity) || 0,
      available: Number(form.available) || 0,
      reserved: Number(form.reserved) || 0,
      reorderLevel: Number(form.reorderLevel) || 0,
      location: form.location.trim(),
      category: form.category,
      unitPrice: Number(form.unitPrice) || 0,
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">{item ? 'Edit Item' : 'Add Inventory Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">x</button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Component Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">SKU</label>
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Batch</label>
              <input value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500">
                {['Component', 'Part', 'Raw Material', 'Finished Good'].map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Qty</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Available</label>
              <input type="number" value={form.available} onChange={(e) => setForm({ ...form, available: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Reserved</label>
              <input type="number" value={form.reserved} onChange={(e) => setForm({ ...form, reserved: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Reorder Level</label>
              <input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Unit Price</label>
              <input type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">Save Item</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllocationModal({ items, onClose, onSave }: { items: InventoryItem[]; onClose: () => void; onSave: (allocation: Allocation) => void }) {
  const [form, setForm] = useState({
    project: '',
    component: items[0]?.name ?? '',
    allocQty: 0,
  });

  const handleSave = () => {
    if (!form.project.trim() || !form.component || form.allocQty <= 0) return;
    onSave({
      id: Date.now().toString(),
      project: form.project.trim(),
      component: form.component,
      allocQty: Number(form.allocQty) || 0,
      date: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Allocate Inventory</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">x</button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Project</label>
            <input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Component</label>
            <select value={form.component} onChange={(e) => setForm({ ...form, component: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500">
              <option value="">Select component</option>
              {items.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Allocation Qty</label>
            <input type="number" value={form.allocQty} onChange={(e) => setForm({ ...form, allocQty: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 outline-none focus:border-blue-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">Save Allocation</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InventoryManagement({
  items: initialItems,
  allocations: initialAllocations,
  flowData: initialFlowData,
}: {
  items?: InventoryItem[];
  allocations?: Allocation[];
  flowData?: FlowPoint[];
}) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems ?? []);
  const [allocations, setAllocations] = useState<Allocation[]>(initialAllocations ?? []);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showBatchHistory, setShowBatchHistory] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | undefined>();

  const filtered = items.filter((item) =>
    !search ||
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.sku ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (item.batch ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (item.location ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = items.filter((item) => getItemStatus(item) === 'Low Stock').length;
  const availableUnits = items.reduce((sum, item) => sum + (item.available ?? item.quantity), 0);
  const reservedUnits = items.reduce((sum, item) => sum + (item.reserved ?? 0), 0);
  const totalValue = items.reduce((sum, item) => sum + ((item.available ?? item.quantity) * (item.unitPrice ?? 0)), 0);
  const flowData = useMemo(() => initialFlowData ?? [], [initialFlowData]);

  const handleSaveItem = (item: InventoryItem) => {
    setItems((current) => {
      const exists = current.some((entry) => entry.id === item.id);
      return exists ? current.map((entry) => entry.id === item.id ? item : entry) : [item, ...current];
    });
    setShowModal(false);
    setEditItem(undefined);
  };

  const handleAllocation = (allocation: Allocation) => {
    setAllocations((current) => [allocation, ...current]);
    setItems((current) => current.map((item) => {
      if (item.name !== allocation.component) return item;
      const available = Math.max((item.available ?? item.quantity) - allocation.allocQty, 0);
      const reserved = (item.reserved ?? 0) + allocation.allocQty;
      return { ...item, available, reserved, lastUpdated: allocation.date };
    }));
    setShowAllocationModal(false);
  };

  const handleReleaseInventory = () => {
    setItems((current) => current.map((item) => ({
      ...item,
      available: (item.available ?? item.quantity) + (item.reserved ?? 0),
      reserved: 0,
      lastUpdated: new Date().toISOString().slice(0, 10),
    })));
  };

  return (
    <Layout title="Inventory Management" subtitle="Track stock levels, warehouse locations, and inventory movements">
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Global inventory across all projects</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowBatchHistory((value) => !value)} className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">
              {showBatchHistory ? 'Hide Batch History' : 'View Batch History'}
            </button>
            <button onClick={handleReleaseInventory} className="border border-orange-500 text-orange-600 px-3 py-1.5 rounded-lg text-sm hover:bg-orange-50">
              Release Inventory
            </button>
            <button onClick={() => setShowAllocationModal(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700">
              Allocate Inventory
            </button>
            <button onClick={() => { setEditItem(undefined); setShowModal(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <Plus size={15} /> Add Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Total Inventory Value', value: `$${totalValue.toFixed(0)}`, icon: TrendingUp, color: 'blue', trend: `${items.length} items` },
            { label: 'Available Inventory', value: `${availableUnits.toLocaleString()} units`, icon: Package, color: 'green', trend: items.length ? `${Math.round((availableUnits / Math.max(availableUnits + reservedUnits, 1)) * 100)}%` : '-' },
            { label: 'Reserved Inventory', value: `${reservedUnits.toLocaleString()} units`, icon: Boxes, color: 'orange', trend: items.length ? `${Math.round((reservedUnits / Math.max(availableUnits + reservedUnits, 1)) * 100)}%` : '-' },
            { label: 'Low Stock Components', value: `${lowStockCount} items`, icon: AlertTriangle, color: 'red', trend: lowStockCount ? 'Alert' : 'Clear' },
          ].map((kpi) => {
            const Icon = kpi.icon;
            const colors: Record<string, string> = {
              blue: 'bg-blue-50 text-blue-600',
              green: 'bg-green-50 text-green-600',
              orange: 'bg-orange-50 text-orange-600',
              red: 'bg-red-50 text-red-600',
            };
            return (
              <div key={kpi.label} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{kpi.label}</div>
                    <div className="text-xl font-bold text-gray-900">{kpi.value}</div>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[kpi.color]}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className={`text-xs font-medium mt-2 ${colors[kpi.color].replace('bg-', 'text-').split(' ')[1]}`}>{kpi.trend}</div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Inventory Flow</h3>
          <div className="flex items-center gap-0 flex-wrap">
            {INVENTORY_FLOW.map((step, index) => (
              <div key={step} className="flex items-center mb-2">
                <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap">
                  {step}
                </div>
                {index < INVENTORY_FLOW.length - 1 && (
                  <div className="w-6 h-0.5 bg-blue-300 mx-1 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Inventory Flow Trend</h3>
          <MiniFlowChart data={flowData} />
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search inventory, batches..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md bg-white outline-none focus:border-blue-500" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Inventory Batches</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Batch</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Component</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Qty</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Available</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Reserved</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Location</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length > 0 ? filtered.map((item) => {
                    const status = getItemStatus(item);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2.5 text-xs font-mono text-gray-700 font-medium">{item.batch || item.sku || '-'}</td>
                        <td className="px-3 py-2.5">
                          <div className="text-gray-800 text-xs font-medium">{item.name}</div>
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-3 py-2.5 text-gray-600">{item.quantity.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-green-600 font-medium">{(item.available ?? item.quantity).toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-orange-600 font-medium">{(item.reserved ?? 0).toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-xs text-gray-500">{item.location || '-'}</td>
                        <td className="px-3 py-2.5">
                          <button onClick={() => { setEditItem(item); setShowModal(true); }} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded" title="Edit">
                            <Edit2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={7} className="px-3 py-8 text-center text-gray-500">No inventory batches found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Inventory Allocations</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Project</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Component</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Alloc Qty</th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-600 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allocations.length > 0 ? allocations.map((allocation) => (
                    <tr key={allocation.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-gray-800 text-xs font-medium">{allocation.project}</td>
                      <td className="px-3 py-2.5 text-gray-600 text-xs">{allocation.component}</td>
                      <td className="px-3 py-2.5 font-semibold text-gray-900">{allocation.allocQty}</td>
                      <td className="px-3 py-2.5 text-gray-500 text-xs">{allocation.date}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-gray-500">No allocations yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showBatchHistory && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Batch History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {items.length > 0 ? items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-gray-900">{item.batch || item.sku || item.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Last updated: {item.lastUpdated || '-'}</p>
                </div>
              )) : <p className="text-sm text-gray-500">No batch history available.</p>}
            </div>
          </div>
        )}

        {showModal && (
          <InventoryModal
            item={editItem}
            onClose={() => {
              setShowModal(false);
              setEditItem(undefined);
            }}
            onSave={handleSaveItem}
          />
        )}

        {showAllocationModal && (
          <AllocationModal
            items={items}
            onClose={() => setShowAllocationModal(false)}
            onSave={handleAllocation}
          />
        )}

        <div className="hidden">
          <AlertCircle />
          <Trash2 />
        </div>
      </div>
    </Layout>
  );
}
