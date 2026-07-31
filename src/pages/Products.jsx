import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Button, EmptyState } from '../components/ui';
import { exportToCSV } from '../utils/helpers';
import { Search, Download, ChevronUp, ChevronDown, Package, Star, TrendingUp, Award, Plus, BarChart2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddRecordForm from '../components/forms/AddRecordForm';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10;

/**
 * Products page — fully dynamic, reads productPivot from DataContext.
 * Quick-stats (Top Revenue, Best Seller, Most Ordered) derived live.
 * Revenue bars + sortable table all respond to global filters & live mode.
 */
export default function Products() {
  const { productPivot, kpis, filteredRecords } = useData();

  const [search,  setSearch]  = useState('');
  const [sortKey, setSortKey] = useState('revenue');
  const [sortDir, setSortDir] = useState('desc');
  const [page,    setPage]    = useState(1);
  const [addOpen, setAddOpen] = useState(false);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let rows = [...productPivot];
    if (search.trim()) rows = rows.filter(r => r.product.toLowerCase().includes(search.toLowerCase()));
    rows.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return rows;
  }, [productPivot, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const maxRev     = productPivot[0]?.revenue || 1;

  // Dynamic quick stats — derived from live productPivot
  const topByRevenue = productPivot[0];
  const topByQty     = [...productPivot].sort((a, b) => b.qty - a.qty)[0];
  const topByOrders  = [...productPivot].sort((a, b) => b.orders - a.orders)[0];

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-gray-300 dark:text-gray-600" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-primary-500" />
      : <ChevronDown size={12} className="text-primary-500" />;
  };

  const cols = [
    { key: 'product', label: 'Product'    },
    { key: 'revenue', label: 'Revenue'    },
    { key: 'qty',     label: 'Units Sold' },
    { key: 'orders',  label: 'Orders'     },
  ];

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package size={22} className="text-primary-500" /> Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {filteredRecords.length} sales records · {productPivot.length} products · live data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setAddOpen(true)}>
            <Plus size={14} /> Add Record
          </Button>
          <Button
            id="export-products-btn"
            onClick={() => {
              exportToCSV(filtered.map(p => ({
                Product:    p.product,
                Revenue:    p.revenue,
                'Qty Sold': p.qty,
                Orders:     p.orders,
                'Avg Price': Math.round(p.revenue / (p.qty || 1)),
                'Revenue %': kpis.totalSales > 0 ? `${((p.revenue / kpis.totalSales) * 100).toFixed(1)}%` : '0%',
              })), 'products');
              toast.success('Products exported to CSV!');
            }}
          >
            <Download size={15} /> Export CSV
          </Button>
        </div>
      </div>

      {/* ── Dynamic quick stats ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Top Revenue Product', icon: Award,      color: 'text-primary-600 dark:text-primary-400',
            value: topByRevenue?.product || '—',
            sub:   topByRevenue ? `₹${(topByRevenue.revenue / 100000).toFixed(2)}L revenue` : 'No data',
          },
          {
            label: 'Best Seller (Qty)', icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400',
            value: topByQty?.product || '—',
            sub:   topByQty ? `${topByQty.qty} units sold` : 'No data',
          },
          {
            label: 'Most Ordered', icon: Star, color: 'text-amber-600 dark:text-amber-400',
            value: topByOrders?.product || '—',
            sub:   topByOrders ? `${topByOrders.orders} orders placed` : 'No data',
          },
        ].map(s => (
          <div key={s.label} className="card card-hover p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <s.icon size={20} className={s.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">{s.value}</p>
              <p className={`text-xs mt-0.5 ${s.color}`}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue bar chart ───────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart2 size={16} className="text-primary-500" /> Revenue by Product
          </h2>
          <p className="text-xs text-gray-400">{productPivot.length} products · sorted by revenue</p>
        </div>

        {productPivot.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No product data for current filters.</p>
        ) : (
          <div className="space-y-3">
            {productPivot.map((p, i) => (
              <div key={p.product}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold w-4 text-gray-400 text-right">{i + 1}</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{p.product}</span>
                    {i === 0 && (
                      <span className="badge bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] py-0">
                        <Star size={8} className="fill-current inline" /> Top
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="hidden sm:inline">{p.orders} orders · {p.qty} units</span>
                    <span className="font-bold text-gray-900 dark:text-white tabular-nums">
                      ₹{(p.revenue / 100000).toFixed(2)}L
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${(p.revenue / maxRev) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Search ─────────────────────────────────────── */}
      <div className="card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="products-search"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9"
          />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="w-10 px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">#</th>
                {cols.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 whitespace-nowrap select-none"
                  >
                    <span className="flex items-center gap-1">{col.label} <SortIcon col={col.key} /></span>
                  </th>
                ))}
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">Avg Price</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={Package} title="No products found" description="Try a different search." />
                  </td>
                </tr>
              ) : paginated.map((p, idx) => {
                const globalRank = productPivot.findIndex(x => x.product === p.product);
                return (
                  <tr key={p.product} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-400 font-medium">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center flex-shrink-0">
                          <Package size={14} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{p.product}</span>
                        {globalRank === 0 && (
                          <span className="badge bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px]">
                            <Star size={9} className="fill-current inline mr-0.5" /> #1
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap tabular-nums">
                      ₹{p.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{p.qty}</td>
                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{p.orders}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap tabular-nums">
                      ₹{Math.round(p.revenue / (p.qty || 1)).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 max-w-24">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                            style={{ width: `${kpis.totalSales > 0 ? (p.revenue / kpis.totalSales) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">
                          {kpis.totalSales > 0 ? ((p.revenue / kpis.totalSales) * 100).toFixed(1) : '0.0'}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-7 text-xs rounded-lg transition-colors ${
                    p === page
                      ? 'bg-primary-600 text-white font-medium'
                      : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="➕ Add New Sales Record">
        <AddRecordForm onClose={() => setAddOpen(false)} />
      </Modal>
    </div>
  );
}
