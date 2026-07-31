import { useState, useRef } from 'react';
import { useData, parseCSV } from '../../context/DataContext';
import Modal from '../ui/Modal';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadModal({ isOpen, onClose }) {
  const { importDataset } = useData();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [appendMode, setAppendMode] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.txt')) {
      setError('Please upload a valid CSV file (.csv)');
      return;
    }
    setError('');
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rows = parseCSV(text);
        if (rows.length === 0) {
          setError('Could not find valid data rows in CSV.');
          setParsedData([]);
        } else {
          setParsedData(rows);
        }
      } catch (err) {
        setError('Error parsing CSV file: ' + err.message);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleImport = () => {
    if (parsedData.length === 0) return;
    importDataset(parsedData, appendMode);
    onClose();
    setFile(null);
    setParsedData([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📥 Import Dataset (CSV Upload)">
      <div className="space-y-4">
        {/* Drag & drop area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            file
              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
              : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 bg-gray-50/50 dark:bg-gray-800/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .txt"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          <UploadCloud size={36} className={`mx-auto mb-2 ${file ? 'text-primary-600' : 'text-gray-400'}`} />
          {file ? (
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm flex items-center justify-center gap-1.5">
                <FileText size={16} className="text-primary-500" /> {file.name}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                ✅ {parsedData.length} sales records ready to import
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                Click to browse or drop CSV file here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports CSV format (Date, Product, Region, Month, Qty, UnitPrice, Revenue)
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Data preview */}
        {parsedData.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Data Preview (First 3 rows)</span>
              <span className="text-gray-400">{parsedData.length} total rows</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
              <table className="w-full text-[11px]">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Product</th>
                    <th className="px-3 py-2 text-left">Region</th>
                    <th className="px-3 py-2 text-left">Month</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                    <th className="px-3 py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {parsedData.slice(0, 3).map((r, i) => (
                    <tr key={i}>
                      <td className="px-3 py-1.5">{r.date}</td>
                      <td className="px-3 py-1.5 font-medium">{r.product}</td>
                      <td className="px-3 py-1.5">{r.region}</td>
                      <td className="px-3 py-1.5">{r.month}</td>
                      <td className="px-3 py-1.5 text-right">{r.qty}</td>
                      <td className="px-3 py-1.5 text-right font-bold">₹{r.revenue.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mode selection */}
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={!appendMode}
                  onChange={() => setAppendMode(false)}
                  className="accent-primary-600"
                />
                <span>Replace existing dataset</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={appendMode}
                  onChange={() => setAppendMode(true)}
                  className="accent-primary-600"
                />
                <span>Append to current dataset</span>
              </label>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button
            type="button"
            disabled={parsedData.length === 0}
            onClick={handleImport}
            className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={16} /> Import & Update Visualizations
          </button>
        </div>
      </div>
    </Modal>
  );
}
