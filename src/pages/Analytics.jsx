import { useData } from '../context/DataContext';
import MonthlySalesChart from '../components/charts/MonthlySalesChart';
import ProductSalesChart from '../components/charts/ProductSalesChart';
import { BarChart2, TrendingUp, Package, MapPin, Award } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const REGION_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444'];

/**
 * Analytics page — all data from DataContext (responds to global filters & live mode).
 */
export default function Analytics() {
  const { kpis, monthlyPivot, productPivot, regionBreakdown, filteredRecords } = useData();

  const bestMonth   = [...monthlyPivot].sort((a,b) => b.revenue - a.revenue)[0];
  const bestProduct = productPivot[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart2 size={22} className="text-primary-500" /> Analytics & Pivot Tables
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {filteredRecords.length} records · live data · updates with global filters
        </p>
      </div>

      {/* ── Monthly Pivot Table ────────────────────────── */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary-500" /> Monthly Sales Pivot Table
        </h2>
        {monthlyPivot.length === 0 ? (
          <p className="text-gray-400 text-sm py-6 text-center">No data for the selected filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-50 dark:bg-primary-900/20">
                <tr>
                  {['Month','Total Revenue','Qty Sold','Orders','Avg / Order','% of Total'].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {monthlyPivot.map(m => (
                  <tr key={m.month} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{m.month}</td>
                    <td className="px-4 py-3 font-bold text-primary-600 dark:text-primary-400">₹{m.revenue.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{m.qty}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{m.orders}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{Math.round(m.revenue/m.orders).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 max-w-24">
                          <div className="h-full rounded-full bg-primary-500 transition-all duration-700"
                            style={{ width: `${kpis.totalSales > 0 ? (m.revenue/kpis.totalSales)*100 : 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{kpis.totalSales > 0 ? ((m.revenue/kpis.totalSales)*100).toFixed(1) : 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-primary-600 text-white">
                <tr>
                  <td className="px-4 py-3 font-bold">Grand Total</td>
                  <td className="px-4 py-3 font-bold">₹{kpis.totalSales.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-bold">{kpis.totalQuantity}</td>
                  <td className="px-4 py-3 font-bold">{kpis.totalOrders}</td>
                  <td className="px-4 py-3 font-bold">₹{kpis.avgOrderValue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-bold">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <MonthlySalesChart />

      {/* ── Product Pivot Table ───────────────────────── */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Package size={16} className="text-primary-500" /> Product-wise Sales Pivot Table
        </h2>
        {productPivot.length === 0 ? (
          <p className="text-gray-400 text-sm py-6 text-center">No product data for selected filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 dark:bg-emerald-900/20">
                <tr>
                  {['Product','Revenue','Qty Sold','Orders','Avg Price','Revenue Share'].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {productPivot.map((p, i) => (
                  <tr key={p.product} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-[10px] font-bold flex items-center justify-center">{i+1}</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{p.product}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">₹{p.revenue.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.qty}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.orders}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{Math.round(p.revenue/p.qty).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 max-w-24">
                          <div className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                            style={{ width: `${kpis.totalSales > 0 ? (p.revenue/kpis.totalSales)*100 : 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{kpis.totalSales > 0 ? ((p.revenue/kpis.totalSales)*100).toFixed(1) : 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-emerald-600 text-white">
                <tr>
                  <td className="px-4 py-3 font-bold">Grand Total</td>
                  <td className="px-4 py-3 font-bold">₹{kpis.totalSales.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-bold">{kpis.totalQuantity}</td>
                  <td className="px-4 py-3 font-bold">{kpis.totalOrders}</td>
                  <td className="px-4 py-3 font-bold">—</td>
                  <td className="px-4 py-3 font-bold">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <ProductSalesChart />

      {/* ── Region breakdown + Insights ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-primary-500" /> Region-wise Revenue
          </h2>
          {regionBreakdown.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No region data</p>
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={regionBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="revenue" paddingAngle={3}
                    label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {regionBreakdown.map((_, i) => <Cell key={i} fill={REGION_COLORS[i%4]} />)}
                  </Pie>
                  <Tooltip formatter={v => [`₹${(v/100000).toFixed(2)}L`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award size={16} className="text-primary-500" /> Business Insights
          </h2>
          <ul className="space-y-3">
            {[
              { icon: '📈', text: bestMonth ? `Best month: ${bestMonth.month} with ₹${(bestMonth.revenue/100000).toFixed(2)}L (${kpis.totalSales > 0 ? ((bestMonth.revenue/kpis.totalSales)*100).toFixed(1) : 0}% of total).` : 'No monthly data available.' },
              { icon: '🏆', text: bestProduct ? `Top product: ${bestProduct.product} with ₹${(bestProduct.revenue/100000).toFixed(2)}L across ${bestProduct.orders} orders.` : 'No product data.' },
              { icon: '🎯', text: `Avg. order value ₹${kpis.avgOrderValue.toLocaleString('en-IN')} across ${kpis.totalOrders} transactions.` },
              { icon: '📦', text: `Total quantity sold: ${kpis.totalQuantity} units across all products and regions.` },
              { icon: '💡', text: 'Monthly trends help identify high and low-performing months for better planning.' },
            ].map((ins, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-lg leading-none flex-shrink-0">{ins.icon}</span>
                <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{ins.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
