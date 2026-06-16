import { ArrowUpRight, Bell, Box, Briefcase, ClipboardCheck, Database, FileText, Layers, Mail, Package, Plus, Search, Settings, ShoppingBag, ShoppingCart, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { label: 'Dashboard', icon: Box },
  { label: 'Projects', icon: Briefcase },
  { label: 'BOM Management', icon: Layers },
  { label: 'Quote Management', icon: FileText },
  { label: 'Inventory Management', icon: Package },
  { label: 'Procurement', icon: ShoppingCart },
  { label: 'Vendor Management', icon: Users },
  { label: 'Reports', icon: Database },
  { label: 'Settings', icon: Settings }
];

const stats = [
  { label: 'Total Projects', value: '28', growth: '+12.4%', icon: Briefcase },
  { label: 'Active BOMs', value: '13', growth: '+9.1%', icon: Layers },
  { label: 'Inventory Value', value: '$1.2M', growth: '+4.8%', icon: Database },
  { label: 'Open POs', value: '18', growth: '+6.3%', icon: ShoppingBag }
];

const projects = [
  { name: 'Apollo Producer', version: 'v2.4', value: '$164K', status: 'In production', progress: 82 },
  { name: 'Orion Parts', version: 'v1.8', value: '$89K', status: 'Design review', progress: 56 },
  { name: 'Titan Line', version: 'v3.1', value: '$240K', status: 'Procurement', progress: 68 }
];

const activity = [
  { icon: ClipboardCheck, label: 'BOM Uploaded', detail: 'Mass parts update processed', time: '2h ago' },
  { icon: ShoppingCart, label: 'PO Generated', detail: 'PO-5589 created for vendor', time: '1d ago' }
];

const actions = [
  { label: 'Create Project', icon: Sparkles },
  { label: 'Upload BOM', icon: Box },
  { label: 'Compare Quotes', icon: FileText },
  { label: 'Generate Purchase Order', icon: ShoppingBag }
];

const currentDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
}).format(new Date());

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="fixed inset-x-0 top-0 z-20 h-[72px] border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary text-white shadow-lg shadow-primary/20">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">SPARSHIQ ERP</p>
              <p className="text-xs text-slate-500">Manufacturing · Procurement · Inventory</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search global operations"
                className="w-96 rounded-3xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-3xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50">
              <Bell size={18} />
            </button>
            <button className="rounded-3xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50">
              <Mail size={18} />
            </button>
            <button className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">A</div>
              <div className="text-left">
                <p className="font-semibold">A. Desai</p>
                <p className="text-xs text-slate-500">Operations Lead</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-[72px] flex min-h-screen">
        <aside className="hidden w-72 shrink-0 bg-navy px-6 py-8 md:block">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-100 shadow-glass">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Workspace</p>
              <p className="mt-3 text-2xl font-semibold text-white">Operations Suite</p>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = index === 0;
                return (
                  <button
                    key={item.label}
                    className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm transition ${
                      active ? 'bg-primary text-white shadow-glass' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="flex-1 px-6 py-8 md:px-10">
          <div className="grid gap-6 sm:grid-cols-[1.4fr_0.6fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="rounded-[32px] border border-slate-200/70 bg-white/90 p-8 shadow-glass"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Welcome Back</p>
                  <h1 className="mt-3 text-3xl font-semibold text-navy">Operational command center</h1>
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-500">{currentDate}</div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-6">
                  <p className="text-sm text-slate-500">Current runway</p>
                  <p className="mt-3 text-3xl font-semibold text-navy">24 days</p>
                </div>
                <div className="rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-6">
                  <p className="text-sm text-slate-500">Procurement efficiency</p>
                  <p className="mt-3 text-3xl font-semibold text-navy">92.7%</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="rounded-[32px] border border-slate-200/70 bg-white/90 p-8 shadow-glass"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Current cycle</p>
                  <h2 className="mt-2 text-2xl font-semibold text-navy">Supply chain pulse</h2>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <ArrowUpRight size={20} />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>On-time deliveries</span>
                    <span className="font-semibold text-navy">97%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[97%] rounded-full bg-primary" />
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Procurement SLA</span>
                    <span className="font-semibold text-navy">88%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[88%] rounded-full bg-warning" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <section className="mt-8 grid gap-6 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -6 }}
                  className="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-glass transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                      <p className="mt-4 text-3xl font-semibold text-navy">{item.value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-primary">
                      <Icon size={20} />
                    </div>
                  </div>
                  <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">{item.growth}</span>
                    Growth vs last week
                  </p>
                </motion.div>
              );
            })}
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Projects Overview</p>
                  <h2 className="mt-3 text-2xl font-semibold text-navy">Active manufacturing initiatives</h2>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:scale-[1.01]">
                  <Plus size={16} /> New Project
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <motion.div
                    key={project.name}
                    whileHover={{ y: -8 }}
                    className="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-glass"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-navy">{project.name}</p>
                        <p className="text-sm text-slate-500">{project.version}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">{project.status}</div>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-500">
                      <span>BOM Value</span>
                      <span className="font-semibold text-navy">{project.value}</span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                    </div>
                    <p className="mt-3 text-sm text-slate-500">Progress {project.progress}%</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-glass">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recent Activity</p>
                    <h2 className="mt-3 text-2xl font-semibold text-navy">Operational timeline</h2>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {activity.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-4 rounded-3xl border border-slate-200/70 bg-slate-50 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-primary shadow-sm">
                          <Icon size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-navy">{item.label}</p>
                          <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.time}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-glass">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Quick Actions</p>
                    <h2 className="mt-3 text-2xl font-semibold text-navy">Accelerate workflows</h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {actions.map((action) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.01 }}
                      className="inline-flex w-full items-center gap-3 rounded-3xl border border-slate-200/70 bg-slate-50 px-5 py-4 text-left text-sm font-semibold text-slate-700 transition"
                    >
                      <action.icon size={18} className="text-primary" />
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
