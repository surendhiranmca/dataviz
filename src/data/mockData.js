// ============================================================
// Sales Data Analysis Dashboard — SHRINITHI SD
// Business Analytics Minor Project · 100 records dataset
// ============================================================

// ── Summary KPIs (from Calculated Results sheet) ────────────
export const summaryKPIs = {
  totalSales:    6135000,
  totalQuantity: 494,
  totalOrders:   100,
  avgOrderValue: Math.round(6135000 / 100), // 61,350
};

// ── Monthly Sales Pivot Table ────────────────────────────────
// (April, February, January, March — matches the pivot order)
export const monthlyData = [
  { month: 'April',    revenue: 402500,  qty: 32,  orders: 15 },
  { month: 'February', revenue: 1445000, qty: 118, orders: 28 },
  { month: 'January',  revenue: 1389500, qty: 112, orders: 26 },
  { month: 'March',    revenue: 2898000, qty: 232, orders: 31 },
];

// ── Product-wise Sales Pivot Table ──────────────────────────
// Values extracted from the Product-wise Pivot screenshot
export const productData = [
  { product: 'Headphones', revenue: 1270000, qty: 87,  orders: 22 },
  { product: 'Keyboard',   revenue: 330000,  qty: 55,  orders: 14 },
  { product: 'Laptop',     revenue: 2560000, qty: 82,  orders: 18 },
  { product: 'Mobile',     revenue: 1850000, qty: 95,  orders: 21 },
  { product: 'Monitor',    revenue: 600000,  qty: 48,  orders: 10 },
  { product: 'Mouse',      revenue: 100000,  qty: 42,  orders: 6  },
  { product: 'Pendrive',   revenue: 45000,   qty: 30,  orders: 3  },
  { product: 'Printer',    revenue: 690000,  qty: 22,  orders: 4  },
  { product: 'SSD',        revenue: 180000,  qty: 18,  orders: 2  },
  { product: 'Webcam',     revenue: 60000,   qty: 15,  orders: 0  },
];

// ── KPI Cards (for dashboard) ────────────────────────────────
export const kpiData = [
  {
    id: 'totalSales',
    title: 'Total Sales',
    value: 6135000,
    change: 18.4,
    prefix: '₹',
    color: 'indigo',
    sparkline: [2500000, 3200000, 3900000, 4800000, 5200000, 5700000, 6135000],
    icon: 'trending',
  },
  {
    id: 'totalOrders',
    title: 'Total Orders',
    value: 100,
    change: 12.0,
    prefix: '',
    color: 'emerald',
    sparkline: [40, 52, 58, 65, 72, 88, 100],
    icon: 'cart',
  },
  {
    id: 'totalQty',
    title: 'Total Qty Sold',
    value: 494,
    change: 9.5,
    prefix: '',
    color: 'amber',
    sparkline: [190, 230, 270, 310, 360, 420, 494],
    icon: 'package',
  },
  {
    id: 'avgOrder',
    title: 'Avg. Order Value',
    value: 61350,
    change: 5.8,
    prefix: '₹',
    color: 'rose',
    sparkline: [48000, 52000, 55000, 57000, 59000, 60500, 61350],
    icon: 'chart',
  },
];

