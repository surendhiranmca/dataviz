import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Button, EmptyState } from '../components/ui';
import { exportToCSV } from '../utils/helpers';
import { Download, Users, MapPin, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const REGION_META = {
  North: {
    gradient: 'from-indigo-500 to-indigo-700',
    badge:    'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    bar:      'bg-gradient-to-r from-indigo-500 to-indigo-600',
    dot:      'bg-indigo-500',
  },
  South: {
    gradient: 'from-emerald-500 to-emerald-700',
    badge:    'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    bar:      'bg-gradient-to-r from-emerald-500 to-emerald-600',
    dot:      'bg-emerald-500',
  },
  East: {
    gradient: 'from-amber-500 to-amber-700',
    badge:    'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    bar:      'bg-gradient-to-r from-amber-500 to-amber-600',
    dot:      'bg-amber-500',
  },
  West: {
    gradient: 'from-rose-500 to-rose-700',
    badge:    'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    bar:      'bg-gradient-to-r from-rose-500 to-rose-600',
    dot:      'bg-rose-500',
  },
};

/**
 * Customers page — fully dynamic, reads from DataContext.
 * Aggregates filteredRecords by region (customer segments) and by product.
 * Responds to global filters, live mode, and new records in real time.
 */
export default function Customers() {
  const { filteredRecords, kpis, records } = useData();

  /* ── Region segments ─────────────────────────────── */
  const regionSegments = useMemo(() => {
    const map = {};
    filteredRecords.forEach(r => {
      if (!map[r.region]) {
        map[r.region] = { region: r.region, revenue: 0, orders: 0, qty: 0, products: new Set(), lastDate: '' };
      }
      map[r.region].revenue += r.revenue;
      map[r.region].orders  += 1;
      map[r.region].qty     += r.qty;
      map[r.region].products.add(r.product);
      if (r.date > map[r.region].lastDate) map[r.region].lastDate = r.date;
    });
    return Object.values(map)
      .map(seg => ({ ...seg, products: seg.products.size }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredRecords]);

  /* ── Product × buyer aggregation ──────────────────── */
  const productBuyers = useMemo(() => {
    const map = {};
    filteredRecords.forEach(r => {
      if (!map[r.product]) {
        map[r.product] = { product: r.product, orders: 0, revenue: 0, qty: 0, regions: new Set() };
      }
      map[r.product].orders  += 1;
      map[r.product].revenue += r.revenue;
      map[r.product].qty     += r.qty;
      map[r.product].regions.add(r.region);
    });
    return Object.values(map)
      .map(p => ({ ...p, regions: p.regions.size }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredRecords]);

  const totalRev  = regionSegments.reduce((s, r) => s + r.revenue, 0);
  const newCount  = records.filter(r => r.isNew).length;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={22} className="text-primary-500" /> Customers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {regionSegments.length} active regions · {filteredRecords.length} orders · live data
            {newCount > 0 && <span className="ml-2 text-emerald-500 font-medium">· +{newCount} new</span>}
          </p>
        </div>
        <Button
          id="export-customers-btn"
          onClick={() => {
            exportToCSV(regionSegments.map(s => ({
              Region:  s.region,
              Revenue: s.revenue,
              Orders:  s.orders,
              Qty:     s.qty,
              Products: s.products,
              'Last Order': s.lastDate,
            })), 'customer_segments');
            toast.success('Customer segments exported!');
          }}
        >
          <Download size={15} /> Export CSV
        </Button>
      </div>

      {/* ── KPI strip ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue',     value: `₹${(kpis.totalSales / 100000).toFixed(2)}L`,     color: 'text-primary-600 dark:text-primary-400' },
          { label: 'Active Regions',    value: regionSegments.length,                             color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Total Orders',      value: kpis.totalOrders,                                  color: 'text-amber-600 dark:text-amber-400'     },
          { label: 'Avg. Order Value',  value: `₹${kpis.avgOrderValue.toLocaleString('en-IN')}`, color: 'text-rose-600 dark:text-rose-400'        },
        ].map(s => (
          <div key={s.label} className="card p-3.5 text-center">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-extrabold mt-1 tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Region segment cards ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {regionSegments.map(seg => {
          const meta  = REGION_META[seg.region] || REGION_META.North;
          const share = totalRev > 0 ? ((seg.revenue / totalRev) * 100).toFixed(1) : '0.0';
          return (
            <div key={seg.region} className="card card-hover p-5 relative overflow-hidden group">
              {/* Accent bar */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${meta.gradient}`} />

              <div className="pl-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <MapPin size={20} className="text-white" />
                  </div>
                  <span className={`badge ${meta.badge} text-[10px] font-bold`}>{share}% share</span>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{seg.region}</h3>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 tabular-nums">
                  ₹{(seg.revenue / 100000).toFixed(2)}L
                </p>

                {/* Stats */}
                <div className="mt-4 space-y-2 text-xs">
                  {[
                    { label: 'Orders',     value: seg.orders   },
                    { label: 'Qty Sold',   value: seg.qty      },
                    { label: 'Products',   value: seg.products },
                    { label: 'Last Order', value: seg.lastDate },
                  ].map(stat => (
                    <div key={stat.label} className="flex justify-between items-center">
                      <span className="text-gray-400">{stat.label}</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Revenue share bar */}
                <div className="mt-3 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full ${meta.bar} transition-all duration-700`}
                    style={{ width: `${share}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {regionSegments.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              icon={Users}
              title="No customer data"
              description="No records match the current filters."
            />
          </div>
        )}
      </div>

      {/* ── Product purchase summary table ──────────────── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package size={16} className="text-primary-500" /> Product Purchase Summary
          </h2>
          <p className="text-xs text-gray-400">{productBuyers.length} products · sorted by revenue</p>
        </div>

        {productBuyers.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No data for selected filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  {['#', 'Product', 'Orders', 'Revenue', 'Qty Sold', 'Regions', 'Revenue Share'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {productBuyers.map((p, i) => (
                  <tr key={p.product} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{p.product}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.orders}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      ₹{p.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.qty}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.regions}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 max-w-20">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all duration-700"
                            style={{ width: `${kpis.totalSales > 0 ? (p.revenue / kpis.totalSales) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">
                          {kpis.totalSales > 0 ? ((p.revenue / kpis.totalSales) * 100).toFixed(1) : '0.0'}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
