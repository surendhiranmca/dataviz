import { TrendingUp, TrendingDown, ShoppingCart, Package, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAnimatedCounter } from '../../hooks';

const colorMap = {
  indigo: { bg: 'from-primary-500 to-primary-700',  stroke: '#6366f1', ring: 'ring-primary-200 dark:ring-primary-800'  },
  emerald:{ bg: 'from-emerald-400 to-emerald-600',  stroke: '#10b981', ring: 'ring-emerald-200 dark:ring-emerald-800'  },
  amber:  { bg: 'from-amber-400 to-amber-600',      stroke: '#f59e0b', ring: 'ring-amber-200 dark:ring-amber-800'      },
  rose:   { bg: 'from-rose-400 to-rose-600',        stroke: '#f43f5e', ring: 'ring-rose-200 dark:ring-rose-800'        },
};

const IconMap = { trending: TrendingUp, cart: ShoppingCart, package: Package, chart: BarChart2 };

function formatDisplay(value, prefix) {
  if (prefix === '₹') {
    if (value >= 10000000) return { main: `₹${(value / 10000000).toFixed(2)}`, unit: 'Cr' };
    if (value >= 100000)   return { main: `₹${(value / 100000).toFixed(2)}`,   unit: 'L'  };
    if (value >= 1000)     return { main: `₹${(value / 1000).toFixed(1)}`,     unit: 'K'  };
    return { main: `₹${value.toLocaleString('en-IN')}`, unit: '' };
  }
  if (value >= 1000000) return { main: `${(value / 1000000).toFixed(1)}`, unit: 'M' };
  if (value >= 1000)    return { main: `${(value / 1000).toFixed(1)}`,    unit: 'K' };
  return { main: value.toLocaleString('en-IN'), unit: '' };
}

/**
 * KPICard — dynamic metric card with animated counter, sparkline,
 * trend indicator, and live-pulse ring when value changes.
 */
export default function KPICard({ data }) {
  const { title, value, change, prefix = '', color = 'indigo', sparkline = [], icon = 'trending' } = data;
  const colors  = colorMap[color] || colorMap.indigo;
  const isUp    = change >= 0;
  const Icon    = IconMap[icon] || TrendingUp;
  const sparkArr= sparkline.map((v, i) => ({ i, v }));

  // Animate the raw number
  const animated = useAnimatedCounter(value, 1400);
  const { main, unit } = formatDisplay(animated, prefix);

  return (
    <div className={`card card-hover p-5 flex flex-col gap-3 animate-fade-in relative overflow-hidden group`}>
      {/* Subtle background gradient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${colors.stroke}15, transparent 70%)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            {title}
          </p>
          <div className="flex items-end gap-1 mt-1.5">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none tabular-nums">
              {main}
            </span>
            {unit && (
              <span className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-0.5">{unit}</span>
            )}
          </div>
        </div>
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-md flex-shrink-0 ml-3 transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={20} className="text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Sparkline */}
      {sparkArr.length > 0 && (
        <div className="h-10 -mx-1 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkArr} margin={{ top: 1, right: 1, left: 1, bottom: 1 }}>
              <defs>
                <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={colors.stroke} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={colors.stroke} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={colors.stroke}
                strokeWidth={2.5}
                fill={`url(#sg-${color})`}
                dot={false}
                isAnimationActive
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Trend badge */}
      <div className="flex items-center justify-between relative z-10">
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
          isUp
            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
            : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
        }`}>
          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change)}%
        </span>
        <span className="text-[10px] text-gray-400">vs prev period</span>
      </div>
    </div>
  );
}
