import { ArrowLeft } from "lucide-react";

export default function ProjectDetails() {

    return (
  <div className="flex min-h-screen bg-[#f8fafc]">

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
  onClick={() => window.location.href = "/dashboard"}
  className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10 hover:text-white"
>
  Dashboard
</button>
<button
  onClick={() => window.location.href = "/projects"}
  className="flex w-full items-center gap-3 rounded-3xl bg-primary px-4 py-3 text-left text-sm text-white shadow-glass"
>
  Projects
</button>
 <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
            Bom Dashboard
          </button>

        
       

          <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
            Inventory Management
          </button>

          <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
            Procurement
          </button>

          <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
            Vendor Management
          </button>

          <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
            Reports
          </button>

          <button className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10">
            Settings
          </button>

        </nav>
      </div>
    </aside>

    <main className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="mb-4 flex items-center gap-2 text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              PCB-V3 Control Board
            </h1>

            <p className="mt-2 text-slate-500">
              CTL-Board • v3.0 • P001
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
            Active
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-8 border-b border-slate-200">
        <button className="border-b-2 border-blue-600 pb-3 font-semibold text-blue-600">
          Overview
        </button>

        <button
  onClick={() => (window.location.href = "/bom-upload")}
  className="pb-3 text-slate-500 hover:text-blue-600"
>
  BOM
</button>

        <button className="pb-3 text-slate-500">
          Quote Management
        </button>

        <button className="pb-3 text-slate-500">
          Procurement
        </button>

        <button className="pb-3 text-slate-500">
          Production
        </button>

        <button className="pb-3 text-slate-500">
          History
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            Project Information
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Project Name</span>
              <span>PCB-V3 Control Board</span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <span>Active</span>
            </div>

            <div className="flex justify-between">
              <span>Created Date</span>
              <span>2024-01-15</span>
            </div>

            <div className="flex justify-between">
              <span>Last Updated</span>
              <span>2024-02-20</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            Board Information
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Board Name</span>
              <span>CTL-Board</span>
            </div>

            <div className="flex justify-between">
              <span>Board Version</span>
              <span>v3.0</span>
            </div>

            <div className="flex justify-between">
              <span>BOM Version</span>
              <span>v1.2</span>
            </div>

            <div className="flex justify-between">
              <span>Component Count</span>
              <span>124</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            BOM Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total</span>
              <span>124</span>
            </div>

            <div className="flex justify-between">
              <span>DNP</span>
              <span>12</span>
            </div>

            <div className="flex justify-between">
              <span>Version</span>
              <span>v1.2</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            RFQ Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Open</span>
              <span>3</span>
            </div>

            <div className="flex justify-between">
              <span>Quoted</span>
              <span>2</span>
            </div>

            <div className="flex justify-between">
              <span>Pending</span>
              <span>1</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            Procurement Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Open POs</span>
              <span>1</span>
            </div>

            <div className="flex justify-between">
              <span>Value</span>
              <span>$1.2L</span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <span>Approved</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            Production Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Target</span>
              <span>5000</span>
            </div>

            <div className="flex justify-between">
              <span>Produced</span>
              <span>0</span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <span>Not Started</span>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
    
  );
}