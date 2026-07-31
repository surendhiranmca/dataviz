import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BarChart2, Database,
  Settings, X, TrendingUp, ShoppingCart, Users, Package,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const mainNavItems = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/analytics', icon: BarChart2,       label: 'Analytics'  },
  { to: '/data',      icon: Database,        label: 'Raw Data'   },
];

const dataNavItems = [
  { to: '/orders',    icon: ShoppingCart,    label: 'Orders'     },
  { to: '/customers', icon: Users,           label: 'Customers'  },
  { to: '/products',  icon: Package,         label: 'Products'   },
];

/**
 * Sidebar — Main navigation for all dynamic pages.
 */
export default function Sidebar({ open, onClose }) {
  const { records } = useData();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 flex flex-col
          bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
          shadow-xl transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:shadow-none lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <span className="font-extrabold text-gray-900 dark:text-white text-sm leading-tight block">SalesPulse</span>
              <p className="text-[10px] text-gray-400 leading-none">SHRINITHI SD</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* ─ Main ─ */}
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">
            Main
          </p>
          {mainNavItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* ─ Data Views ─ */}
          <div className="pt-4">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">
              Data Views
            </p>
            {dataNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* ─ System ─ */}
          <div className="pt-4">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">
              System
            </p>
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
            >
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* Project info */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
          <div className="rounded-xl bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 p-3">
            <p className="text-xs font-bold text-primary-700 dark:text-primary-300">Minor Project</p>
            <p className="text-[10px] text-primary-600 dark:text-primary-400 mt-0.5">
              Business Analytics · {records.length} Records
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {['Jan','Feb','Mar','Apr'].map(m => (
                <span key={m} className="text-[9px] bg-primary-100 dark:bg-primary-800/40 text-primary-600 dark:text-primary-300 px-1.5 py-0.5 rounded-full">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
