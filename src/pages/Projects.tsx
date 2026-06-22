import {
  Search,
  Plus,
  Filter,
  Grid,
  List,
  Briefcase,
  Box,
  Layers,
  FileText,
  Package,
  ShoppingCart,
  Users,
  Database,
  Settings
} from "lucide-react";

const projects = [
  {
    name: "PCB-V3 Control Board",
    board: "CTL-Board",
    version: "v3.0",
    status: "Active",
    components: 124,
    openPO: 3,
    created: "2024-01-15",
  },
  {
    name: "IoT Gateway Module",
    board: "IoT-GW",
    version: "v2.1",
    status: "Active",
    components: 87,
    openPO: 5,
    created: "2024-01-22",
  },
  {
    name: "Power Supply Unit",
    board: "PSU",
    version: "v1.5",
    status: "On Hold",
    components: 56,
    openPO: 1,
    created: "2024-02-03",
  },
  {
    name: "Motor Driver Shield",
    board: "MDS",
    version: "v4.0",
    status: "Active",
    components: 43,
    openPO: 2,
    created: "2024-02-10",
  },
  {
    name: "Sensor Array Board",
    board: "SAB",
    version: "v1.0",
    status: "Completed",
    components: 98,
    openPO: 0,
    created: "2024-01-05",
  },
  {
    name: "HMI Display Interface",
    board: "HMI-v2",
    version: "v2.0",
    status: "Planning",
    components: 72,
    openPO: 0,
    created: "2024-02-20",
  },
  {
    name: "CAN Bus Controller",
    board: "CAN-CTL",
    version: "v1.2",
    status: "Active",
    components: 35,
    openPO: 1,
    created: "2024-02-14",
  },
  {
    name: "RF Transceiver Module",
    board: "RF-TRX",
    version: "v3.1",
    status: "Completed",
    components: 61,
    openPO: 0,
    created: "2024-01-28",
  },
];

export default function Projects() {

    return (
  <div className="min-h-screen bg-[#f8fafc]">
    <div className="fixed inset-x-0 top-0 z-20 h-[72px] border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
  <div className="mx-auto flex h-[72px] items-center px-6">
    <h2 className="text-lg font-semibold text-navy">
      SPARSHIQ ERP
    </h2>
  </div>
</div>

<div className="mt-[72px] flex min-h-screen">
    <aside className="hidden w-72 shrink-0 bg-navy px-6 py-8 md:block">
  <div className="space-y-6">
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-100 shadow-glass">
      <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
        Workspace
      </p>
      <p className="mt-3 text-2xl font-semibold text-white">
        Operations Suite
      </p>
    </div>

    <nav className="space-y-2">
    <button
  className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10"
  onClick={() => (window.location.href = "/dashboard")}
>
  <Box size={18} />
  Dashboard
</button>

      <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
  <Briefcase size={18} />
  Projects
</button>

      <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
       <Layers size={18} />
        BOM Management
      </button>

      <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
       <FileText size={18} />
        Quote Management
      </button>

      <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
       <Package size={18} />
        Inventory Management
      </button>

      <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
      <ShoppingCart size={18} />
        Procurement
      </button>

      <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
      <Users size={18} />
        Vendor Management
      </button>

      <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
        <Database size={18} />
        Reports
      </button>

      <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
       <Settings size={18} />
        Settings
      </button>
    </nav>
  </div>
</aside>
<main className="flex-1 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Projects 
          </h1>
          <p className="mt-2 text-slate-500">
            8 total projects
          </p>
        </div>

      
      </div>

     <div className="mb-6 flex items-center justify-between">
  <div className="relative w-full max-w-md">
    <Search
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
    />

    <input
      type="text"
      placeholder="Search projects..."
      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4"
    />
  </div>

  <div className="flex items-center gap-3">
    <button className="rounded-xl border border-slate-200 px-4 py-3">
      Filter
    </button>

    <button className="rounded-xl bg-blue-600 px-5 py-3 text-white">
      + New Project
    </button>
  </div>
</div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-lg">
       <table className="min-w-[1200px] w-full">
          <thead className="bg-slate-100">
            <tr>
             <th className="p-4 text-left">Project Name</th>
<th className="p-4 text-left">Board Name</th>
<th className="p-4 text-left">Version</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Components</th>
<th className="p-4 text-left">Open RFQs</th>
<th className="p-4 text-left">Created</th>
<th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project, index) => (
              <tr
                key={index}
                className="border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} />
                    <a
  href={`/project/${index + 1}`}
  className="text-blue-600 hover:underline"
>
  {project.name}
</a>
                  </div>
                </td>


                <td className="p-4">{project.board}</td>

                <td className="p-4">{project.version}</td>

                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    {project.status}
                  </span>
                </td>

                <td className="p-4">{project.components}</td>

                <td className="p-4">{project.openPO}</td>

<td className="p-4">{project.created}</td>

<td className="p-4">
  <button className="font-bold text-slate-500">
    ...
  </button>
</td>
              </tr>
              
            ))}
          </tbody>
        </table>
        

<div className="flex items-center justify-between p-4 text-sm text-slate-500">
  <span>Showing 8 of 8 projects</span>

  <div className="flex items-center gap-2">
    <button className="rounded border px-3 py-1">
      Previous
    </button>

    <button className="rounded bg-blue-600 px-3 py-1 text-white">
      1
    </button>

    <button className="rounded border px-3 py-1">
      2
    </button>

    <button className="rounded border px-3 py-1">
      Next
    </button>
  </div>
</div>

</div>
</main>
</div>
    </div>  
    
  );
}