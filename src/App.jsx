import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider }  from './context/DataContext';
import Layout    from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import DataTable from './pages/DataTable';
import Orders    from './pages/Orders';
import Customers from './pages/Customers';
import Products  from './pages/Products';
import Settings  from './pages/Settings';

/**
 * App — root with ThemeProvider + DataProvider wrapping all routes.
 *
 * DataProvider supplies global dynamic state:
 *   - Filtered records (month + region filters from Navbar)
 *   - Computed KPIs (auto-recalculated on any data change)
 *   - Monthly & product pivots (live-updating)
 *   - Add record action (updates all charts/KPIs instantly)
 *   - Live simulation mode (adds records every 8s)
 *
 * Routes:
 *   /           → Dashboard
 *   /analytics  → Analytics (Pivot Tables)
 *   /data       → DataTable (100+ raw records)
 *   /orders     → Orders (dynamic from filteredRecords)
 *   /customers  → Customers (region segments)
 *   /products   → Products (productPivot)
 *   /settings   → Settings
 */
export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index          element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="data"      element={<DataTable />} />
              <Route path="orders"    element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="products"  element={<Products />} />
              <Route path="settings"  element={<Settings  />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
}

