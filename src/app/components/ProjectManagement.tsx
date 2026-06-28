import { useState } from 'react';
import {
  BarChart2,
  CalendarDays,
  ChevronRight,
  Clock,
  Edit2,
  LayoutGrid,
  Plus,
  Search,
  Table2,
  Users,
  X,
} from 'lucide-react';
import Layout from './Layout';

type WorkflowStatus =
  | 'Quote In Progress'
  | 'Vendor Finalized'
  | 'RFQ Sent'
  | 'Quote Received'
  | 'Negotiation'
  | 'PO Raised'
  | 'Goods Receiving'
  | 'Not Started'
  | 'PO Sent'
  | 'In Progress'
  | 'Completed';

type Project = {
  id: string | number;
  name: string;
  code?: string;
  customer?: string;
  client?: string;
  owner?: string;
  board?: string;
  boardVersion?: string;
  bomVersion?: string;
  quoteStatus?: WorkflowStatus;
  procurementStatus?: WorkflowStatus;
  productionStatus?: WorkflowStatus;
  lastUpdated?: string;
  description?: string;
  budget?: number;
  progress?: number;
  teamSize?: number;
};

const STATUS_STYLES: Record<string, string> = {
  'Quote In Progress': 'bg-yellow-100 text-yellow-800',
  'Vendor Finalized': 'bg-green-100 text-green-800',
  'RFQ Sent': 'bg-blue-100 text-blue-800',
  'Quote Received': 'bg-purple-100 text-purple-800',
  Negotiation: 'bg-orange-100 text-orange-800',
  'PO Raised': 'bg-blue-100 text-blue-800',
  'Goods Receiving': 'bg-teal-100 text-teal-800',
  'Not Started': 'bg-gray-100 text-gray-600',
  'PO Sent': 'bg-indigo-100 text-indigo-800',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-800',
};

const QUOTE_STATUSES: WorkflowStatus[] = [
  'Quote In Progress',
  'Vendor Finalized',
  'RFQ Sent',
  'Quote Received',
  'Negotiation',
];

const PROCUREMENT_STATUSES: WorkflowStatus[] = ['Not Started', 'PO Sent', 'PO Raised', 'Goods Receiving'];
const PRODUCTION_STATUSES: WorkflowStatus[] = ['Not Started', 'In Progress', 'Completed'];

function StatusBadge({ status = 'Not Started' }: { status?: string }) {
  const className = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600';
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>{status}</span>;
}

function ProgressBar({ value = 0 }: { value?: number }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 50 ? 'bg-blue-500' : 'bg-yellow-500';
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div className={`${color} h-1.5 rounded-full`} style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}

