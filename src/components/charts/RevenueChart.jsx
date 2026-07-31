import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-4 py-3 shadow-xl text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500 dark:text-gray-400 capitalize">{p.dataKey}:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * RevenueChart — Area chart showing monthly revenue vs target.
 * Dynamically connected to DataContext (responds to filters and live updates).
 */
export default function RevenueChart() {
  const { monthlyPivot, kpis } = useData();

  const chartData = monthlyPivot.map(m => ({
    month: m.month,
    revenue: m.revenue,
    target: Math.round(m.revenue * 0.85),
  }));

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
          <p className="text-xs text-gray-400 mt-0.5">Monthly revenue vs target · Total ₹{(kpis.totalSales / 100000).toFixed(2)}L</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded bg-primary-500 inline-block" />
            <span className="text-gray-500 dark:text-gray-400">Revenue</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded bg-accent-500 inline-block" style={{ borderTop: '2px dashed #10b981', background: 'transparent' }} />
            <span className="text-gray-500 dark:text-gray-400">Target</span>
          </span>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gradTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
            <XAxis
              dataKey="month"
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 3"
              fill="url(#gradTarget)"
              dot={false}
              name="Target"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#gradRevenue)"
              dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#4f46e5' }}
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
