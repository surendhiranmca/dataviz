import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { salesRecords as initialRecords } from '../data/mockData';
import toast from 'react-hot-toast';

const DataContext = createContext(null);

export const DEFAULT_PRODUCTS = ['Headphones','Keyboard','Laptop','Mobile','Monitor','Mouse','Pendrive','Printer','SSD','Webcam'];
export const DEFAULT_REGIONS  = ['North','South','East','West'];
export const DEFAULT_MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const UNIT_PRICES = {
  Headphones: 14600, Keyboard: 6000, Laptop: 128000, Mobile: 42000,
  Monitor: 25000, Mouse: 2500, Pendrive: 1500, Printer: 30000, SSD: 18000, Webcam: 8000,
};

const ALL_CALENDAR_MONTHS = DEFAULT_MONTHS;

function getMonthFromDateStr(dateStr) {
  if (!dateStr) return 'January';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'January';
  return date.toLocaleString('en-US', { month: 'long' });
}

function makeLiveRecord(prevLength, availableProducts, availableRegions, availableMonths) {
  const products = availableProducts.length > 0 ? availableProducts : DEFAULT_PRODUCTS;
  const regions  = availableRegions.length > 0 ? availableRegions : DEFAULT_REGIONS;
  const months   = availableMonths.length > 0 ? availableMonths : ['January','February','March','April'];

  const product = products[Math.floor(Math.random() * products.length)];
  const region  = regions[Math.floor(Math.random() * regions.length)];
  const month   = months[Math.floor(Math.random() * months.length)];
  const qty     = Math.floor(Math.random() * 5) + 1;
  const price   = UNIT_PRICES[product] || 15000;
  return {
    id: prevLength + 1,
    date: new Date().toISOString().split('T')[0],
    product, region, month,
    qty, unitPrice: price, revenue: qty * price,
    isNew: true,
  };
}

/**
 * Helper to parse CSV string into JSON objects with intelligent header matching.
 */
export function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header line handling quotes
  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if ((char === ',' || char === '\t') && !inQuotes) {
        result.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^["']|["']$/g, ''));
    return result;
  };

  const rawHeaders = parseLine(lines[0]);
  const headers = rawHeaders.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  // Header column index finders
  const findCol = (keywords) => {
    return headers.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const dateIdx      = findCol(['date', 'time', 'created']);
  const productIdx   = findCol(['product', 'item', 'name', 'category']);
  const regionIdx    = findCol(['region', 'location', 'zone', 'territory', 'city']);
  const monthIdx     = findCol(['month']);
  const qtyIdx       = findCol(['qty', 'quantity', 'count', 'units']);
  const unitPriceIdx = findCol(['unitprice', 'price', 'unitcost', 'rate']);
  const revenueIdx   = findCol(['revenue', 'amount', 'total', 'sales']);

  const parsedRecords = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i]);
    if (row.length === 0 || (row.length === 1 && !row[0])) continue;

    const dateVal = dateIdx !== -1 && row[dateIdx] ? row[dateIdx] : new Date().toISOString().split('T')[0];
    const productVal = productIdx !== -1 && row[productIdx] ? row[productIdx] : 'General Item';
    const regionVal = regionIdx !== -1 && row[regionIdx] ? row[regionIdx] : 'North';
    let monthVal = monthIdx !== -1 && row[monthIdx] ? row[monthIdx] : '';

    if (!monthVal) {
      monthVal = getMonthFromDateStr(dateVal);
    }

    const qtyVal = qtyIdx !== -1 && !isNaN(Number(row[qtyIdx])) ? Number(row[qtyIdx]) : 1;
    let unitPriceVal = unitPriceIdx !== -1 && !isNaN(Number(row[unitPriceIdx])) ? Number(row[unitPriceIdx]) : 0;
    let revenueVal = revenueIdx !== -1 && !isNaN(Number(row[revenueIdx])) ? Number(row[revenueIdx]) : 0;

    if (!revenueVal && unitPriceVal && qtyVal) {
      revenueVal = qtyVal * unitPriceVal;
    } else if (!unitPriceVal && revenueVal && qtyVal) {
      unitPriceVal = Math.round(revenueVal / qtyVal);
    } else if (!revenueVal && !unitPriceVal) {
      unitPriceVal = 10000;
      revenueVal = qtyVal * unitPriceVal;
    }

    parsedRecords.push({
      id: i,
      date: dateVal,
      product: productVal,
      region: regionVal,
      month: monthVal,
      qty: qtyVal,
      unitPrice: unitPriceVal,
      revenue: revenueVal,
      isNew: true,
    });
  }

  return parsedRecords;
}

/**
 * DataContext — single source of truth for all dashboard data.
 * Fully dynamic: supports file uploads, dynamic months/products/regions, live simulation.
 */
