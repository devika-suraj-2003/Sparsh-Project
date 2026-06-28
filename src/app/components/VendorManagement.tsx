import { useState } from 'react';
import { Plus, Edit2, Star, BarChart2, Mail, Phone, Search } from 'lucide-react';
import Layout from './Layout';

type Vendor = {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  contact?: string;
  category?: string;
  status?: 'Active' | 'Inactive';
  rfqParticipation?: number | string;
  quoteSuccessRate?: number;
  avgLeadTime?: number;
  rating?: number;
};

function StatusBadge({ status }: { status?: string }) {
  if (status === 'Inactive') return <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600">Inactive</span>;
  return <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Active</span>;
}

function VendorModal({ vendor, onClose, onSave }: { vendor?: Vendor; onClose: () => void; onSave: (vendor: Vendor) => void }) {
  const [form, setForm] = useState({
    name: vendor?.name ?? '',
    email: vendor?.email ?? '',
    contact: vendor?.contact ?? '',
    phone: vendor?.phone ?? '',
    category: vendor?.category ?? 'Distributor',
    status: vendor?.status ?? 'Active',
    rfqParticipation: vendor?.rfqParticipation ?? 0,
    quoteSuccessRate: vendor?.quoteSuccessRate ?? 0,
    avgLeadTime: vendor?.avgLeadTime ?? 0,
    rating: vendor?.rating ?? 0
  });

  const handleSave = () => {
    if (!form.name.trim()) return;

    onSave({
      id: vendor?.id ?? Date.now().toString(),
      name: form.name.trim(),
      email: form.email.trim(),
      contact: form.contact.trim(),
      phone: form.phone.trim(),
      category: form.category,
      status: form.status as 'Active' | 'Inactive',
      rfqParticipation: Number(form.rfqParticipation) || 0,
      quoteSuccessRate: Math.min(Math.max(Number(form.quoteSuccessRate) || 0, 0), 100),
      avgLeadTime: Number(form.avgLeadTime) || 0,
      rating: Math.min(Math.max(Number(form.rating) || 0, 0), 5)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white border rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-sm font-semibold">{vendor ? 'Edit Vendor' : 'Add Vendor'}</h2>
          <button onClick={onClose} className="text-lg">×</button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Vendor Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded bg-gray-50 outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Contact Person</label>
              <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 outline-none focus:border-blue-500">
                {['Distributor', 'Local Distributor', 'Manufacturer', 'Agent'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })}
              className="w-full px-3 py-2 text-sm border rounded bg-gray-50 outline-none focus:border-blue-500">
              {['Active', 'Inactive'].map(status => <option key={status}>{status}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded bg-gray-50 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded bg-gray-50 outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">RFQ Participation</label>
              <input type="number" value={form.rfqParticipation} onChange={e => setForm({ ...form, rfqParticipation: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Success Rate (%)</label>
              <input type="number" min="0" max="100" value={form.quoteSuccessRate} onChange={e => setForm({ ...form, quoteSuccessRate: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Avg Lead Time</label>
              <input type="number" value={form.avgLeadTime} onChange={e => setForm({ ...form, avgLeadTime: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Rating</label>
              <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border rounded">Cancel</button>
            <button onClick={handleSave} className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded font-medium">Save Vendor</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating?: number }) {
  const r = Math.round(rating ?? 0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} className={i <= r ? 'text-amber-400' : 'text-gray-300'} />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating ?? '-'}</span>
    </div>
  );
}

export default function VendorManagement({ vendors: initialVendors }: { vendors?: Vendor[] }) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors ?? []);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | undefined>(undefined);
  const [performanceVendor, setPerformanceVendor] = useState<Vendor | undefined>(undefined);

  const filtered = vendors.filter(v =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) ||
    (v.contact ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (v.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveVendor = (vendor: Vendor) => {
    setVendors(current => {
      const exists = current.some(item => item.id === vendor.id);
      return exists ? current.map(item => item.id === vendor.id ? vendor : item) : [vendor, ...current];
    });
    setShowModal(false);
    setEditVendor(undefined);
  };

  const toggleVendorStatus = (vendor: Vendor) => {
    setVendors(current => current.map(item => (
      item.id === vendor.id
        ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
        : item
    )));
  };

  return (
    <Layout title="Vendor Management" subtitle="Maintain supplier records, contact details, ratings, compliance status, and performance history.">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Vendors</h1>
            <p className="text-sm text-gray-500 mt-0.5">{vendors.filter(v => v.status === 'Active').length} active vendors</p>
          </div>
          <button onClick={() => { setEditVendor(undefined); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            <Plus size={15} /> Add Vendor
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Vendors', value: vendors.length, sub: 'in database' },
            { label: 'Active Vendors', value: vendors.filter(v => v.status === 'Active').length, sub: 'participating' },
            { label: 'Avg Lead Time', value: vendors.length ? `${Math.round(vendors.reduce((s, v) => s + (v.avgLeadTime ?? 0), 0) / vendors.length)}d` : '-', sub: 'across all vendors' },
            { label: 'Avg Success Rate', value: vendors.length ? `${Math.round(vendors.reduce((s, v) => s + (v.quoteSuccessRate ?? 0), 0) / vendors.length)}%` : '-', sub: 'quote conversion' }
          ].map(s => (
            <div key={s.label} className="bg-white border rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="relative w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..."
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-white outline-none focus:border-blue-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.length > 0 ? filtered.map(v => (
            <div key={v.id} className={`bg-white border rounded-lg p-4 ${v.status === 'Inactive' ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">{v.name?.[0] ?? '?'}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{v.name}</h3>
                    <p className="text-xs text-gray-500">{v.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <StatusBadge status={v.status} />
                  <button onClick={() => { setEditVendor(v); setShowModal(true); }} className="p-1.5 text-gray-500 hover:text-gray-900 rounded ml-1">
                    <Edit2 size={13} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Mail size={11} />
                  <span className="truncate">{v.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={11} />
                  <span>{v.phone}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-3">Contact: <span className="text-gray-900 font-medium">{v.contact}</span></div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500">RFQ Participation</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{v.rfqParticipation ?? '-'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Success Rate</p>
                  <p className="text-sm font-semibold text-emerald-600 mt-0.5">{v.quoteSuccessRate ?? '-'}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Avg Lead Time</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{v.avgLeadTime ?? '-'}d</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <StarRating rating={v.rating} />
                <div className="flex gap-1">
                  <button onClick={() => setPerformanceVendor(v)} className="px-2 py-1 text-xs border rounded flex items-center gap-1"><BarChart2 size={10} /> Performance</button>
                  {v.status === 'Active'
                    ? <button onClick={() => toggleVendorStatus(v)} className="px-2 py-1 text-xs border border-red-200 text-red-600 rounded">Disable</button>
                    : <button onClick={() => toggleVendorStatus(v)} className="px-2 py-1 text-xs border border-emerald-200 text-emerald-600 rounded">Enable</button>
                  }
                </div>
              </div>
            </div>
          )) : (
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600">No vendors found. Add a vendor to get started.</p>
            </div>
          )}
        </div>

        {performanceVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setPerformanceVendor(undefined)} />
            <div className="relative bg-white border rounded-xl shadow-2xl w-full max-w-md p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold">{performanceVendor.name} Performance</h2>
                  <p className="text-xs text-gray-500">{performanceVendor.category}</p>
                </div>
                <button onClick={() => setPerformanceVendor(undefined)} className="text-lg text-gray-400 hover:text-gray-600">x</button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'RFQ Participation', value: Number(performanceVendor.rfqParticipation ?? 0), max: 100, suffix: '' },
                  { label: 'Quote Success Rate', value: Number(performanceVendor.quoteSuccessRate ?? 0), max: 100, suffix: '%' },
                  { label: 'Rating', value: Number(performanceVendor.rating ?? 0), max: 5, suffix: '/5' }
                ].map(metric => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{metric.label}</span>
                      <span className="font-medium text-gray-900">{metric.value}{metric.suffix}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min((metric.value / metric.max) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Avg Lead Time</p>
                    <p className="text-lg font-semibold text-gray-900">{performanceVendor.avgLeadTime ?? '-'}d</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="mt-1"><StatusBadge status={performanceVendor.status} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <VendorModal
            vendor={editVendor}
            onClose={() => {
              setShowModal(false);
              setEditVendor(undefined);
            }}
            onSave={handleSaveVendor}
          />
        )}
      </div>
    </Layout>
  );
}