function ProjectModal({ project, onClose, onSave }: { project?: Project; onClose: () => void; onSave: (project: Project) => void }) {
  const [form, setForm] = useState({
    name: project?.name ?? '',
    code: project?.code ?? '',
    customer: project?.customer ?? project?.client ?? '',
    owner: project?.owner ?? '',
    board: project?.board ?? '',
    boardVersion: project?.boardVersion ?? '',
    bomVersion: project?.bomVersion ?? '',
    quoteStatus: project?.quoteStatus ?? 'RFQ Sent',
    procurementStatus: project?.procurementStatus ?? 'Not Started',
    productionStatus: project?.productionStatus ?? 'Not Started',
    description: project?.description ?? '',
    budget: project?.budget ?? 0,
    progress: project?.progress ?? 0,
    teamSize: project?.teamSize ?? 1,
  });

  const handleSave = () => {
    if (!form.name.trim()) return;

    onSave({
      id: project?.id ?? Date.now().toString(),
      name: form.name.trim(),
      code: form.code.trim(),
      customer: form.customer.trim(),
      client: form.customer.trim(),
      owner: form.owner.trim(),
      board: form.board,
      boardVersion: form.boardVersion,
      bomVersion: form.bomVersion.trim(),
      quoteStatus: form.quoteStatus as WorkflowStatus,
      procurementStatus: form.procurementStatus as WorkflowStatus,
      productionStatus: form.productionStatus as WorkflowStatus,
      description: form.description.trim(),
      lastUpdated: new Date().toISOString().slice(0, 10),
      budget: Number(form.budget) || 0,
      progress: Math.min(Math.max(Number(form.progress) || 0, 0), 100),
      teamSize: Number(form.teamSize) || 1,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{project ? 'Edit Project' : 'Create New Project'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Project Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Smart Meter Pilot"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Project Code</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. PROJ-2026-001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Customer Name</label>
              <input
                value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Project Owner</label>
              <input
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Board Selection</label>
              <input
                value={form.board}
                onChange={(e) => setForm({ ...form, board: e.target.value })}
                placeholder="e.g. SM100"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Board Version</label>
              <input
                value={form.boardVersion}
                onChange={(e) => setForm({ ...form, boardVersion: e.target.value })}
                placeholder="e.g. V2.0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">BOM Version</label>
              <input
                value={form.bomVersion}
                onChange={(e) => setForm({ ...form, bomVersion: e.target.value })}
                placeholder="e.g. BOM-1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Quote Status</label>
              <select
                value={form.quoteStatus}
                onChange={(e) => setForm({ ...form, quoteStatus: e.target.value as WorkflowStatus })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {QUOTE_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Procurement</label>
              <select
                value={form.procurementStatus}
                onChange={(e) => setForm({ ...form, procurementStatus: e.target.value as WorkflowStatus })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PROCUREMENT_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Production</label>
              <select
                value={form.productionStatus}
                onChange={(e) => setForm({ ...form, productionStatus: e.target.value as WorkflowStatus })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PRODUCTION_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Budget</label>
              <input
                type="number"
                min="0"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Team Size</label>
              <input
                type="number"
                min="1"
                value={form.teamSize}
                onChange={(e) => setForm({ ...form, teamSize: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Progress</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief project description..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Save Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectManagement({ projects: initialProjects }: { projects?: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects ?? []);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | undefined>(undefined);

  const filtered = projects.filter((project) => {
    const query = search.toLowerCase();
    const matchesSearch = !query ||
      project.name.toLowerCase().includes(query) ||
      (project.code ?? '').toLowerCase().includes(query) ||
      (project.board ?? '').toLowerCase().includes(query) ||
      (project.customer ?? project.client ?? '').toLowerCase().includes(query);
    const matchesStatus = filterStatus === 'All' || project.quoteStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const activeCount = projects.filter((project) => project.productionStatus !== 'Completed').length;
  const completedCount = projects.filter((project) => project.productionStatus === 'Completed').length;
  const avgProgress = projects.length ? Math.round(projects.reduce((sum, project) => sum + (project.progress ?? 0), 0) / projects.length) : 0;
  const totalBudget = projects.reduce((sum, project) => sum + (project.budget ?? 0), 0);

  const handleSaveProject = (project: Project) => {
    setProjects((current) => {
      const exists = current.some((item) => item.id === project.id);
      return exists ? current.map((item) => item.id === project.id ? project : item) : [project, ...current];
    });
    setShowModal(false);
    setEditProject(undefined);
  };

  const openProject = (project: Project) => {
    setEditProject(project);
    setShowModal(true);
  };

  return (
    <Layout title="Project Management" subtitle="Oversee projects, timelines, and resource allocation">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500 mt-0.5">{activeCount} active projects</p>
          </div>
          <button
            onClick={() => {
              setEditProject(undefined);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Create Project
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Projects', value: projects.length, sub: 'in workspace' },
            { label: 'Active Projects', value: activeCount, sub: 'not completed' },
            { label: 'Completed', value: completedCount, sub: 'delivered' },
            { label: 'Avg Progress', value: projects.length ? `${avgProgress}%` : '-', sub: totalBudget ? `Budget $${totalBudget.toLocaleString()}` : 'no budget added' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-64 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search projects, boards, codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            {QUOTE_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('card')}
              className={`px-3 py-2 ${view === 'card' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Card view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-3 py-2 ${view === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Table view"
            >
              <Table2 size={16} />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600">No projects found. Create a project to get started.</p>
          </div>
        ) : view === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <div
                key={project.id}
                onClick={() => openProject(project)}
                className="bg-white rounded-lg border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{project.code || 'No project code'}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 mt-1 shrink-0" />
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">{project.board || 'No board'}</span>
                  <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">{project.boardVersion || '-'}</span>
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">{project.bomVersion || 'No BOM'}</span>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-gray-500">Quote</span>
                    <StatusBadge status={project.quoteStatus} />
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-gray-500">Procurement</span>
                    <StatusBadge status={project.procurementStatus} />
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-gray-500">Production</span>
                    <StatusBadge status={project.productionStatus} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Overall Progress</span>
                    <span className="font-medium">{project.progress ?? 0}%</span>
                  </div>
                  <ProgressBar value={project.progress} />
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Updated {project.lastUpdated || '-'}</span>
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      openProject(project);
                    }}
                    className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
                    title="Edit project"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Board</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">BOM</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Quote Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Procurement</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Production</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Updated</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((project) => (
                    <tr key={project.id} className="hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => openProject(project)}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{project.name}</div>
                        <div className="text-xs text-gray-400">{project.code || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{project.board || '-'}</div>
                        <div className="text-xs text-gray-400">{project.boardVersion || '-'}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{project.bomVersion || '-'}</td>
                      <td className="px-4 py-3"><StatusBadge status={project.quoteStatus} /></td>
                      <td className="px-4 py-3"><StatusBadge status={project.procurementStatus} /></td>
                      <td className="px-4 py-3"><StatusBadge status={project.productionStatus} /></td>
                      <td className="px-4 py-3 min-w-32">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={project.progress} />
                          <span className="text-xs text-gray-500">{project.progress ?? 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{project.lastUpdated || '-'}</td>
                      <td className="px-4 py-3">
                        <ChevronRight size={16} className="text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && (
          <ProjectModal
            project={editProject}
            onClose={() => {
              setShowModal(false);
              setEditProject(undefined);
            }}
            onSave={handleSaveProject}
          />
        )}

        <div className="hidden">
          <CalendarDays />
          <Users />
          <BarChart2 />
        </div>
      </div>
    </Layout>
  );
}