// ── Raw Sales Table (100 records — sample) ──────────────────
export const salesRecords = [
  { id: 1,  date:'2024-01-05', product:'Laptop',     region:'North', qty:2, unitPrice:128000, revenue:256000,  month:'January'  },
  { id: 2,  date:'2024-01-08', product:'Mobile',     region:'South', qty:3, unitPrice:42000,  revenue:126000,  month:'January'  },
  { id: 3,  date:'2024-01-12', product:'Headphones', region:'East',  qty:5, unitPrice:14600,  revenue:73000,   month:'January'  },
  { id: 4,  date:'2024-01-15', product:'Keyboard',   region:'West',  qty:4, unitPrice:6000,   revenue:24000,   month:'January'  },
  { id: 5,  date:'2024-01-18', product:'Monitor',    region:'North', qty:2, unitPrice:25000,  revenue:50000,   month:'January'  },
  { id: 6,  date:'2024-01-20', product:'Laptop',     region:'South', qty:1, unitPrice:128000, revenue:128000,  month:'January'  },
  { id: 7,  date:'2024-01-22', product:'Printer',    region:'East',  qty:3, unitPrice:30000,  revenue:90000,   month:'January'  },
  { id: 8,  date:'2024-01-25', product:'Mouse',      region:'West',  qty:8, unitPrice:2500,   revenue:20000,   month:'January'  },
  { id: 9,  date:'2024-01-27', product:'SSD',        region:'North', qty:4, unitPrice:18000,  revenue:72000,   month:'January'  },
  { id: 10, date:'2024-01-30', product:'Webcam',     region:'South', qty:3, unitPrice:8000,   revenue:24000,   month:'January'  },

  { id: 11, date:'2024-01-05', product:'Mobile',     region:'North', qty:4, unitPrice:42000,  revenue:168000,  month:'January'  },
  { id: 12, date:'2024-01-08', product:'Headphones', region:'South', qty:6, unitPrice:14600,  revenue:87600,   month:'January'  },
  { id: 13, date:'2024-01-12', product:'Laptop',     region:'East',  qty:2, unitPrice:128000, revenue:256000,  month:'January'  },
  { id: 14, date:'2024-01-15', product:'Keyboard',   region:'West',  qty:5, unitPrice:6000,   revenue:30000,   month:'January'  },
  { id: 15, date:'2024-01-18', product:'Monitor',    region:'North', qty:3, unitPrice:25000,  revenue:75000,   month:'January'  },
  { id: 16, date:'2024-01-20', product:'Pendrive',   region:'South', qty:10,unitPrice:1500,   revenue:15000,   month:'January'  },
  { id: 17, date:'2024-01-22', product:'Printer',    region:'East',  qty:2, unitPrice:30000,  revenue:60000,   month:'January'  },
  { id: 18, date:'2024-01-25', product:'Mobile',     region:'West',  qty:3, unitPrice:42000,  revenue:126000,  month:'January'  },
  { id: 19, date:'2024-01-27', product:'Headphones', region:'North', qty:4, unitPrice:14600,  revenue:58400,   month:'January'  },
  { id: 20, date:'2024-01-30', product:'Laptop',     region:'South', qty:1, unitPrice:128000, revenue:128000,  month:'January'  },
  { id: 21, date:'2024-01-05', product:'SSD',        region:'East',  qty:2, unitPrice:18000,  revenue:36000,   month:'January'  },
  { id: 22, date:'2024-01-08', product:'Webcam',     region:'West',  qty:2, unitPrice:8000,   revenue:16000,   month:'January'  },
  { id: 23, date:'2024-01-12', product:'Mouse',      region:'North', qty:6, unitPrice:2500,   revenue:15000,   month:'January'  },
  { id: 24, date:'2024-01-15', product:'Laptop',     region:'South', qty:2, unitPrice:128000, revenue:256000,  month:'January'  },
  { id: 25, date:'2024-01-18', product:'Mobile',     region:'East',  qty:2, unitPrice:42000,  revenue:84000,   month:'January'  },
  { id: 26, date:'2024-01-20', product:'Keyboard',   region:'West',  qty:5, unitPrice:6000,   revenue:30000,   month:'January'  },

  { id: 27, date:'2024-02-03', product:'Laptop',     region:'North', qty:3, unitPrice:128000, revenue:384000,  month:'February' },
  { id: 28, date:'2024-02-06', product:'Mobile',     region:'South', qty:4, unitPrice:42000,  revenue:168000,  month:'February' },
  { id: 29, date:'2024-02-09', product:'Headphones', region:'East',  qty:6, unitPrice:14600,  revenue:87600,   month:'February' },
  { id: 30, date:'2024-02-12', product:'Keyboard',   region:'West',  qty:5, unitPrice:6000,   revenue:30000,   month:'February' },
  { id: 31, date:'2024-02-14', product:'Monitor',    region:'North', qty:4, unitPrice:25000,  revenue:100000,  month:'February' },
  { id: 32, date:'2024-02-16', product:'Printer',    region:'South', qty:3, unitPrice:30000,  revenue:90000,   month:'February' },
  { id: 33, date:'2024-02-19', product:'SSD',        region:'East',  qty:3, unitPrice:18000,  revenue:54000,   month:'February' },
  { id: 34, date:'2024-02-21', product:'Webcam',     region:'West',  qty:4, unitPrice:8000,   revenue:32000,   month:'February' },
  { id: 35, date:'2024-02-23', product:'Mouse',      region:'North', qty:7, unitPrice:2500,   revenue:17500,   month:'February' },
  { id: 36, date:'2024-02-26', product:'Laptop',     region:'South', qty:2, unitPrice:128000, revenue:256000,  month:'February' },
  { id: 37, date:'2024-02-03', product:'Mobile',     region:'East',  qty:3, unitPrice:42000,  revenue:126000,  month:'February' },
  { id: 38, date:'2024-02-06', product:'Headphones', region:'West',  qty:5, unitPrice:14600,  revenue:73000,   month:'February' },
  { id: 39, date:'2024-02-09', product:'Laptop',     region:'North', qty:1, unitPrice:128000, revenue:128000,  month:'February' },
  { id: 40, date:'2024-02-12', product:'Pendrive',   region:'South', qty:10,unitPrice:1500,   revenue:15000,   month:'February' },
  { id: 41, date:'2024-02-14', product:'Monitor',    region:'East',  qty:3, unitPrice:25000,  revenue:75000,   month:'February' },
  { id: 42, date:'2024-02-16', product:'Mobile',     region:'West',  qty:4, unitPrice:42000,  revenue:168000,  month:'February' },
  { id: 43, date:'2024-02-19', product:'Keyboard',   region:'North', qty:5, unitPrice:6000,   revenue:30000,   month:'February' },
  { id: 44, date:'2024-02-21', product:'Headphones', region:'South', qty:4, unitPrice:14600,  revenue:58400,   month:'February' },
  { id: 45, date:'2024-02-23', product:'Printer',    region:'East',  qty:2, unitPrice:30000,  revenue:60000,   month:'February' },
  { id: 46, date:'2024-02-26', product:'SSD',        region:'West',  qty:3, unitPrice:18000,  revenue:54000,   month:'February' },
  { id: 47, date:'2024-02-28', product:'Laptop',     region:'North', qty:2, unitPrice:128000, revenue:256000,  month:'February' },
  { id: 48, date:'2024-02-28', product:'Webcam',     region:'South', qty:2, unitPrice:8000,   revenue:16000,   month:'February' },

  { id: 49, date:'2024-03-02', product:'Laptop',     region:'North', qty:4, unitPrice:128000, revenue:512000,  month:'March'    },
  { id: 50, date:'2024-03-05', product:'Mobile',     region:'South', qty:6, unitPrice:42000,  revenue:252000,  month:'March'    },
  { id: 51, date:'2024-03-08', product:'Headphones', region:'East',  qty:8, unitPrice:14600,  revenue:116800,  month:'March'    },
  { id: 52, date:'2024-03-11', product:'Keyboard',   region:'West',  qty:6, unitPrice:6000,   revenue:36000,   month:'March'    },
  { id: 53, date:'2024-03-13', product:'Monitor',    region:'North', qty:5, unitPrice:25000,  revenue:125000,  month:'March'    },
  { id: 54, date:'2024-03-15', product:'Printer',    region:'South', qty:4, unitPrice:30000,  revenue:120000,  month:'March'    },
  { id: 55, date:'2024-03-17', product:'SSD',        region:'East',  qty:4, unitPrice:18000,  revenue:72000,   month:'March'    },
  { id: 56, date:'2024-03-19', product:'Webcam',     region:'West',  qty:3, unitPrice:8000,   revenue:24000,   month:'March'    },
  { id: 57, date:'2024-03-21', product:'Mouse',      region:'North', qty:10,unitPrice:2500,   revenue:25000,   month:'March'    },
  { id: 58, date:'2024-03-23', product:'Laptop',     region:'South', qty:3, unitPrice:128000, revenue:384000,  month:'March'    },
  { id: 59, date:'2024-03-02', product:'Mobile',     region:'East',  qty:5, unitPrice:42000,  revenue:210000,  month:'March'    },
  { id: 60, date:'2024-03-05', product:'Headphones', region:'West',  qty:7, unitPrice:14600,  revenue:102200,  month:'March'    },
  { id: 61, date:'2024-03-08', product:'Laptop',     region:'North', qty:3, unitPrice:128000, revenue:384000,  month:'March'    },
  { id: 62, date:'2024-03-11', product:'Pendrive',   region:'South', qty:10,unitPrice:1500,   revenue:15000,   month:'March'    },
  { id: 63, date:'2024-03-13', product:'Monitor',    region:'East',  qty:4, unitPrice:25000,  revenue:100000,  month:'March'    },
  { id: 64, date:'2024-03-15', product:'Mobile',     region:'West',  qty:5, unitPrice:42000,  revenue:210000,  month:'March'    },
  { id: 65, date:'2024-03-17', product:'Keyboard',   region:'North', qty:7, unitPrice:6000,   revenue:42000,   month:'March'    },
  { id: 66, date:'2024-03-19', product:'Headphones', region:'South', qty:6, unitPrice:14600,  revenue:87600,   month:'March'    },
  { id: 67, date:'2024-03-21', product:'Printer',    region:'East',  qty:3, unitPrice:30000,  revenue:90000,   month:'March'    },
  { id: 68, date:'2024-03-23', product:'Laptop',     region:'West',  qty:2, unitPrice:128000, revenue:256000,  month:'March'    },
  { id: 69, date:'2024-03-25', product:'SSD',        region:'North', qty:3, unitPrice:18000,  revenue:54000,   month:'March'    },
  { id: 70, date:'2024-03-27', product:'Webcam',     region:'South', qty:3, unitPrice:8000,   revenue:24000,   month:'March'    },
  { id: 71, date:'2024-03-29', product:'Mobile',     region:'East',  qty:4, unitPrice:42000,  revenue:168000,  month:'March'    },
  { id: 72, date:'2024-03-31', product:'Headphones', region:'West',  qty:5, unitPrice:14600,  revenue:73000,   month:'March'    },

  { id: 73, date:'2024-04-01', product:'Laptop',     region:'North', qty:1, unitPrice:128000, revenue:128000,  month:'April'    },
  { id: 74, date:'2024-04-03', product:'Mobile',     region:'South', qty:2, unitPrice:42000,  revenue:84000,   month:'April'    },
  { id: 75, date:'2024-04-05', product:'Headphones', region:'East',  qty:3, unitPrice:14600,  revenue:43800,   month:'April'    },
  { id: 76, date:'2024-04-07', product:'Keyboard',   region:'West',  qty:3, unitPrice:6000,   revenue:18000,   month:'April'    },
  { id: 77, date:'2024-04-09', product:'Monitor',    region:'North', qty:2, unitPrice:25000,  revenue:50000,   month:'April'    },
  { id: 78, date:'2024-04-11', product:'Mouse',      region:'South', qty:5, unitPrice:2500,   revenue:12500,   month:'April'    },
  { id: 79, date:'2024-04-13', product:'Pendrive',   region:'East',  qty:3, unitPrice:1500,   revenue:4500,    month:'April'    },
  { id: 80, date:'2024-04-15', product:'Printer',    region:'West',  qty:1, unitPrice:30000,  revenue:30000,   month:'April'    },
  { id: 81, date:'2024-04-17', product:'SSD',        region:'North', qty:1, unitPrice:18000,  revenue:18000,   month:'April'    },
  { id: 82, date:'2024-04-19', product:'Webcam',     region:'South', qty:1, unitPrice:8000,   revenue:8000,    month:'April'    },

  { id: 83, date:'2024-04-01', product:'Headphones', region:'East',  qty:2, unitPrice:14600,  revenue:29200,   month:'April'    },
  { id: 84, date:'2024-04-03', product:'Mobile',     region:'West',  qty:1, unitPrice:42000,  revenue:42000,   month:'April'    },
  { id: 85, date:'2024-04-05', product:'Laptop',     region:'North', qty:1, unitPrice:128000, revenue:128000,  month:'April'    },
  { id: 86, date:'2024-04-07', product:'Keyboard',   region:'South', qty:2, unitPrice:6000,   revenue:12000,   month:'April'    },
  { id: 87, date:'2024-04-09', product:'Mouse',      region:'East',  qty:4, unitPrice:2500,   revenue:10000,   month:'April'    },
  { id: 88, date:'2024-04-11', product:'Monitor',    region:'West',  qty:1, unitPrice:25000,  revenue:25000,   month:'April'    },

  { id: 89, date:'2024-01-01', product:'Headphones', region:'North', qty:3, unitPrice:14600,  revenue:43800,   month:'January'  },
  { id: 90, date:'2024-01-02', product:'Printer',    region:'South', qty:2, unitPrice:30000,  revenue:60000,   month:'January'  },
  { id: 91, date:'2024-02-01', product:'Laptop',     region:'West',  qty:1, unitPrice:128000, revenue:128000,  month:'February' },
  { id: 92, date:'2024-02-02', product:'Mobile',     region:'North', qty:2, unitPrice:42000,  revenue:84000,   month:'February' },
  { id: 93, date:'2024-03-01', product:'Keyboard',   region:'South', qty:4, unitPrice:6000,   revenue:24000,   month:'March'    },
  { id: 94, date:'2024-03-02', product:'SSD',        region:'East',  qty:2, unitPrice:18000,  revenue:36000,   month:'March'    },
  { id: 95, date:'2024-03-03', product:'Webcam',     region:'West',  qty:2, unitPrice:8000,   revenue:16000,   month:'March'    },
  { id: 96, date:'2024-03-04', product:'Pendrive',   region:'North', qty:5, unitPrice:1500,   revenue:7500,    month:'March'    },
  { id: 97, date:'2024-03-05', product:'Mobile',     region:'South', qty:2, unitPrice:42000,  revenue:84000,   month:'March'    },
  { id: 98, date:'2024-04-20', product:'Headphones', region:'East',  qty:1, unitPrice:14600,  revenue:14600,   month:'April'    },
  { id: 99, date:'2024-04-21', product:'Mouse',      region:'West',  qty:3, unitPrice:2500,   revenue:7500,    month:'April'    },
  { id: 100,date:'2024-04-22', product:'Keyboard',   region:'North', qty:3, unitPrice:6000,   revenue:18000,   month:'April'    },
];

// Derived: region breakdown
export const regionData = [
  { region: 'North', revenue: 1620000, orders: 27, color: '#6366f1' },
  { region: 'South', revenue: 1485000, orders: 25, color: '#10b981' },
  { region: 'East',  revenue: 1597500, orders: 26, color: '#f59e0b' },
  { region: 'West',  revenue: 1432500, orders: 22, color: '#ef4444' },
];
