/**
 * Badge — colored status pill.
 */
export function Badge({ children, variant = 'default' }) {
  const variants = {
    default:    'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    delivered:  'bg-accent-500/10 text-accent-600 dark:text-accent-400',
    shipped:    'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    processing: 'bg-warning-400/15 text-warning-500 dark:text-warning-400',
    cancelled:  'bg-danger-400/15 text-danger-500 dark:text-danger-400',
    vip:        'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    active:     'bg-accent-500/10 text-accent-600 dark:text-accent-400',
    new:        'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
  };

  const key = children?.toString().toLowerCase();
  const cls = variants[key] || variants[variant] || variants.default;

  return (
    <span className={`badge ${cls}`}>
      {children}
    </span>
  );
}

/**
 * Button — primary or secondary styled button.
 */
export function Button({ children, variant = 'primary', onClick, className = '', id, disabled = false }) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

/**
 * Select — styled native select dropdown.
 */
export function Select({ value, onChange, options = [], id, className = '' }) {
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`input py-2 text-sm ${className}`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

/**
 * EmptyState — placeholder for empty lists / tables.
 */
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Icon size={26} className="text-gray-400" />
        </div>
      )}
      <p className="font-semibold text-gray-700 dark:text-gray-300">{title}</p>
      {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
    </div>
  );
}

/**
 * Skeleton — loading placeholder shimmer block.
 */
export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800 ${className}`} />
  );
}
