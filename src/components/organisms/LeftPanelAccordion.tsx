'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { ClockIcon, TableCellsIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import './LeftPanelAccordion.css';

interface LeftPanelAccordionProps {
  tables: string[];
  history: string[];
  onSelect?: (query: string) => void;
}

export default function LeftPanelAccordion({
  tables,
  history,
  // onSelect,
}: LeftPanelAccordionProps) {
  const [search, setSearch] = useState('');
  const { theme } = useTheme();

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
        className="w-full p-2 rounded border bg-white text-gray-800"
      />

      <Accordion.Root type="multiple" className="space-y-2" defaultValue={["tables", "history"]}>
        <Accordion.Item value="tables" className="border rounded overflow-hidden">
          <Accordion.Header>
            <Accordion.Trigger className={`w-full flex items-center justify-between text-left px-4 py-2 font-medium text-gray-800 cursor-pointer ${theme === 'dark' ? 'bg-white' : 'bg-gray-200'}`}>
              <span>
                <TableCellsIcon className={`h-5 mr-1 inline table-icon ${theme === 'dark' ? 'text-gray-800' : 'text-blue-500'}`} /> Tables
              </span>
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 accordion-chevron" />
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

        <Accordion.Item value="history" className="border rounded  overflow-hidden">
          <Accordion.Header>
            <Accordion.Trigger className={`w-full flex items-center justify-between text-left px-4 py-2 font-medium text-gray-800 cursor-pointer ${theme === 'dark' ? 'bg-white' : 'bg-gray-200'}`}>
              <span>
                <ClockIcon className={`h-5 mr-1 inline table-icon ${theme === 'dark' ? 'text-gray-800' : 'text-blue-500'}`} /> Query History
              </span>
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 accordion-chevron" />
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