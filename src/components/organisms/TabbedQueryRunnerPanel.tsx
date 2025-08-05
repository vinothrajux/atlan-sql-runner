'use client';

import { useState, useMemo, useEffect } from 'react';
import QueryInput from '../molecules/QueryInput';
import ResultTable from '../molecules/ResultTable';
import Button from '../atoms/Button';
import { downloadCSV } from '../../utils/download';
import { ArrowDownTrayIcon, CommandLineIcon, DocumentDuplicateIcon, PlayIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

type QueryTab = {
  id: number;
  title: string;
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Record<string, any>[];
};

export default function TabbedQueryRunnerPanel() {
  const [tabs, setTabs] = useState<QueryTab[]>([
    { id: 1, title: 'Query 1', query: '', result: [] },
  ]);
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeTab = tabs.find(tab => tab.id === activeTabId)!;

  const [tabPageMap, setTabPageMap] = useState<Record<number, number>>({});
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [10, 20, 50, 100];

  const currentPage = tabPageMap[activeTabId] || 1;

  // Memoize paginated result
  const paginatedResult = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activeTab.result.slice(start, start + pageSize);
  }, [activeTab.result, currentPage, pageSize]);

  const closeTab = (id: number) => {
    if (tabs.length <= 1) return;

    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);

    if (activeTabId === id) {
      // Set active tab to the next one or previous
      const nextTab = updatedTabs[0];
      setActiveTabId(nextTab.id);
    }
  };

  const updateTabQuery = (id: number, newQuery: string) => {
    setTabs(prev =>
      prev.map(tab =>
        tab.id === id ? { ...tab, query: newQuery } : tab
      )
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setErrorMessage('Query copied to clipboard');
      setTimeout(() => setErrorMessage(null), 2000);
    } catch {
      setErrorMessage('Failed to copy query');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const runQuery = async (id: number) => {
    try {
      setErrorMessage(null);
      setIsLoading(true);
      const tab = tabs.find(t => t.id === id);
      if (!tab) return;
      // Only run for queries matching: select * from <tablename>;
      const match = tab.query.trim().match(/^select \* from ([a-zA-Z0-9_]+);$/i);
      if (!match) {
        setErrorMessage('Only queries in the format: select * from <tablename>; are supported.');
        setIsLoading(false);
        return;
      }
      const tableName = match[1];
      const res = await fetch(
        `https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/refs/heads/master/examples/northwind/data/csv/${tableName}.csv`
      );
      if (!res.ok) throw new Error('CSV file not found');
      const csv = await res.text();
      const [headerLine, ...lines] = csv.trim().split('\n');
      const headers = headerLine.split(',');
      const jsonResult = lines.map((line) => {
        const values = line.split(',');
        return headers.reduce((obj, header, idx) => {
          obj[header] = values[idx];
          return obj;
        }, {} as Record<string, string>);
      });
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === id ? { ...tab, result: jsonResult } : tab
        )
      );
      // Save query to localStorage history
      const query = tab.query.trim();
      const stored = localStorage.getItem('queryHistory');
      let historyArr: string[] = stored ? JSON.parse(stored) : [];
      historyArr = [query, ...historyArr.filter(q => q !== query)].slice(0, 50);
      localStorage.setItem('queryHistory', JSON.stringify(historyArr));
      // Dispatch event to refresh sidebar history immediately
      window.dispatchEvent(new Event('refresh-query-history'));
    } catch {
      setErrorMessage('Failed to fetch or parse CSV');
    } finally {
      setIsLoading(false);
    }
  };

  const addNewTab = () => {
    // Find the max id among existing tabs and increment for uniqueness
    const maxId = tabs.length > 0 ? Math.max(...tabs.map(tab => tab.id)) : 0;
    const newId = maxId + 1;
    setTabs([...tabs, { id: newId, title: `Query ${newId}`, query: '', result: [] }]);
    setActiveTabId(newId);
  }

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      updateTabQuery(activeTabId, e.detail);
    };
    window.addEventListener('fill-active-tab-query', handler as EventListener);
    return () => {
      window.removeEventListener('fill-active-tab-query', handler as EventListener);
    };
  }, [activeTabId]);

  return (
    <div>      
      {errorMessage && (
        <div
          className={`mb-2 px-4 py-2 rounded border animate-fade-in ${
            errorMessage === 'Query copied to clipboard'
              ? 'bg-green-100 text-green-700 border-green-300'
              : 'bg-red-100 text-red-700 border-red-300'
          }`}
        >
          {errorMessage}
        </div>
      )}
      {/* Tab Headers */}
      <div className="flex items-center">
        <div className='flex max-w-11.5/12 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
          {tabs.map((tab) => (
            <div key={tab.id} className="relative">
              <button
                onClick={() => setActiveTabId(tab.id)}
                className={`px-3 py-1 pr-6 cursor-pointer whitespace-nowrap ${
                  tab.id === activeTabId ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                <CommandLineIcon className='h-4 w-4 mb-1 inline'/> {tab.title}
              </button>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className={`absolute right-1 top-0 text-sm text-gray-900 cursor-pointer ${
                  tab.id === activeTabId ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
                >
                  <XMarkIcon className="h-3 w-3 mt-1" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addNewTab}
          className="ml-2 text-sm px-2 py-1 bg-green-500 text-white cursor-pointer"
        >
          <PlusIcon className="h-4 w-4 inline mb-0.5" />
        </button>
      </div>

      {/* Active Tab Content */}
      <div className=' rounded-lg shadow-xl'>
        
        <QueryInput
          value={activeTab.query}
          onChange={(val) => updateTabQuery(activeTab.id, val)}
        />
        <div className={`p-4 border border-gray-300 border-t-0 flex flex-wrap gap-2 items-center justify-between`}>
          <Button
            className="flex items-center gap-1 px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 shadow text-xs font-medium cursor-pointer"
            onClick={() => runQuery(activeTab.id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 mr-1 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
              </svg>
            ) : (
              <PlayIcon className='h-4 w-4'/>
            )}
            Run Query
          </Button>
          {activeTab.result.length > 0 && (
            <div className="flex items-center gap-1 ml-auto">
              <div className="flex items-center gap-1">
                <select
                  id="downloadFormat"
                  className="px-1 py-0.5 rounded border bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 text-xs font-medium shadow focus:ring-2 focus:ring-blue-400 cursor-pointer"
                  style={{ minWidth: 55, height: '24px' }}
                  defaultValue="csv"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
                <Button
                  onClick={() => {
                    const format = (document.getElementById('downloadFormat') as HTMLSelectElement).value;
                    if (format === 'csv') {
                      downloadCSV(activeTab.result, `${activeTab.title.replace(' ', '_')}.csv`);
                    } else {
                      const jsonStr = JSON.stringify(activeTab.result, null, 2);
                      const blob = new Blob([jsonStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${activeTab.title.replace(' ', '_')}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                  }}
                  disabled={activeTab.result.length === 0}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 shadow text-xs font-medium cursor-pointer"
                >
                  <ArrowDownTrayIcon className='h-4 w-4' /> Download
                </Button>
              </div>
            </div>
          )}
          {activeTab.query.length > 0 && (
            <Button
              onClick={() => copyToClipboard(activeTab.query)}
              disabled={!activeTab.query}
              className="flex items-center gap-1 px-2 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 shadow text-xs font-medium cursor-pointer"
            >
              <DocumentDuplicateIcon className='h-4 w-4' /> Copy Query
            </Button>
          )}
          <div className='w-full'>
          <ResultTable data={paginatedResult} totalResultCount={activeTab.result.length} />
          </div>
          {/* Hide pagination if there are no results */}
          {activeTab.result.length > 0 && (
            <div className="mt-2 flex flex-col gap-2 text-sm w-full">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 p-2 rounded-lg shadow-sm">
                <label htmlFor="rowsPerPage" className="text-gray-700 dark:text-gray-200 text-sm font-medium mr-2">Rows per page:</label>
                <select
                  id="rowsPerPage"
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setTabPageMap(prev => ({ ...prev, [activeTabId]: 1 })); // Reset to page 1
                  }}
                  className="border border-gray-300 dark:border-zinc-700 rounded px-2 py-1 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400"
                >
                  {pageSizeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() =>
                      setTabPageMap((prev) => ({
                        ...prev,
                        [activeTabId]: Math.max((prev[activeTabId] || 1) - 1, 1),
                      }))
                    }
                    disabled={currentPage === 1 || Math.ceil(activeTab.result.length / pageSize) <= 1}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-zinc-700 transition disabled:opacity-50"
                  >
                    <span className="inline-block mr-1">⟨</span> Prev
                  </button>
                  <span className="px-2 text-gray-700 dark:text-gray-200 font-medium">
                    Page <span className="font-semibold text-blue-600 dark:text-blue-400">{currentPage}</span> of <span className="font-semibold text-blue-600 dark:text-blue-400">{Math.max(1, Math.ceil(activeTab.result.length / pageSize))}</span>
                  </span>
                  <button
                    onClick={() =>
                      setTabPageMap((prev) => ({
                        ...prev,
                        [activeTabId]: Math.min(
                          (prev[activeTabId] || 1) + 1,
                          Math.ceil(activeTab.result.length / pageSize)
                        ),
                      }))
                    }
                    disabled={currentPage === Math.ceil(activeTab.result.length / pageSize) || Math.ceil(activeTab.result.length / pageSize) <= 1}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-zinc-700 transition disabled:opacity-50"
                  >
                    Next <span className="inline-block ml-1">⟩</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}