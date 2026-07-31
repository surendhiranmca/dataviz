import { useState } from 'react';
import { useData, UNIT_PRICES } from '../../context/DataContext';
import { Plus, Calculator } from 'lucide-react';

/**
 * AddRecordForm — dynamic form to add a new sales record.
 * Uses dynamic products, regions, and months from useData().
 */
export default function AddRecordForm({ onClose }) {
  const { addRecord, products, regions, months } = useData();

  const defaultProduct = products[0] || 'Laptop';
  const defaultRegion  = regions[0]  || 'North';
  const defaultMonth   = months[0]   || 'March';

  const [form, setForm] = useState({
    product: defaultProduct,
    region:  defaultRegion,
    month:   defaultMonth,
    qty:     '1',
    unitPrice: String(UNIT_PRICES[defaultProduct] || 15000),
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm(prev => {
      const updated = { ...prev, [key]: val };
      if (key === 'product') updated.unitPrice = String(UNIT_PRICES[val] || prev.unitPrice || 15000);
      return updated;
    });
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const revenue = Number(form.qty) * Number(form.unitPrice);

  const validate = () => {
    const e = {};
    if (!form.qty || isNaN(form.qty) || Number(form.qty) < 1) e.qty = 'Qty must be ≥ 1';
    if (!form.unitPrice || isNaN(form.unitPrice) || Number(form.unitPrice) < 1) e.unitPrice = 'Enter a valid price';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    addRecord(form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Product */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Product</label>
          <select value={form.product} onChange={e => set('product', e.target.value)} className="input text-sm">
            {products.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Region</label>
          <select value={form.region} onChange={e => set('region', e.target.value)} className="input text-sm">
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Month */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Month</label>
          <select value={form.month} onChange={e => set('month', e.target.value)} className="input text-sm">
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Qty */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Quantity</label>
          <input
            type="number"
            min="1"
            value={form.qty}
            onChange={e => set('qty', e.target.value)}
            className={`input text-sm ${errors.qty ? 'border-red-400 focus:ring-red-500' : ''}`}
            placeholder="e.g. 2"
          />
          {errors.qty && <p className="text-xs text-red-500 mt-1">{errors.qty}</p>}
        </div>

        {/* Unit Price */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
            Unit Price (₹) <span className="text-gray-400 font-normal">· auto-filled or custom</span>
          </label>
          <input
            type="number"
            min="1"
            value={form.unitPrice}
            onChange={e => set('unitPrice', e.target.value)}
            className={`input text-sm ${errors.unitPrice ? 'border-red-400 focus:ring-red-500' : ''}`}
            placeholder="e.g. 128000"
          />
          {errors.unitPrice && <p className="text-xs text-red-500 mt-1">{errors.unitPrice}</p>}
        </div>
      </div>

      {/* Revenue Preview */}
      <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
          <Calculator size={16} />
          <span className="text-sm font-semibold">Revenue Preview</span>
        </div>
        <span className="text-xl font-extrabold text-primary-700 dark:text-primary-300">
          ₹{(revenue || 0).toLocaleString('en-IN')}
        </span>
      </div>

      <p className="text-xs text-gray-400">
        📅 Record will be dated today. Adding to <b className="text-gray-600 dark:text-gray-300">{form.month}</b> data. All charts & KPIs will update instantly.
      </p>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1 justify-center">
          <Plus size={15} /> Add Record
        </button>
      </div>
    </form>
  );
}
