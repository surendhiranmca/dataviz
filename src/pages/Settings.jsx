import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { Sun, Moon, Bell, Palette, Info, RotateCcw, Database, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Settings page — theme, notifications, live data management, and project info.
 * All KPI stats read live from DataContext — update as records are added.
 */
export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { kpis, records, liveMode, setLiveMode, liveCount, resetData } = useData();

  const newCount = records.filter(r => r.isNew).length;

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          App preferences and project information
        </p>
      </div>

      {/* ── Appearance ─────────────────────────────────── */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Palette size={16} className="text-primary-500" />
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
            <p className="text-xs text-gray-400 mt-0.5">Toggle between light and dark interface</p>
          </div>
          <button
            id="settings-theme-toggle"
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
              isDark ? 'bg-primary-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 flex items-center justify-center ${
                isDark ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              {isDark ? <Moon size={10} className="text-primary-600" /> : <Sun size={10} className="text-gray-400" />}
            </span>
          </button>
        </div>
      </div>

      {/* ── Notifications ──────────────────────────────── */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell size={16} className="text-primary-500" />
          Notifications
        </h2>
        {[
          { label: 'Insight alerts',     sub: 'Get notified of business insights',     id: 'notif-insights' },
          { label: 'Data loaded alerts', sub: 'Show confirmation when data refreshes', id: 'notif-data'     },
          { label: 'Live mode toasts',   sub: 'Show toast for each auto-added record', id: 'notif-live'     },
        ].map(n => (
          <div key={n.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{n.label}</p>
              <p className="text-xs text-gray-400">{n.sub}</p>
            </div>
            <input id={n.id} type="checkbox" defaultChecked className="w-4 h-4 accent-primary-600 cursor-pointer" />
          </div>
        ))}
      </div>

      {/* ── Data Management ────────────────────────────── */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Database size={16} className="text-primary-500" />
          Data Management
        </h2>

        {/* Live stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Records',   value: records.length,         color: 'text-primary-600 dark:text-primary-400' },
            { label: 'Added This Sess.', value: newCount,              color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Live Adds',        value: liveCount,             color: 'text-red-500 dark:text-red-400'         },
            { label: 'Total Revenue',    value: `₹${(kpis.totalSales/100000).toFixed(1)}L`, color: 'text-amber-600 dark:text-amber-400' },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-lg font-extrabold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            id="live-toggle-settings"
            onClick={() => {
              setLiveMode(v => !v);
              toast(!liveMode ? '🔴 Live mode ON — records added every 8s' : '⏹ Live mode OFF', { duration: 3000 });
            }}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all ${
              liveMode
                ? 'bg-red-500 text-white shadow-md'
                : 'btn-secondary'
            }`}
          >
            <Zap size={14} className={liveMode ? 'fill-white' : ''} />
            {liveMode ? `Live ON (+${liveCount})` : '⚡ Start Live Mode'}
          </button>

          <button
            id="reset-data-btn"
            onClick={resetData}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw size={14} />
            Reset to 100 Records
          </button>
        </div>
      </div>

      {/* ── Project Information ─────────────────────────── */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Info size={16} className="text-primary-500" />
          Project Information
        </h2>
        <dl className="space-y-0">
          {[
            { label: 'Project Title',    value: 'Sales Data Analysis & Dashboard'             },
            { label: 'Submitted By',     value: 'SHRINITHI SD'                               },
            { label: 'Course',           value: 'Business Analytics'                         },
            { label: 'Project Type',     value: 'Minor Project'                              },
            { label: 'Dataset Size',     value: `${records.length} records (live)`           },
            { label: 'Tools Used',       value: 'React, Tailwind CSS, Recharts'              },
            { label: 'Data Source',      value: 'Google Sheets / Excel Sales Dataset'        },
            { label: 'Total Sales',      value: `₹${kpis.totalSales.toLocaleString('en-IN')}` },
            { label: 'Total Qty Sold',   value: `${kpis.totalQuantity} units`               },
            { label: 'Total Orders',     value: `${kpis.totalOrders}`                       },
            { label: 'Avg Order Value',  value: `₹${kpis.avgOrderValue.toLocaleString('en-IN')}` },
            { label: 'Months Covered',   value: 'January, February, March, April 2024'      },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-4 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <dt className="w-36 text-xs font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0 pt-0.5">{row.label}</dt>
              <dd className="text-xs text-gray-800 dark:text-gray-200 flex-1 font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>

        <button
          id="show-project-info-btn"
          onClick={() => toast.success(
            `${records.length} records · ₹${(kpis.totalSales / 100000).toFixed(2)}L sales · ${kpis.totalOrders} orders — SHRINITHI SD`,
            { icon: '🎓', duration: 5000 }
          )}
          className="btn-primary mt-5 w-full justify-center"
        >
          Show Project Summary Toast
        </button>
      </div>
    </div>
  );
}
