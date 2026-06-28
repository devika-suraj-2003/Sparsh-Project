import { useRef, useState } from 'react';
import { Plus, Search, Eye, Edit2, Copy, GitBranch, Download, Upload, ChevronRight, Check } from 'lucide-react';
import Layout from './Layout';

type BOM = {
  id: string | number;
  name: string;
  project: string;
  board: string;
  boardVer: string;
  bomVer: string;
  components: number;
  dnp: number;
  status?: 'Published' | 'Draft' | 'Archived';
  created?: string;
};

const STATUS_STYLES: Record<string, string> = {
  Published: 'bg-emerald-100 text-emerald-700',
  Draft: 'bg-amber-100 text-amber-700',
  Archived: 'bg-gray-100 text-gray-500',
};

const BOM_FIELDS = [
  { id: 'component', label: 'Component / Ref' },
  { id: 'description', label: 'Description' },
  { id: 'main', label: 'Main MPN' },
  { id: 'alt1', label: 'ALT1' },
  { id: 'alt2', label: 'ALT2' },
  { id: 'qty', label: 'Quantity' },
  { id: 'unit', label: 'Unit' },
  { id: 'unitCost', label: 'Unit Cost' },
  { id: 'dnp', label: 'DNP' },
];

const DEFAULT_FILE_COLUMNS = [
  'Part Number',
  'Reference Designator',
  'Description',
  'Primary MPN',
  'Secondary MPN',
  'Alt MPN',
  'Quantity',
  'UOM',
  'Unit Price',
  'DNP Flag',
];

