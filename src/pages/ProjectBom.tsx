export default function ProjectBom() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">

      <h1 className="text-3xl font-bold text-slate-800">
        BOM Management
      </h1>

      <p className="mt-2 text-slate-500">
        PCB-V3 Control Board
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Total Components</p>
          <p className="mt-2 text-3xl font-bold">124</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="mt-2 text-3xl font-bold">110</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">DNP</p>
          <p className="mt-2 text-3xl font-bold">12</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Version</p>
          <p className="mt-2 text-3xl font-bold">v1.2</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Part Number</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Qty</th>
              <th className="p-4 text-left">Manufacturer</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-4">R001</td>
              <td className="p-4">10K Resistor</td>
              <td className="p-4">20</td>
              <td className="p-4">Vishay</td>
              <td className="p-4 text-green-600">Approved</td>
            </tr>

            <tr className="border-t">
              <td className="p-4">C001</td>
              <td className="p-4">100uF Capacitor</td>
              <td className="p-4">10</td>
              <td className="p-4">Murata</td>
              <td className="p-4 text-green-600">Approved</td>
            </tr>

            <tr className="border-t">
              <td className="p-4">U001</td>
              <td className="p-4">Microcontroller</td>
              <td className="p-4">1</td>
              <td className="p-4">STM</td>
              <td className="p-4 text-yellow-600">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}