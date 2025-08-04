import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeProvider';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  totalResultCount?: number;
};

export default function ResultTable({ data, totalResultCount }: Props) {
  const columns = React.useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns);
  const { theme } = useTheme();

  React.useEffect(() => {
    setVisibleColumns(columns);
  }, [columns]);

  if (data.length === 0) return <p className="text-gray-500">No results.</p>;

  const handleToggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };

  const isDark = theme === 'dark';

  return (
    <div className="mt-6">
      <h2 className='text-2xl font-medium mb-3'>Table Summary</h2>
      <div>
        <div className='flex gap-4'>
          <p><span className='text-gray-500'>Total Rows </span><span className='block'>{totalResultCount}</span></p>
          <p><span className='text-gray-500'>Columns </span><span className='block'>{columns.length}</span></p>
        </div>
      </div>
      <div className="mt-4">
        <details className="mb-2 group">
          <summary className="cursor-pointer text-base font-medium mb-2 select-none flex items-center gap-2">
            <svg className="w-4 h-4 mr-1 inline-block text-gray-500 transition-transform duration-300 group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
            Show/Hide Columns
            <button
              className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
              onClick={e => { e.preventDefault(); setVisibleColumns(columns); }}
              disabled={visibleColumns.length === columns.length}
              type="button"
            >
              Select All
            </button>
            <button
              className="px-2 py-1 text-xs rounded bg-gray-400 text-white hover:bg-gray-500"
              onClick={e => { e.preventDefault(); setVisibleColumns([]); }}
              disabled={visibleColumns.length === 0}
              type="button"
            >
              Deselect All
            </button>
          </summary>
          <div className="flex flex-wrap gap-3 my-2 items-center">
            {columns.map((col) => (
              <label key={col} className={`flex items-center gap-2 px-3 py-1 rounded-full shadow border cursor-pointer transition whitespace-nowrap ${isDark ? 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800' : 'bg-white border-gray-200 hover:bg-blue-100'}` }>
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(col)}
                  onChange={() => handleToggleColumn(col)}
                  className={`accent-blue-600 w-4 h-4 rounded focus:ring-2 focus:ring-blue-400 ${isDark ? '' : ''}`}
                />
                <span className={`text-sm font-normal ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>{col}</span>
              </label>
            ))}
          </div>
        </details>
      </div>
      <table className={`w-full border-separate border-spacing-0 rounded-lg overflow-hidden shadow-sm mt-4 text-sm ${isDark ? 'bg-zinc-800' : 'bg-white'}`}>
        <thead className={isDark ? 'bg-zinc-900' : 'bg-blue-50'}>
          <tr>
            {visibleColumns.map((col) => (
              <th key={col} className={`px-3 py-2 text-left font-semibold sticky top-0 z-10 border-b ${isDark ? 'text-gray-100 bg-zinc-900 border-zinc-700' : 'text-gray-700 bg-blue-100 border-gray-200'}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={isDark ? (i % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-900') : (i % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
              {visibleColumns.map((col) => (
                <td key={col} className={`px-3 py-2 border-b ${isDark ? 'border-zinc-700 text-gray-100' : 'border-gray-100 text-gray-800'}`}>
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}