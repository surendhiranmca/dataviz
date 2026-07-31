import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../../context/DataContext';

const PRODUCT_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#14b8a6',
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="card px-3 py-2 shadow-xl text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.payload.color }} />
        <span className="font-medium text-gray-800 dark:text-gray-200">{d.name}</span>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mt-0.5 ml-4">
        ₹{(d.payload.revenue / 100000).toFixed(2)}L · {d.value.toFixed(1)}% share
      </p>
    </div>
  );
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/**
 * CategoryChart — Donut pie chart showing live revenue share per product.
 * Reads productPivot from DataContext — responds to global filters & live mode.
 */
export default function CategoryChart() {
  const { productPivot, kpis } = useData();

  const chartData = productPivot.map((p, i) => ({
    name:    p.product,
    value:   kpis.totalSales > 0 ? (p.revenue / kpis.totalSales) * 100 : 0,
    revenue: p.revenue,
    color:   PRODUCT_COLORS[i % PRODUCT_COLORS.length],
  }));

  if (chartData.length === 0) {
    return (
      <div className="card p-5 animate-fade-in flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">No product data for current filters.</p>
      </div>
    );
  }

  return (
    <div className="card p-5 animate-fade-in">
      <div className="mb-5">
        <h2 className="font-semibold text-gray-900 dark:text-white">Revenue by Product</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Live distribution · {productPivot.length} products · updates with filters
        </p>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              isAnimationActive
              animationDuration={800}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <ul className="mt-3 space-y-1.5">
        {chartData.map(cat => (
          <li key={cat.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
              <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${cat.value}%`, background: cat.color }} />
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300 w-10 text-right">
                {cat.value.toFixed(1)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
