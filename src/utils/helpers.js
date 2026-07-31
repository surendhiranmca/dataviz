/**
 * Format a number as Indian Rupee currency (₹)
 * @param {number} value
 * @param {boolean} compact - use compact notation (L/Cr) for large numbers
 */
export const formatCurrency = (value, compact = false) => {
  if (compact) {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000)   return `₹${(value / 100000).toFixed(2)}L`;
    if (value >= 1000)     return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${Number(value).toLocaleString('en-IN')}`;
};

/**
 * Format a plain number with compact notation
 */
export const formatNumber = (value, compact = false) => {
  if (compact && value >= 1000) {
    return new Intl.NumberFormat('en-IN', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat('en-IN').format(value);
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Export an array of objects to a CSV file
 * @param {Array} data - array of row objects
 * @param {string} filename - output file name
 */
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h] ?? '';
        return typeof val === 'string' && (val.includes(',') || val.includes('\n'))
          ? `"${val}"`
          : val;
      }).join(',')
    ),
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Calculate percentage change between two values
 */
export const percentChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Generate avatar initials background color from a string
 */
export const avatarColor = (str = '') => {
  const colors = [
    'bg-primary-500', 'bg-accent-500', 'bg-warning-500',
    'bg-danger-500', 'bg-purple-500', 'bg-pink-500',
    'bg-cyan-500', 'bg-orange-500',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};
