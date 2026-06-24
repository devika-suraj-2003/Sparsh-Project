export default function ColumnMapping() {
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

        <button
          onClick={() => (window.location.href = "/bom-upload")}
          className="mb-6 text-slate-500 hover:text-blue-600"
        >
          ← BOM Upload
        </button>

        <h1 className="text-5xl font-bold">
          NRI Smart Meter Pilot
        </h1>

        <p className="mt-3 text-lg text-slate-500">
          SM100 • V2.0 • NR-001 • BOM BOM-V1.3
        </p>

        {/* Stepper */}
        <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-10 text-sm">

            <button
              onClick={() => (window.location.href = "/bom-upload")}
              className="text-green-600"
            >
              ✓ Upload BOM
            </button>

            <span className="font-semibold text-blue-600">
              2 Column Mapping
            </span>

            <span className="text-slate-500">
              3 DNP Review
            </span>

            <span className="text-slate-500">
              4 Save BOM
            </span>

          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">

          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-semibold">
              Column Mapping
            </h2>

            <div className="space-x-2">
              <button className="rounded border px-3 py-2">
                Load Template
              </button>

              <button className="rounded border px-3 py-2">
                Save Mapping
              </button>
            </div>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-2 text-left">Uploaded Column</th>
                <th className="border p-2 text-left">Sample Data</th>
                <th className="border p-2 text-left">Maps To</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-2">Item No</td>
                <td className="border p-2">1</td>
                <td className="border p-2">
                  <select className="w-full border p-1">
                    <option>Skip</option>
                  </select>
                </td>
                <td className="border p-2">-</td>
              </tr>

              <tr>
                <td className="border p-2">Reference Designator</td>
                <td className="border p-2">U1</td>
                <td className="border p-2">
                  <select className="w-full border p-1">
                    <option>Component Name</option>
                  </select>
                </td>
                <td className="border p-2 text-green-600">✓</td>
              </tr>

              <tr>
                <td className="border p-2">Part Number</td>
                <td className="border p-2">STM32F407</td>
                <td className="border p-2">
                  <select className="w-full border p-1">
                    <option>Manufacturer Part Number</option>
                  </select>
                </td>
                <td className="border p-2 text-green-600">✓</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 flex justify-end gap-3">
            <button className="rounded border px-4 py-2">
              Validate Mapping
            </button>

            <button
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Continue to BOM Review →
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}