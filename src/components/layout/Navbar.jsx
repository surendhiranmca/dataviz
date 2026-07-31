import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useRealTimeClock } from '../../hooks';
import { Menu, Sun, Moon, Bell, Zap, ZapOff, RotateCcw, UploadCloud } from 'lucide-react';
import UploadModal from '../forms/UploadModal';
import toast from 'react-hot-toast';

/**
 * Navbar — global filters (month / region), live mode toggle,
 * CSV dataset upload button, real-time clock, dark mode, and notifications.
 */
export default function Navbar({ onMenuClick }) {
  const { isDark, toggleTheme }                   = useTheme();
  const {
    monthFilter, setMonthFilter,
    regionFilter, setRegionFilter,
    months, regions,
    liveMode, setLiveMode,
    liveCount, records,
  } = useData();

  const clock    = useRealTimeClock('time');
  const dateStr  = useRealTimeClock('date');
  const [showNotifs, setShowNotifs] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const newRecords = records.filter(r => r.isNew).length;

  const insights = [
    `Total records: ${records.length} (${newRecords} added this session)`,
    'March is the highest revenue month — ₹28.98L',
    'Laptop leads product-wise at ₹25.6L revenue',
    'All 4 regions performing above ₹14L individually',
    `Live mode: ${liveMode ? 'ON — auto-adding records every 8s' : 'OFF'}`,
  ];

  const hasActiveFilter = monthFilter !== 'all' || regionFilter !== 'all';

  return (
    <>
      <header className="sticky top-0 z-10 glass border-b border-gray-200/60 dark:border-gray-800/60 px-4 lg:px-6 h-16 flex items-center gap-3">
        {/* Hamburger */}
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" aria-label="Open menu" id="menu-toggle">
          <Menu size={22} />
        </button>

        {/* Title */}
        <div className="hidden md:block flex-shrink-0">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">Sales Data Analysis</p>
          <p className="text-[10px] text-gray-400 leading-none">{dateStr}</p>
        </div>

        {/* ── Global Filters ── */}
        <div className="flex items-center gap-2 ml-2 flex-1 flex-wrap">
          {/* Month filter */}
          <div className="relative">
            <select
              id="global-month-filter"
              value={monthFilter}
              onChange={e => { setMonthFilter(e.target.value); toast(`📅 Filtered: ${e.target.value === 'all' ? 'All months' : e.target.value}`, { duration: 1500 }); }}
              className={`text-xs font-medium rounded-xl px-3 py-2 border transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer ${
                monthFilter !== 'all'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary-400'
              }`}
            >
              <option value="all">📅 All Months</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Region filter */}
          <div className="relative">
            <select
              id="global-region-filter"
              value={regionFilter}
              onChange={e => { setRegionFilter(e.target.value); toast(`🗺 Region: ${e.target.value === 'all' ? 'All' : e.target.value}`, { duration: 1500 }); }}
              className={`text-xs font-medium rounded-xl px-3 py-2 border transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer ${
                regionFilter !== 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-400'
              }`}
            >
              <option value="all">🗺 All Regions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Clear filters */}
          {hasActiveFilter && (
            <button
              onClick={() => { setMonthFilter('all'); setRegionFilter('all'); toast('Filters cleared', { icon: '🔄' }); }}
              className="text-xs text-danger-500 dark:text-danger-400 hover:underline flex items-center gap-1 whitespace-nowrap"
              title="Clear all filters"
            >
              <RotateCcw size={12} /> Clear
            </button>
          )}

          {/* Record count badge */}
          <span className="hidden lg:flex items-center gap-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            {records.length} records
          </span>
        </div>

        {/* ── Right side actions ── */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Upload CSV button */}
          <button
            id="upload-csv-btn"
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 transition-all shadow-sm"
            title="Import CSV Dataset"
          >
            <UploadCloud size={14} />
            <span className="hidden sm:inline">Upload CSV</span>
          </button>

          {/* Live clock */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {clock}
          </div>

          {/* Live mode toggle */}
          <button
            id="live-mode-toggle"
            onClick={() => {
              setLiveMode(v => !v);
              toast(!liveMode ? '🔴 Live mode ON — new records every 8s' : '⏹ Live mode OFF', { duration: 3000 });
            }}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${
              liveMode
                ? 'bg-red-500 text-white shadow-md animate-pulse-slow'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
            }`}
            title="Toggle live data simulation"
          >
            {liveMode ? <Zap size={13} className="fill-white" /> : <ZapOff size={13} />}
            <span className="hidden sm:inline">{liveMode ? `Live +${liveCount}` : 'Live'}</span>
          </button>

          {/* Dark mode */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              id="notif-btn"
              onClick={() => setShowNotifs(v => !v)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all relative"
              aria-label="Insights"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-11 w-72 card shadow-xl border border-gray-100 dark:border-gray-800 animate-fade-in z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Insights</h3>
                  <span className="text-[10px] bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 px-2 py-0.5 rounded-full font-medium">
                    {records.length} records
                  </span>
                </div>
                <ul className="py-1">
                  {insights.map((n, i) => (
                    <li key={i}>
                      <button
                        onClick={() => { toast(n, { icon: '💡' }); setShowNotifs(false); }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <p className="text-xs text-gray-700 dark:text-gray-300">{n}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* User badge */}
          <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-xl px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-[10px] font-bold">
              SS
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-none">SHRINITHI SD</p>
              <p className="text-[9px] text-gray-400 leading-none mt-0.5">Business Analytics</p>
            </div>
          </div>
        </div>
      </header>

      {/* File Upload Modal */}
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
