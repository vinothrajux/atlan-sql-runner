'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { useState } from 'react';

interface LeftPanelAccordionProps {
  tables: string[];
  history: string[];
  onSelect: (query: string) => void;
}

export default function LeftPanelAccordion({
  tables,
  history,
  // onSelect,
}: LeftPanelAccordionProps) {
  const [search, setSearch] = useState('');

  const filteredTables = tables.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase())
  );
  const filteredHistory = history.filter((q) =>
    q.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search tables / queries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
      />

      <Accordion.Root type="multiple" className="space-y-2">
        <Accordion.Item value="tables" className="border rounded">
          <Accordion.Header>
            <Accordion.Trigger className="w-full text-left px-4 py-2 font-medium bg-gray-200 dark:bg-gray-700">
              📂 Tables
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-4 py-2">
            <ul className="text-sm">
              {filteredTables.map((table) => (
                <li
                  key={table}
                  className="cursor-pointer hover:underline py-1"
                  // onClick={() => onSelect(`SELECT * FROM ${table};`)}
                >
                  {table}
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="history" className="border rounded">
          <Accordion.Header>
            <Accordion.Trigger className="w-full text-left px-4 py-2 font-medium bg-gray-200 dark:bg-gray-700">
              📜 Query History
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-4 py-2">
            <ul className="text-sm">
              {filteredHistory.map((q, i) => (
                <li
                  key={i}
                  className="cursor-pointer hover:underline py-1"
                  // onClick={() => onSelect(q)}
                >
                  {q.slice(0, 60)}...
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}