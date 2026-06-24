import { CheckCircle } from "lucide-react";
import { useState } from "react";

export default function BomUpload() {
  const [fileName, setFileName] = useState("");
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">

      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 bg-[#08142f] px-6 py-8 md:block">
        <div className="space-y-6">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-100">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
              Workspace
            </p>

            <p className="mt-3 text-2xl font-semibold text-white">
              Operations Suite
            </p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex w-full items-center rounded-3xl px-4 py-3 text-left text-sm text-white hover:bg-white/10"
            >
              Dashboard
            </button>

            <button
              onClick={() => (window.location.href = "/projects")}
              className="flex w-full items-center rounded-3xl bg-blue-600 px-4 py-3 text-left text-sm text-white"
            >
              Projects
            </button>

            <button className="flex w-full items-center rounded-3xl px-4 py-3 text-left text-sm text-white hover:bg-white/10">
              Inventory Dashboard
            </button>

            <button className="flex w-full items-center rounded-3xl px-4 py-3 text-left text-sm text-white hover:bg-white/10">
              Vendors
            </button>

            <button className="flex w-full items-center rounded-3xl px-4 py-3 text-left text-sm text-white hover:bg-white/10">
              Analytics
            </button>

            <button className="flex w-full items-center rounded-3xl px-4 py-3 text-left text-sm text-white hover:bg-white/10">
              Settings
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        <div className="mb-6">
          <button
            onClick={() => (window.location.href = "/project/1")}
            className="text-slate-500 hover:text-blue-600"
          >
            ← Projects
          </button>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-bold">
              NRI Smart Meter Pilot
            </h1>

            <p className="mt-3 text-lg text-slate-500">
              SM100 • V2.0 • NR-001 • BOM BOM-V1.3
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-slate-500">
                Components
              </p>

              <p className="text-3xl font-bold">
                247
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-slate-500">
                Open RFQs
              </p>

              <p className="text-3xl font-bold">
                3
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-10 border-b pb-4">
         <button
  onClick={() => (window.location.href = "/project/1")}
  className="cursor-pointer text-slate-500 hover:text-blue-600"
>
  Overview
</button>

          <span className="cursor-pointer font-semibold text-blue-600">
            BOM
          </span>

          <span className="cursor-pointer text-slate-500">
            Quote Management
          </span>

          <span className="cursor-pointer text-slate-500">
            Procurement
          </span>

          <span className="cursor-pointer text-slate-500">
            Production
          </span>

          <span className="cursor-pointer text-slate-500">
            History
          </span>
        </div>

        {/* Stepper */}
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-10 text-sm">
            <span className="font-semibold text-blue-600">
              1 Upload BOM
            </span>

         <button
  onClick={() => (window.location.href = "/column-mapping")}
  className="text-slate-500 hover:text-blue-600"
>
  2 Column Mapping
</button>

            <span className="text-slate-500">
              3 DNP Review
            </span>

            <span className="text-slate-500">
              4 Save BOM
            </span>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Upload BOM File
              </h2>

              <p className="text-sm text-slate-500">
                Upload your engineering BOM in Excel format
              </p>
            </div>

            <button className="rounded-lg border px-4 py-2">
              Download Template
            </button>
          </div>

          <div className="rounded-xl border-2 border-dashed border-green-300 bg-green-50 p-16 text-center">

  <input
    type="file"
    accept=".xlsx,.xls,.csv"
    className="mb-4"
  />

  <p className="text-lg font-semibold">
    Select BOM File
  </p>

  <p className="text-slate-500">
    Excel (.xlsx, .xls) or CSV
  </p>

</div>

          {/* Validation */}
          <div className="mt-6 rounded-xl bg-green-50 p-4">
            <p className="font-semibold text-green-700">
              Validation Passed ✓
            </p>

            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>• 247 rows detected</li>
              <li>• 8 columns identified</li>
              <li>• 11 DNP components found</li>
              <li>• 3 potential duplicates detected</li>
            </ul>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="rounded-lg border px-5 py-2">
              Validate BOM
            </button>

            <button
  onClick={() => (window.location.href = "/column-mapping")}
  className="rounded-lg bg-blue-600 px-5 py-2 text-white"
>
  Continue to Column Mapping →
</button>
          </div>
        </div>

      </main>
    </div>
  );
}