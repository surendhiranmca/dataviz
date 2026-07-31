import { useState } from 'react';
import {
  ResponsiveContainer, LineChart, AreaChart, BarChart,
  Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import { useData } from '../../context/DataContext';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="card px-4 py-3 shadow-xl text-xs min-w-[160px]">
      <p className="font-bold text-gray-800 dark:text-gray-100 mb-2 pb-1 border-b border-gray-100 dark:border-gray-800">{label}</p>
      <p className="text-primary-600 dark:text-primary-400">
        Revenue: <b className="text-gray-900 dark:text-white">₹{(payload[0]?.value / 100000).toFixed(2)}L</b>
      </p>
      {d && <>
        <p className="text-gray-400 mt-1">Orders: <b className="text-gray-700 dark:text-gray-300">{d.orders}</b></p>
        <p className="text-gray-400">Qty Sold: <b className="text-gray-700 dark:text-gray-300">{d.qty}</b></p>
      </>}
    </div>
  );
};

const CHART_TYPES = [
  { key: 'line', label: 'Line',  Icon: TrendingUp },
  { key: 'area', label: 'Area',  Icon: Activity   },
  { key: 'bar',  label: 'Bar',   Icon: BarChart2  },
];

/**
 * MonthlySalesChart — dynamic chart with type switcher (Line / Area / Bar).
 * Reads live data from DataContext — updates instantly on filter or data add.
 */
export default function MonthlySalesChart() {
  const { monthlyPivot, kpis } = useData();
  const [chartType, setChartType] = useState('area');

  const avg = monthlyPivot.length
    ? monthlyPivot.reduce((s, d) => s + d.revenue, 0) / monthlyPivot.length
    : 0;

  const commonAxisProps = {
    tick: { fontSize: 11, fill: 'currentColor' },
    className: 'text-gray-400',
    axisLine: false,
    tickLine: false,
  };

  const commonGrid = (
    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
  );

  const renderChart = () => {
    const sharedProps = {
      data: monthlyPivot,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };
    const tooltip = <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)', radius: 4 }} />;
    const xAxis = <XAxis dataKey="month" {...commonAxisProps} />;
    const yAxis = <YAxis {...commonAxisProps} tickFormatter={v => `₹${v / 100000}L`} />;
    const ref   = avg > 0 ? (
      <ReferenceLine y={avg} stroke="#6366f1" strokeDasharray="5 3" strokeOpacity={0.5}
        label={{ value: 'Avg', position: 'right', fill: '#6366f1', fontSize: 10 }} />
    ) : null;

    if (chartType === 'line') {
      return (
        <LineChart {...sharedProps}>
          <defs>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {commonGrid}{xAxis}{yAxis}{tooltip}{ref}
          <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3}
            dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive animationDuration={800} />
        </LineChart>
      );
    }

    if (chartType === 'area') {
      return (
        <AreaChart {...sharedProps}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
            </linearGradient>
          </defs>
          {commonGrid}{xAxis}{yAxis}{tooltip}{ref}
          <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5}
            fill="url(#areaGrad)"
            dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#4f46e5' }}
            isAnimationActive animationDuration={800} />
        </AreaChart>
      );
    }

    return (
      <BarChart {...sharedProps} barCategoryGap="30%">
        {commonGrid}{xAxis}{yAxis}{tooltip}
        <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={60}
          isAnimationActive animationDuration={800} />
      </BarChart>
    );
  };

  return (
    <div className="card p-5 animate-fade-in h-full">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white">Monthly Sales Trend</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {monthlyPivot.length} months · Total ₹{(kpis.totalSales / 100000).toFixed(2)}L
          </p>
        </div>
        {/* Chart type toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
          {CHART_TYPES.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setChartType(key)}
              title={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                chartType === key
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Icon size={13} />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Month summary strip */}
      {monthlyPivot.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {monthlyPivot.map(d => (
            <div key={d.month} className="text-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
              <p className="text-[10px] text-gray-400 truncate">{d.month}</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">₹{(d.revenue / 100000).toFixed(1)}L</p>
              <p className="text-[10px] text-gray-400">{d.orders} orders</p>
            </div>
          ))}
        </div>
      )}

      {monthlyPivot.length === 0 && (
        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
          No data for selected filters
        </div>
      )}
    </div>
  );
}