export function DataProvider({ children }) {
  const [records,      setRecords]      = useState(initialRecords);
  const [monthFilter,  setMonthFilter]  = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [liveMode,     setLiveMode]     = useState(false);
  const [liveCount,    setLiveCount]    = useState(0);

  // ── Dynamic Months, Products, Regions derived from active records ──
  const months = useMemo(() => {
    const set = new Set(records.map(r => r.month).filter(Boolean));
    const list = Array.from(set);
    return list.sort((a, b) => {
      const ia = ALL_CALENDAR_MONTHS.indexOf(a);
      const ib = ALL_CALENDAR_MONTHS.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      return a.localeCompare(b);
    });
  }, [records]);

  const products = useMemo(() => {
    return Array.from(new Set(records.map(r => r.product).filter(Boolean))).sort();
  }, [records]);

  const regions = useMemo(() => {
    return Array.from(new Set(records.map(r => r.region).filter(Boolean))).sort();
  }, [records]);

  // ── Live simulation ────────────────────────────────────────────────
  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      setRecords(prev => {
        const rec = makeLiveRecord(prev.length, products, regions, months);
        setTimeout(() => {
          toast.success(`🔴 Live: ${rec.product} — ${rec.region} region · ₹${rec.revenue.toLocaleString('en-IN')}`, { duration: 4000 });
        }, 0);
        return [...prev, rec];
      });
      setLiveCount(c => c + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, [liveMode, products, regions, months]);

  // ── Filtered records ─────────────────────────────────────────────
  const filteredRecords = useMemo(() => {
    let rows = records;
    if (monthFilter  !== 'all') rows = rows.filter(r => r.month  === monthFilter);
    if (regionFilter !== 'all') rows = rows.filter(r => r.region === regionFilter);
    return rows;
  }, [records, monthFilter, regionFilter]);

  // ── Computed KPIs ────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const totalSales    = filteredRecords.reduce((s, r) => s + r.revenue, 0);
    const totalQuantity = filteredRecords.reduce((s, r) => s + r.qty, 0);
    const totalOrders   = filteredRecords.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    return { totalSales, totalQuantity, totalOrders, avgOrderValue };
  }, [filteredRecords]);

  // ── Monthly pivot (dynamic for any dataset) ──────────────────────
  const monthlyPivot = useMemo(() => {
    const map = {};
    filteredRecords.forEach(r => {
      const m = r.month || 'Unknown';
      if (!map[m]) map[m] = { month: m, revenue: 0, qty: 0, orders: 0 };
      map[m].revenue += r.revenue;
      map[m].qty     += r.qty;
      map[m].orders  += 1;
    });
    return Object.values(map).sort((a, b) => {
      const ia = ALL_CALENDAR_MONTHS.indexOf(a.month);
      const ib = ALL_CALENDAR_MONTHS.indexOf(b.month);
      if (ia !== -1 && ib !== -1) return ia - ib;
      return a.month.localeCompare(b.month);
    });
  }, [filteredRecords]);

  // ── Product pivot ────────────────────────────────────────────────
  const productPivot = useMemo(() => {
    const map = {};
    filteredRecords.forEach(r => {
      const p = r.product || 'Unknown';
      if (!map[p]) map[p] = { product: p, revenue: 0, qty: 0, orders: 0 };
      map[p].revenue += r.revenue;
      map[p].qty     += r.qty;
      map[p].orders  += 1;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [filteredRecords]);

  // ── Region breakdown ─────────────────────────────────────────────
  const regionBreakdown = useMemo(() => {
    const COLORS = { North: '#6366f1', South: '#10b981', East: '#f59e0b', West: '#ef4444' };
    const DEFAULT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    const map = {};
    filteredRecords.forEach((r, idx) => {
      const reg = r.region || 'Default';
      if (!map[reg]) {
        map[reg] = {
          region: reg,
          revenue: 0,
          orders: 0,
          color: COLORS[reg] || DEFAULT_COLORS[Object.keys(map).length % DEFAULT_COLORS.length]
        };
      }
      map[reg].revenue += r.revenue;
      map[reg].orders  += 1;
    });
    return Object.values(map);
  }, [filteredRecords]);

  // ── Add record ───────────────────────────────────────────────────
  const addRecord = useCallback((formData) => {
    const price = Number(formData.unitPrice) || UNIT_PRICES[formData.product] || 10000;
    const qty   = Number(formData.qty);
    setRecords(prev => {
      const rec = {
        id: prev.length + 1,
        date: new Date().toISOString().split('T')[0],
        product:  formData.product,
        region:   formData.region,
        month:    formData.month,
        qty, unitPrice: price,
        revenue: qty * price,
        isNew: true,
      };
      setTimeout(() => {
        toast.success(`✅ Record #${rec.id} added — ${rec.product} · ₹${rec.revenue.toLocaleString('en-IN')}`, { duration: 4000 });
      }, 0);
      return [...prev, rec];
    });
  }, []);

  // ── Import dataset from CSV / JSON ────────────────────────────────
  const importDataset = useCallback((newRecords, append = false) => {
    if (!newRecords || newRecords.length === 0) {
      toast.error('No valid sales records found in file!');
      return;
    }

    setRecords(prev => {
      const base = append ? prev : [];
      const formatted = newRecords.map((r, i) => ({
        ...r,
        id: base.length + i + 1,
        isNew: true,
      }));
      const combined = [...base, ...formatted];
      setTimeout(() => {
        toast.success(`📁 Imported ${newRecords.length} records! All charts updated.`, { duration: 5000, icon: '🚀' });
      }, 0);
      return combined;
    });

    setMonthFilter('all');
    setRegionFilter('all');
  }, []);

  // ── Reset ────────────────────────────────────────────────────────
  const resetData = useCallback(() => {
    setRecords(initialRecords);
    setMonthFilter('all');
    setRegionFilter('all');
    setLiveCount(0);
    setTimeout(() => toast('📊 Data reset to original 100 records', { icon: '🔄' }), 0);
  }, []);

  const value = useMemo(() => ({
    records, filteredRecords,
    months, products, regions,
    monthFilter, setMonthFilter,
    regionFilter, setRegionFilter,
    liveMode, setLiveMode, liveCount,
    kpis, monthlyPivot, productPivot, regionBreakdown,
    addRecord, importDataset, resetData,
  }), [
    records, filteredRecords,
    months, products, regions,
    monthFilter, regionFilter,
    liveMode, liveCount,
    kpis, monthlyPivot, productPivot, regionBreakdown,
    addRecord, importDataset, resetData,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
};
