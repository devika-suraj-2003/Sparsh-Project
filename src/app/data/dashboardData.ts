export type DashboardIcon = 'trending' | 'package' | 'briefcase' | 'users' | 'folder' | 'cart';

export interface DashboardData {
  metrics: Array<{
    label: string;
    value: string;
    change: string;
    icon: DashboardIcon;
    color?: 'blue' | 'emerald' | 'amber' | 'purple';
  }>;
  spendTrend: Array<{
    month: string;
    value: number;
  }>;
  vendorPerformance: Array<{
    name: string;
    score: number;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    timestamp: string;
    status: string;
  }>;
  activeProjects: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    team?: number;
  }>;
  vendorTrend: Array<{
    month: string;
    arrow: number;
    mouser: number;
    avnet: number;
  }>;
  priceTrend: Array<{
    month: string;
    stm: number;
    esp?: number;
    resistor?: number;
  }>;
  leadTimeTrend: Array<{
    month: string;
    arrow: number;
    mouser: number;
    avnet: number;
  }>;
  inventoryUtilization: Array<{
    month: string;
    util: number;
  }>;
  productionEfficiency: Array<{
    project: string;
    eff: number;
  }>;
  projectStatus: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const dashboardData: DashboardData = {
  metrics: [],
  spendTrend: [],
  vendorPerformance: [],
  recentActivity: [],
  activeProjects: [],
  vendorTrend: [],
  priceTrend: [],
  leadTimeTrend: [],
  inventoryUtilization: [],
  productionEfficiency: [],
  projectStatus: []
};
