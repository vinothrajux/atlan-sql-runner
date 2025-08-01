type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
};

export default function ResultTable({ data }: Props) {
  if (data.length === 0) return <p className="text-gray-500">No results.</p>;

  const columns = Object.keys(data[0]);
  return (
    <table className="w-full border mt-4 text-sm">
      <thead className="bg-gray-100 dark:bg-zinc-800">
        <tr>
          {columns.map((col) => (
            <th key={col} className="border px-2 py-1 text-left">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col} className="border px-2 py-1">
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}