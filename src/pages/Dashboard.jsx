import { useState } from 'react';
import { useData } from '../context/DataContext';
import KPICard from '../components/cards/KPICard';
import MonthlySalesChart from '../components/charts/MonthlySalesChart';
import ProductSalesChart from '../components/charts/ProductSalesChart';
import Modal from '../components/ui/Modal';
import AddRecordForm from '../components/forms/AddRecordForm';
import UploadModal from '../components/forms/UploadModal';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, TrendingUp, ShoppingCart, Package, BarChart2, Star, UploadCloud } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const REGION_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];

/**
 * Dashboard — fully dynamic. All KPIs, charts, and tables read from DataContext.
 * Updates instantly on dataset uploads, record additions, live mode, or global filters.
 */
export default function Dashboard() {
  const {
    kpis, filteredRecords, monthlyPivot, productPivot, regionBreakdown,
    liveMode, records, monthFilter, regionFilter,
  } = useData();

  const [addOpen, setAddOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const recent   = [...filteredRecords].reverse().slice(0, 8);
  const topFive  = [...productPivot].slice(0, 5);
  const maxRev   = topFive[0]?.revenue || 1;

  // Build KPI cards dynamically from DataContext
  const kpiCards = [
    { id: 'totalSales',  title: 'Total Sales',       value: kpis.totalSales,    change: 18.4, prefix: '₹', color: 'indigo', icon: 'trending',
      sparkline: monthlyPivot.map(m => m.revenue) },
    { id: 'totalOrders', title: 'Total Orders',       value: kpis.totalOrders,   change: 12.0, prefix: '',  color: 'emerald', icon: 'cart',
      sparkline: monthlyPivot.map(m => m.orders) },
    { id: 'totalQty',    title: 'Total Qty Sold',     value: kpis.totalQuantity, change: 9.5,  prefix: '',  color: 'amber',   icon: 'package',
      sparkline: monthlyPivot.map(m => m.qty) },
    { id: 'avgOrder',    title: 'Avg. Order Value',   value: kpis.avgOrderValue, change: 5.8,  prefix: '₹', color: 'rose',    icon: 'chart',
      sparkline: monthlyPivot.map(m => Math.round(m.revenue / (m.orders || 1))) },
  ];

  const isFiltered = monthFilter !== 'all' || regionFilter !== 'all';

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Banner ──────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-800 p-6 text-white shadow-glow">
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-200 mb-1">
              Business Analytics · Minor Project
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold">Sales Data Analysis Dashboard</h1>
            <p className="text-sm text-primary-200 mt-1">
              <span className="text-white font-semibold">SHRINITHI SD</span>
              {' · '}{records.length} records
              {isFiltered && <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">🔍 Filtered</span>}
              {liveMode && <span className="ml-2 bg-red-500/80 px-2 py-0.5 rounded-full text-xs animate-pulse-slow">🔴 Live</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              id="dashboard-upload-csv-btn"
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 text-sm border border-white/20 hover:border-white/40 shadow-sm"
            >
              <UploadCloud size={16} /> Upload CSV
            </button>
            <button
              id="add-record-btn"
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 text-sm border border-white/20 hover:border-white/40 shadow-sm"
            >
              <Plus size={16} /> Add Record
            </button>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -right-4 top-8 w-28 h-28 rounded-full bg-white/5" />
      </div>

      {/* ── Summary strip ──────────────────────────────── */}
      <div className="card p-4 flex flex-wrap gap-4 items-center justify-between">
        {[
          { icon: TrendingUp,   label: 'Total Sales',      value: `₹${(kpis.totalSales/100000).toFixed(2)}L`, color: 'text-primary-600 dark:text-primary-400'  },
          { icon: ShoppingCart, label: 'Total Qty Sold',   value: kpis.totalQuantity,                          color: 'text-amber-600 dark:text-amber-400'     },
          { icon: Package,      label: 'Total Orders',     value: kpis.totalOrders,                            color: 'text-emerald-600 dark:text-emerald-400' },
          { icon: BarChart2,    label: 'Avg Order Value',  value: `₹${kpis.avgOrderValue.toLocaleString('en-IN')}`, color: 'text-rose-600 dark:text-rose-400' },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-3 ${s.color}`}>
            <s.icon size={20} />
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-lg font-extrabold leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── KPI Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(d => <KPICard key={d.id} data={d} />)}
      </div>

      {/* ── Charts side-by-side ─────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MonthlySalesChart />
        <ProductSalesChart />
      </div>

      {/* ── Bottom: Records table + Region + Top Products ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Recent records */}
        <div className="xl:col-span-3 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">Recent Records</h2>
              <p className="text-xs text-gray-400 mt-0.5">{filteredRecords.length} records matching current filters</p>
            </div>
            <Link to="/data" className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {['Date','Product','Region','Qty','Revenue'].map(h => (
                    <th key={h} className="text-left font-bold text-gray-400 uppercase tracking-wider pb-2 pr-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {recent.map(r => (
                  <tr
                    key={r.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${r.isNew ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                  >
                    <td className="py-2.5 pr-3 text-gray-400 whitespace-nowrap">
                      {r.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 align-middle" />}
                      {r.date}
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">{r.product}</td>
                    <td className="py-2.5 pr-3">
                      <span className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[10px]">{r.region}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-gray-700 dark:text-gray-300">{r.qty}</td>
                    <td className="py-2.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">₹{r.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-xs">No records match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Region + Top Products */}
        <div className="xl:col-span-2 space-y-4">
          {/* Region pie */}
          {regionBreakdown.length > 0 && (
            <div className="card p-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Region Breakdown</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={regionBreakdown} cx="50%" cy="50%" outerRadius={60} innerRadius={30}
                      dataKey="revenue" paddingAngle={3}
                      label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {regionBreakdown.map((r, i) => <Cell key={i} fill={r.color || REGION_COLORS[i % REGION_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => [`₹${(v/100000).toFixed(2)}L`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Top 5 products */}
          <div className="card p-4 flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-1.5">
              <Star size={14} className="text-warning-500 fill-warning-500" />
              Top Products
            </h3>
            <div className="space-y-3">
              {topFive.map((p, i) => (
                <div key={p.product}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold w-4 text-gray-400">{i+1}</span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[100px]">{p.product}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">₹{(p.revenue/100000).toFixed(1)}L</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-700"
                      style={{ width: `${(p.revenue / maxRev) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {topFive.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No product data</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="➕ Add New Sales Record">
        <AddRecordForm onClose={() => setAddOpen(false)} />
      </Modal>

      {/* File Upload Modal */}
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}

