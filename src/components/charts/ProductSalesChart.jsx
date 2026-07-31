import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts';
import { useData } from '../../context/DataContext';

const BAR_COLORS = [
  '#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6',
  '#06b6d4','#ec4899','#84cc16','#f97316','#64748b',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="card px-3 py-2.5 shadow-xl text-xs">
      <p className="font-bold text-gray-800 dark:text-gray-100 mb-1">{label}</p>
      <p className="text-primary-600">Revenue: <b>₹{(payload[0]?.value / 100000).toFixed(2)}L</b></p>
      <p className="text-gray-400 mt-0.5">Qty: <b>{d?.qty}</b> · Orders: <b>{d?.orders}</b></p>
    </div>
  );
};

/**
 * ProductSalesChart — reads live from DataContext.
 * Automatically re-renders when records are added or filters change.
 */
export default function ProductSalesChart() {
  const { productPivot } = useData();

  return (
    <div className="card p-5 animate-fade-in h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white">Product-wise Sales</h2>
          <p className="text-xs text-gray-400 mt-0.5">{productPivot.length} products · revenue comparison</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-3 h-3 rounded-sm bg-primary-500 inline-block" />
          <span className="text-gray-500 dark:text-gray-400">Revenue</span>
        </div>
      </div>

      {productPivot.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          No data for selected filters
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productPivot} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
              <XAxis
                dataKey="product"
                tick={{ fontSize: 9, fill: 'currentColor' }}
                className="text-gray-400"
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'currentColor' }}
                className="text-gray-400"
                axisLine={false}
                tickLine={false}
                tickFormatter={v => v >= 100000 ? `₹${v/100000}L` : `₹${v/1000}K`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)', radius: 4 }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={42} isAnimationActive animationDuration={800}>
                {productPivot.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {productPivot.map((p, i) => (
          <span key={p.product} className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <span className="w-2 h-2 rounded-full" style={{ background: BAR_COLORS[i] }} />
            {p.product}
            <span className="text-gray-300 dark:text-gray-600">₹{(p.revenue/100000).toFixed(1)}L</span>
          </span>
        ))}
      </div>
    </div>
  );
}
