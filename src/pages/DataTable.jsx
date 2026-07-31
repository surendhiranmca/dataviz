import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Button, Select, EmptyState } from '../components/ui';
import { exportToCSV } from '../utils/helpers';
import { Search, Download, ChevronUp, ChevronDown, Database, Plus, UploadCloud } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddRecordForm from '../components/forms/AddRecordForm';
import UploadModal from '../components/forms/UploadModal';
import toast from 'react-hot-toast';
import { useDebounce } from '../hooks';

const PAGE_SIZE = 15;

/**
 * DataTable page — reads from DataContext (fully dynamic).
 * Supports search, filtering by dynamic products/regions, CSV exports,
 * and direct CSV file uploads to update all dashboard visualizations.
 */
export default function DataTable() {
  const { filteredRecords, records, products, regions } = useData();

  const [search,     setSearch]     = useState('');
  const [product,    setProduct]    = useState('all');
  const [region,     setRegion]     = useState('all');
  const [sortKey,    setSortKey]    = useState('id');
  const [sortDir,    setSortDir]    = useState('asc');
  const [page,       setPage]       = useState(1);
  const [addOpen,    setAddOpen]    = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const productOptions = useMemo(() => [
    { value: 'all', label: 'All Products' },
    ...products.map(p => ({ value: p, label: p })),
  ], [products]);

  const regionOptions = useMemo(() => [
    { value: 'all', label: 'All Regions' },
    ...regions.map(r => ({ value: r, label: r })),
  ], [regions]);

  const debouncedSearch = useDebounce(search, 200);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const local = useMemo(() => {
    let rows = [...filteredRecords];
    if (product !== 'all') rows = rows.filter(r => r.product === product);
    if (region  !== 'all') rows = rows.filter(r => r.region  === region);
    if (debouncedSearch.trim()) rows = rows.filter(r =>
      r.product.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      r.region.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    rows.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return rows;
  }, [filteredRecords, product, region, debouncedSearch, sortKey, sortDir]);

  const totalPages = Math.ceil(local.length / PAGE_SIZE);
  const paginated  = local.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalRev   = local.reduce((s, r) => s + r.revenue, 0);
  const totalQty   = local.reduce((s, r) => s + r.qty, 0);
  const newCount   = records.filter(r => r.isNew).length;

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={11} className="text-gray-300 dark:text-gray-600" />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="text-primary-500" />
      : <ChevronDown size={11} className="text-primary-500" />;
  };

  const cols = [
    { key: 'id',        label: '#'          },
    { key: 'date',      label: 'Date'       },
    { key: 'product',   label: 'Product'    },
    { key: 'month',     label: 'Month'      },
    { key: 'region',    label: 'Region'     },
    { key: 'qty',       label: 'Qty Sold'   },
    { key: 'unitPrice', label: 'Unit Price' },
    { key: 'revenue',   label: 'Revenue'    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database size={22} className="text-primary-500" /> Raw Sales Data
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {local.length} records · ₹{(totalRev/100000).toFixed(2)}L · {totalQty} units
            {newCount > 0 && <span className="ml-2 text-emerald-500 font-medium">· +{newCount} new</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setUploadOpen(true)}>
            <UploadCloud size={14} /> Upload CSV
          </Button>
          <Button variant="secondary" onClick={() => setAddOpen(true)}>
            <Plus size={14} /> Add Record
          </Button>
          <Button onClick={() => { exportToCSV(local, 'sales_data'); toast.success('Exported!'); }}>
            <Download size={14} /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="data-search"
            type="text"
            placeholder="Search product or region…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input pl-8 text-xs"
          />
        </div>
        <Select id="filter-product" value={product} onChange={v => { setProduct(v); setPage(1); }} options={productOptions} className="w-40" />
        <Select id="filter-region"  value={region}  onChange={v => { setRegion(v);  setPage(1); }} options={regionOptions}  className="w-40" />
        {(product !== 'all' || region !== 'all' || search) && (
          <button
            onClick={() => { setProduct('all'); setRegion('all'); setSearch(''); setPage(1); }}
            className="text-xs text-red-500 hover:underline px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                {cols.map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)}
                    className="text-left font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 whitespace-nowrap select-none">
                    <span className="flex items-center gap-1">{col.label} <SortIcon col={col.key} /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginated.length === 0 ? (
                <tr><td colSpan={8}><EmptyState icon={Database} title="No records found" description="Adjust your filters or upload a CSV file." /></td></tr>
              ) : paginated.map(r => (
                <tr key={r.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${
                    r.isNew ? 'bg-emerald-50/60 dark:bg-emerald-900/10' : ''
                  }`}>
                  <td className="px-4 py-3 text-gray-400 font-medium">
                    {r.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle animate-pulse" />}
                    {r.id}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{r.product}</td>
                  <td className="px-4 py-3"><span className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">{r.month}</span></td>
                  <td className="px-4 py-3">
                    <span className={`badge ${
                      r.region==='North'?'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300':
                      r.region==='South'?'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300':
                      r.region==='East' ?'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300':
                      r.region==='West' ?'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300':
                                         'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    }`}>{r.region}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.qty}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">₹{r.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white whitespace-nowrap">₹{r.revenue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
            {local.length > 0 && (
              <tfoot className="bg-primary-50 dark:bg-primary-900/20 border-t-2 border-primary-200 dark:border-primary-800">
                <tr>
                  <td colSpan={5} className="px-4 py-3 font-bold text-primary-700 dark:text-primary-300 text-xs uppercase">Grand Total ({local.length} records)</td>
                  <td className="px-4 py-3 font-bold text-primary-700 dark:text-primary-300">{totalQty}</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 font-bold text-primary-700 dark:text-primary-300 whitespace-nowrap">₹{totalRev.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">Page {page} of {totalPages} · {local.length} records</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800">Prev</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setPage(p)}
                  className={`w-7 h-7 text-xs rounded-lg transition-colors ${p===page?'bg-primary-600 text-white':'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800">Next</button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="➕ Add New Sales Record">
        <AddRecordForm onClose={() => setAddOpen(false)} />
      </Modal>

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
