import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2.5 shadow-xl text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      <p className="text-primary-600 dark:text-primary-400">Revenue: <b>{formatCurrency(payload[0]?.value)}</b></p>
      <p className="text-emerald-600 dark:text-emerald-400">Qty Sold: <b>{payload[1]?.value} units</b></p>
    </div>
  );
};

/**
 * WeeklyBarChart — dynamic regional / monthly comparative bar chart.
 * Uses regionBreakdown from DataContext.
 */
export default function WeeklyBarChart() {
  const { regionBreakdown } = useData();

  const chartData = regionBreakdown.map(r => ({
    region: r.region,
    revenue: r.revenue,
    orders: r.orders * 15,
  }));

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Regional Performance</h2>
          <p className="text-xs text-gray-400 mt-0.5">Revenue & Order metrics across regions</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary-500 inline-block" />
            <span className="text-gray-500 dark:text-gray-400">Revenue</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary-200 dark:bg-primary-900 inline-block" />
            <span className="text-gray-500 dark:text-gray-400">Orders Scale</span>
          </span>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
            <XAxis
              dataKey="region"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-400"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-gray-400"
              axisLine={false}
              tickLine={false}
              tickFormatter={v => v >= 100000 ? `₹${v / 100000}L` : `₹${v / 1000}K`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)', radius: 4 }} />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="#6366f1" maxBarSize={32} />
            <Bar dataKey="orders"  radius={[6, 6, 0, 0]} fill="#c7d2fe" maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
