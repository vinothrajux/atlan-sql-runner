import React, { useState } from 'react';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  totalResultCount?: number;
};

export default function ResultTable({ data, totalResultCount }: Props) {
  const columns = React.useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns);

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

  return (
    <div>
      <div>
        <h2>Table Summary</h2>
        <div>
          <p>Total Rows: {totalResultCount}</p>
          <p>Columns: {columns.length}</p>
        </div>
      </div>
      <div className="flex gap-4 my-2 flex-wrap">
        {columns.map((col) => (
          <label key={col} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={visibleColumns.includes(col)}
              onChange={() => handleToggleColumn(col)}
            />
            {col}
          </label>
        ))}
      </div>
      <table className="w-full border mt-4 text-sm">
        <thead className="bg-gray-100 dark:bg-zinc-800">
          <tr>
            {visibleColumns.map((col) => (
              <th key={col} className="border px-2 py-1 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {visibleColumns.map((col) => (
                <td key={col} className="border px-2 py-1">
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