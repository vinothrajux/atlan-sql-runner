'use client';

import React from 'react';

type QueryHistoryProps = {
  history: string[];
  onSelect: (query: string) => void;
};

export default function QueryHistory({ history, onSelect }: QueryHistoryProps) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Query History</h3>
      <ul className="bg-gray-100 rounded p-2 max-h-40 overflow-y-auto text-sm">
        {history.length === 0 ? (
          <li className="text-gray-400 italic">No queries run yet.</li>
        ) : (
          history.map((query, i) => (
            <li
              key={i}
              onClick={() => onSelect(query)}
              className="cursor-pointer hover:bg-gray-200 p-1 rounded"
              title={query}
            >
              {query.length > 60 ? query.slice(0, 60) + '…' : query}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}