'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { ClockIcon, TableCellsIcon, ChevronDownIcon, QueueListIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import './LeftPanelAccordion.css';

interface LeftPanelAccordionProps {
  tables: string[];
  history: string[];
  onSelect?: (query: string) => void;
}

export default function LeftPanelAccordion({
  tables,
  history,
  onSelect,
}: LeftPanelAccordionProps) {
  const [search, setSearch] = useState('');
  const { theme } = useTheme();

  const [localHistory, setLocalHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('queryHistory');
      if (stored) return JSON.parse(stored);
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('queryHistory');
      if (stored) setLocalHistory(JSON.parse(stored));
    }
  }, [history]);

  useEffect(() => {
    const handleRefreshHistory = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('queryHistory');
        if (stored) setLocalHistory(JSON.parse(stored));
      }
    };
    window.addEventListener('refresh-query-history', handleRefreshHistory);
    return () => window.removeEventListener('refresh-query-history', handleRefreshHistory);
  }, []);

  // Add this effect to update localHistory immediately when search or localStorage changes
  useEffect(() => {
    setFilteredHistory(
      [...localHistory, ...history.filter(q => !localHistory.includes(q))].filter((q) => q.toLowerCase().includes(search.toLowerCase()))
    );
  }, [localHistory, history, search]);

  const combinedHistory = useMemo(() => {
    return [...localHistory, ...history.filter(q => !localHistory.includes(q))];
  }, [localHistory, history]);

  const filteredTables = tables.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase())
  );
  const [filteredHistory, setFilteredHistory] = useState<string[]>([]);

  useEffect(() => {
    setFilteredHistory(
      combinedHistory.filter((q) => q.toLowerCase().includes(search.toLowerCase()))
    );
  }, [combinedHistory, search]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search tables / queries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 rounded border bg-white text-gray-800 border-gray-300 shadow-xl mb-6"
      />

      <Accordion.Root type="multiple" className="space-y-2" defaultValue={["tables", "history"]}>
        <Accordion.Item value="tables" className="border border-gray-300 mb-6 rounded overflow-hidden shadow-xl">
          <Accordion.Header>
            <Accordion.Trigger className={`w-full flex items-center justify-between text-left px-4 py-2 font-medium text-gray-800 cursor-pointer ${theme === 'dark' ? 'bg-white' : 'bg-gray-200'}`}>
              <span>
                <TableCellsIcon className={`h-5 mr-1 inline table-icon ${theme === 'dark' ? 'text-gray-800' : 'text-blue-500'}`} /> Tables
              </span>
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 accordion-chevron" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-4 py-2">
            <ul className="text-sm max-h-48 overflow-y-auto">
              {filteredTables.map((table) => (
                <li
                  key={table}
                  className={`${theme === 'dark' ? 'accordionlist' : ''} cursor-pointer py-1 px-2 mb-1 rounded transition hover:bg-blue-100 dark:hover:bg-zinc-700 flex items-center gap-2 dark-hover-list hover:text-gray-800`}
                  onClick={() => {
                    if (typeof onSelect === 'function') {
                      onSelect(`SELECT * FROM ${table};`);
                    }
                  }}
                >
                  <QueueListIcon className={`h-4 w-4 text-blue-500 ${theme === 'dark' ? 'text-white' : 'text-blue-500'} dark:text-zinc-400 icon-in-list`} />
                  <span className="truncate font-medium text-in-list">{table}</span>
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="history" className="border border-gray-300 rounded shadow-xl overflow-hidden">
          <Accordion.Header>
            <Accordion.Trigger className={`w-full flex items-center justify-between text-left px-4 py-2 font-medium text-gray-800 cursor-pointer ${theme === 'dark' ? 'bg-white' : 'bg-gray-200'}`}>
              <span>
                <ClockIcon className={`h-5 mr-1 inline table-icon ${theme === 'dark' ? 'text-gray-800' : 'text-blue-500'}`} /> Query History
              </span>
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 accordion-chevron" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-4 py-2">
            <ul className="text-sm max-h-48 overflow-y-auto">
              {filteredHistory.map((q, i) => (
                <li
                  key={i}
                  title={q}
                  className={`${theme === 'dark' ? 'accordionlist' : ''} cursor-pointer py-1 px-2 mb-1 rounded transition hover:bg-blue-100 dark:hover:bg-zinc-700 flex items-center gap-2 dark-hover-list hover:text-gray-800`}
                  onClick={() => {
                    if (typeof onSelect === 'function') {
                      onSelect(q);
                    }
                  }}
                >
                  <QueueListIcon className={`h-4 w-4 text-blue-500 ${theme === 'dark' ? 'text-white' : 'text-blue-500'} dark:text-zinc-400 icon-in-list`} />
                  <span className="truncate text-in-list" title={q}>{q.slice(0, 60)}...</span>
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}