import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Button, Select, EmptyState } from '../components/ui';
import { exportToCSV } from '../utils/helpers';
import { Search, Download, ChevronUp, ChevronDown, ShoppingCart, Plus, TrendingUp } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddRecordForm from '../components/forms/AddRecordForm';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'all',       label: 'All Status'  },
  { value: 'New',       label: '🟢 New'       },
  { value: 'Completed', label: 'Completed'    },
];

const REGION_COLOR = {
  North: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  South: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  East:  'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  West:  'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
};

const PAGE_SIZE = 10;

/**
 * Orders page — fully dynamic, reads from DataContext.
 * Each salesRecord is an "order". Responds to global filters & live mode.
 */
export default function Orders() {
  const { filteredRecords, kpis, records } = useData();

  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('all');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('desc');
  const [page,    setPage]    = useState(1);
  const [addOpen, setAddOpen] = useState(false);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let rows = [...filteredRecords];
    if (status === 'New')       rows = rows.filter(r => r.isNew);
    if (status === 'Completed') rows = rows.filter(r => !r.isNew);
    if (search.trim()) rows = rows.filter(r =>
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.region.toLowerCase().includes(search.toLowerCase())  ||
      r.month.toLowerCase().includes(search.toLowerCase())   ||
      String(r.id).includes(search)
    );
    rows.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return rows;
  }, [filteredRecords, status, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalRev   = filtered.reduce((s, r) => s + r.revenue, 0);
  const newCount   = records.filter(r => r.isNew).length;

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-gray-300 dark:text-gray-600" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-primary-500" />
      : <ChevronDown size={12} className="text-primary-500" />;
  };

  const handleExport = () => {
    exportToCSV(filtered.map(r => ({
      'Order #':    `#${String(r.id).padStart(3, '0')}`,
      Date:          r.date,
      Product:       r.product,
      Region:        r.region,
      Month:         r.month,
      Qty:           r.qty,
      'Unit Price':  r.unitPrice,
      Revenue:       r.revenue,
      Status:        r.isNew ? 'New' : 'Completed',
    })), 'orders');
    toast.success(`${filtered.length} orders exported to CSV!`);
  };

  const cols = [
    { key: 'id',        label: 'Order #'    },
    { key: 'date',      label: 'Date'       },
    { key: 'product',   label: 'Product'    },
    { key: 'region',    label: 'Region'     },
    { key: 'month',     label: 'Month'      },
    { key: 'qty',       label: 'Qty'        },
    { key: 'unitPrice', label: 'Unit Price' },
    { key: 'revenue',   label: 'Revenue'    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart size={22} className="text-primary-500" /> Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {filtered.length} orders · ₹{(totalRev / 100000).toFixed(2)}L
            {newCount > 0 && (
              <span className="ml-2 text-emerald-500 font-medium">· +{newCount} new this session</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" id="add-order-btn" onClick={() => setAddOpen(true)}>
            <Plus size={14} /> Add Record
          </Button>
          <Button id="export-orders-btn" onClick={handleExport}>
            <Download size={15} /> Export CSV
          </Button>
        </div>
      </div>

      {/* ── Live KPI strip ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue',  value: `₹${(kpis.totalSales / 100000).toFixed(2)}L`,         color: 'text-primary-600 dark:text-primary-400'  },
          { label: 'Total Orders',   value: kpis.totalOrders,                                       color: 'text-emerald-600 dark:text-emerald-400'  },
          { label: 'Total Qty Sold', value: kpis.totalQuantity,                                     color: 'text-amber-600 dark:text-amber-400'      },
          { label: 'Avg Order Val.', value: `₹${kpis.avgOrderValue.toLocaleString('en-IN')}`,      color: 'text-rose-600 dark:text-rose-400'         },
        ].map(s => (
          <div key={s.label} className="card p-3.5 text-center">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-extrabold mt-1 tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="orders-search"
            type="text"
            placeholder="Search by product, region, month or order #…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9"
          />
        </div>
        <Select
          id="orders-status-filter"
          value={status}
          onChange={v => { setStatus(v); setPage(1); }}
          options={STATUS_OPTIONS}
          className="sm:w-44"
        />
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {cols.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 whitespace-nowrap select-none"
                  >
                    <span className="flex items-center gap-1">{col.label} <SortIcon col={col.key} /></span>
                  </th>
                ))}
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState icon={ShoppingCart} title="No orders found" description="Try adjusting your search or filter." />
                  </td>
                </tr>
              ) : paginated.map(r => (
                <tr
                  key={r.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${
                    r.isNew ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''
                  }`}
                >
                  <td className="px-5 py-4 text-primary-600 dark:text-primary-400 font-mono font-semibold whitespace-nowrap">
                    {r.isNew && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle animate-pulse" />
                    )}
                    #{String(r.id).padStart(3, '0')}
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">{r.date}</td>
                  <td className="px-5 py-4 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{r.product}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${REGION_COLOR[r.region] || ''}`}>{r.region}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[10px]">
                      {r.month}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-700 dark:text-gray-300 font-medium">{r.qty}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    ₹{r.unitPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    ₹{r.revenue.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge text-[10px] ${
                      r.isNew
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {r.isNew ? 'New' : 'Completed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Grand total footer */}
            {filtered.length > 0 && (
              <tfoot className="bg-primary-50 dark:bg-primary-900/20 border-t-2 border-primary-200 dark:border-primary-800">
                <tr>
                  <td colSpan={7} className="px-5 py-3 font-bold text-primary-700 dark:text-primary-300 text-xs uppercase">
                    <TrendingUp size={12} className="inline mr-1" />
                    Grand Total ({filtered.length} orders)
                  </td>
                  <td className="px-5 py-3 font-bold text-primary-700 dark:text-primary-300 whitespace-nowrap">
                    ₹{totalRev.toLocaleString('en-IN')}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* ── Pagination ─────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
