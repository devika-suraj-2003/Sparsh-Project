import { useMemo, useState } from 'react';
import { ArrowUpRight, Briefcase, FolderKanban, MoreVertical, Package, Search, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { DashboardData, DashboardIcon, dashboardData } from '../data/dashboardData';

const iconMap: Record<DashboardIcon, typeof TrendingUp> = {
  trending: TrendingUp,
  package: Package,
  briefcase: Briefcase,
  users: Users,
  folder: FolderKanban,
  cart: ShoppingCart,
};

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
};

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-full min-h-40 flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
      {label}
    </div>
  );
}

function LineChartLite({
  data,
  series,
  min,
  max,
}: {
  data: Array<Record<string, string | number>>;
  series: Array<{ key: string; label: string; color: string }>;
  min?: number;
  max?: number;
}) {
  const width = 640;
  const height = 210;
  const padding = 28;
  const values = data.flatMap((point) => series.map((item) => Number(point[item.key] ?? 0)));
  const chartMin = min ?? Math.min(...values, 0);
  const chartMax = max ?? Math.max(...values, 1);

  const pathFor = (key: string) => data.map((point, index) => {
    const x = data.length === 1 ? width / 2 : padding + (index * (width - padding * 2)) / (data.length - 1);
    const value = Number(point[key] ?? 0);
    const y = height - padding - ((value - chartMin) / Math.max(chartMax - chartMin, 1)) * (height - padding * 2);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  if (data.length === 0) return <EmptyChart label="No trend data available." />;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52" role="img" aria-label="Trend chart">
        {[0, 1, 2, 3].map((tick) => {
          const y = padding + tick * ((height - padding * 2) / 3);
          return <line key={tick} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#f1f5f9" />;
        })}
        {series.map((item) => (
          <path key={item.key} d={pathFor(item.key)} fill="none" stroke={item.color} strokeWidth="3" />
        ))}
        {data.map((point, index) => {
          const x = data.length === 1 ? width / 2 : padding + (index * (width - padding * 2)) / (data.length - 1);
          return (
            <text key={`${point.month}-${index}`} x={x} y={height - 6} textAnchor="middle" className="fill-gray-500 text-[11px]">
              {String(point.month)}
            </text>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {series.map((item) => (
          <span key={item.key} className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function BarChartLite({ data }: { data: DashboardData['productionEfficiency'] }) {
  if (data.length === 0) return <EmptyChart label="No production efficiency data available." />;

  return (
    <div className="h-44 flex items-end gap-4">
      {data.map((item) => (
        <div key={item.project} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="w-full rounded-t bg-blue-600" style={{ height: `${Math.max(item.eff, 0)}%` }} />
          <span className="w-full truncate text-center text-xs text-gray-500">{item.project}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectStatusDonut({ data }: { data: DashboardData['projectStatus'] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0 || total === 0) return <EmptyChart label="No project status data available." />;

  let cumulative = 0;
  const gradient = data.map((item) => {
    const start = (cumulative / total) * 100;
    cumulative += item.value;
    const end = (cumulative / total) * 100;
    return `${item.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div>
      <div className="mx-auto h-32 w-32 rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="flex h-full items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-white" />
        </div>
      </div>
      <div className="space-y-1 mt-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="text-gray-500 flex-1 truncate">{item.name}</span>
            <span className="font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function defaultMetrics(data: DashboardData) {
  if (data.metrics.length > 0) return data.metrics;

  return [
    { label: 'Total Projects', value: String(data.activeProjects.length), change: '+0%', icon: 'folder' as DashboardIcon, color: 'blue' as const },
    { label: 'Total Vendors', value: String(data.vendorPerformance.length), change: '+0%', icon: 'users' as DashboardIcon, color: 'purple' as const },
    { label: 'Inventory Value', value: '0', change: '+0%', icon: 'package' as DashboardIcon, color: 'emerald' as const },
    { label: 'Open Purchase Orders', value: '0', change: '+0%', icon: 'cart' as DashboardIcon, color: 'amber' as const },
  ];
}

export default function Dashboard() {
  const [data] = useState(dashboardData);
  const metrics = useMemo(() => defaultMetrics(data), [data]);

  return (
    <main className="min-h-screen lg:ml-80 bg-gray-50">
      <div className="px-6 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Enterprise-wide performance and trend analysis</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search analytics..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = iconMap[metric.icon];
            const color = colorMap[metric.color ?? 'blue'];
            return (
              <div key={metric.label} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  </div>
                  <div className={`${color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mt-3">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{metric.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Vendor Performance Trend (Score /100)</h3>
            <LineChartLite
              data={data.vendorTrend}
              min={60}
              max={100}
              series={[
                { key: 'arrow', label: 'Arrow', color: '#2563eb' },
                { key: 'mouser', label: 'Mouser', color: '#10b981' },
                { key: 'avnet', label: 'Avnet', color: '#f59e0b' },
              ]}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Component Price Trend</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <LineChartLite
              data={data.priceTrend}
              series={[{ key: 'stm', label: 'STM32', color: '#2563eb' }]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Procurement Lead Time (days)</h3>
            <LineChartLite
              data={data.leadTimeTrend}
              series={[
                { key: 'arrow', label: 'Arrow', color: '#2563eb' },
                { key: 'mouser', label: 'Mouser', color: '#10b981' },
                { key: 'avnet', label: 'Avnet', color: '#f59e0b' },
              ]}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Inventory Utilization (%)</h3>
            <LineChartLite
              data={data.inventoryUtilization}
              min={40}
              max={100}
              series={[{ key: 'util', label: 'Utilization', color: '#10b981' }]}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Projects by Status</h3>
            <ProjectStatusDonut data={data.projectStatus} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Production Efficiency by Project (%)</h3>
          <BarChartLite data={data.productionEfficiency} />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Project Name</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Progress</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Team</th>
                </tr>
              </thead>
              <tbody>
                {data.activeProjects.length > 0 ? data.activeProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{project.name}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-28 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{project.team ?? 0} members</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-8 px-4 text-center text-gray-500">No active project data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