function UploadBOMModal({ isOpen, onClose, projects, onSave }: { isOpen: boolean; onClose: () => void; projects: string[]; onSave: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [bomName, setBomName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [bomVersion, setBomVersion] = useState('V1.0');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({
    component: 'Reference Designator',
    description: 'Description',
    main: 'Primary MPN',
    alt1: 'Secondary MPN',
    alt2: 'Alt MPN',
    qty: 'Quantity',
    unit: 'UOM',
    unitCost: 'Unit Price',
    dnp: 'DNP Flag',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetModal = () => {
    setStep(1);
    setDragging(false);
    setBomName('');
    setSelectedProject('');
    setNewProjectName('');
    setBomVersion('V1.0');
    setUploadedFile(null);
    setMapping({
      component: 'Reference Designator',
      description: 'Description',
      main: 'Primary MPN',
      alt1: 'Secondary MPN',
      alt2: 'Alt MPN',
      qty: 'Quantity',
      unit: 'UOM',
      unitCost: 'Unit Price',
      dnp: 'DNP Flag',
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSave = () => {
    const projectName = selectedProject || newProjectName.trim();

    if (step < 3) {
      setStep(step + 1);
    } else {
      onSave({
        name: bomName,
        project: projectName,
        bomVersion,
        file: uploadedFile,
        mapping,
      });
      resetModal();
    }
  };

  const canContinue = step === 1
    ? Boolean((selectedProject || newProjectName.trim()) && bomName && bomVersion)
    : step === 2
    ? Boolean(uploadedFile)
    : true;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold">Upload BOM</h2>
            <p className="text-sm text-gray-500 mt-1">Upload, map, and confirm a BOM file before saving it as a draft.</p>
          </div>
          <button onClick={handleClose} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            Close
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[
            { id: 1, label: 'Details' },
            { id: 2, label: 'Upload File' },
            { id: 3, label: 'Map & Review' },
          ].map((item, index) => {
            const isActive = step === item.id;
            const isDone = step > item.id;
            return (
              <div key={item.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    isActive ? 'bg-white/20' : isDone ? 'bg-emerald-500 text-white' : 'bg-gray-200'
                  }`}>
                    {isDone ? <Check size={11} /> : item.id}
                  </span>
                  {item.label}
                </div>
                {index < 2 && <ChevronRight size={14} className="text-gray-400" />}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                {projects.length > 0 ? (
                  <select
                    value={selectedProject}
                    onChange={(e) => {
                      setSelectedProject(e.target.value);
                      setNewProjectName('');
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                  >
                    <option value="">Select a project</option>
                    {projects.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                    placeholder="Enter project name"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">BOM Name</label>
                <input
                  type="text"
                  value={bomName}
                  onChange={(e) => setBomName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                  placeholder="Enter BOM Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">BOM Version</label>
                <input
                  type="text"
                  value={bomVersion}
                  onChange={(e) => setBomVersion(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                  placeholder="e.g., V1.0"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (e.dataTransfer.files?.[0]) setUploadedFile(e.dataTransfer.files[0]);
              }}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition ${
                dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setUploadedFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Upload size={28} />
              </div>
              {uploadedFile ? (
                <>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Click or drop another file to replace it</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-900">Drag and drop your BOM file here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse. Supports Excel and CSV files.</p>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium mb-2">Review & Confirm</p>
                <div className="grid gap-2 text-sm md:grid-cols-2">
                  <p><span className="font-medium">Project:</span> {selectedProject || newProjectName}</p>
                  <p><span className="font-medium">BOM Name:</span> {bomName}</p>
                  <p><span className="font-medium">Version:</span> {bomVersion}</p>
                  <p><span className="font-medium">File:</span> {uploadedFile?.name || '-'}</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <p className="text-sm font-medium">Column Mapping</p>
                  <p className="text-xs text-gray-500 mt-1">Match uploaded file columns with ERP fields before saving.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">ERP Field</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">Uploaded File Column</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BOM_FIELDS.map((field) => (
                        <tr key={field.id} className="border-b border-gray-100 last:border-0">
                          <td className="px-4 py-3 text-xs font-medium text-gray-900">{field.label}</td>
                          <td className="px-4 py-3">
                            <select
                              value={mapping[field.id] || ''}
                              onChange={(e) => setMapping((current) => ({ ...current, [field.id]: e.target.value }))}
                              className="w-full max-w-sm border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
                            >
                              <option value="">Select column</option>
                              {DEFAULT_FILE_COLUMNS.map((column) => (
                                <option key={column} value={column}>{column}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-2 mt-6">
          <button
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else handleClose();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={handleSave}
            disabled={!canContinue}
            className={`px-4 py-2 rounded-md text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed ${step < 3 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {step === 1 ? 'Next: Upload File' : step === 2 ? 'Next: Map & Review' : 'Save BOM'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BOMManagement({ boms: initialBOMs }: { boms?: BOM[] }) {
  const [boms, setBOMs] = useState<BOM[]>(initialBOMs ?? []);
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const projects = ['All', ...Array.from(new Set(boms.map(b => b.project)))];

  const filtered = boms.filter(b => {
    const ms = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.project.toLowerCase().includes(search.toLowerCase());
    const mp = projectFilter === 'All' || b.project === projectFilter;
    const mst = statusFilter === 'All' || (b.status ?? 'Published') === statusFilter;
    return ms && mp && mst;
  });

  const handleUploadBOM = (data: any) => {
    const newBOM: BOM = {
      id: Date.now().toString(),
      name: data.name,
      project: data.project,
      board: 'NEW',
      boardVer: 'V1.0',
      bomVer: data.bomVersion,
      components: 0,
      dnp: 0,
      status: 'Draft',
      created: new Date().toISOString().split('T')[0],
    };
    setBOMs([newBOM, ...boms]);
    setShowUploadModal(false);
  };

  return (
    <Layout title="BOM Management" subtitle="Central library of all BOMs across all projects">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">BOM Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Central library of all BOMs across all projects</p>
          </div>
          <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
            <Plus size={16} /> Upload BOM
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total BOMs', value: boms.length, color: 'text-blue-600' },
            { label: 'Published', value: boms.filter(b => (b.status ?? 'Published') === 'Published').length, color: 'text-emerald-600' },
            { label: 'Total Components', value: boms.reduce((s, b) => s + b.components, 0).toLocaleString(), color: 'text-gray-900' },
            { label: 'Total DNP', value: boms.reduce((s, b) => s + b.dnp, 0), color: 'text-amber-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search BOM..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md bg-white outline-none focus:border-blue-500" />
          </div>
          <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white outline-none focus:border-blue-500">
            {projects.map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white outline-none focus:border-blue-500">
            {['All', 'Published', 'Draft', 'Archived'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">BOM Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">Project</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">Board</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">BOM Ver.</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-700">Components</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-700">DNP</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700">Created</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((b, i) => (
                  <tr key={b.id} className={`border-b border-gray-200 last:border-0 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-900">{b.name}</p>
                      <p className="text-xs text-gray-500">{b.bomVer}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-900">{b.project}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-900">{b.board}</p>
                      <p className="text-xs text-gray-500">{b.boardVer}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-900">{b.bomVer}</td>
                    <td className="px-4 py-3 text-xs text-right font-medium text-gray-900">{b.components}</td>
                    <td className="px-4 py-3 text-xs text-right text-amber-600 font-medium">{b.dnp}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[b.status ?? 'Published']}`}>{b.status ?? 'Published'}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{b.created || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye size={13} /></button>
                        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Edit"><Edit2 size={13} /></button>
                        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Clone"><Copy size={13} /></button>
                        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="New Version"><GitBranch size={13} /></button>
                        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Download"><Download size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No BOMs found. Upload a BOM to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-500">Showing {filtered.length} of {boms.length} BOMs</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40" disabled>Previous</button>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100">Next</button>
            </div>
          </div>
        </div>

        <UploadBOMModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} projects={projects.slice(1)} onSave={handleUploadBOM} />
      </div>
    </Layout>
  );
}
