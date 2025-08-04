'use client';

import { useState, useMemo } from 'react';
import QueryInput from '../molecules/QueryInput';
import ResultTable from '../molecules/ResultTable';
import Button from '../atoms/Button';
import { useTheme } from '../../context/ThemeProvider';
import { downloadCSV } from '../../utils/download';
import { ArrowDownTrayIcon, CommandLineIcon, DocumentDuplicateIcon, PlayIcon, PlusIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

type QueryTab = {
  id: number;
  title: string;
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Record<string, any>[];
};

export default function TabbedQueryRunnerPanel() {
  const { theme, toggleTheme } = useTheme();
  const [tabs, setTabs] = useState<QueryTab[]>([
    { id: 1, title: 'Query 1', query: '', result: [] },
  ]);
  const [activeTabId, setActiveTabId] = useState<number>(1);

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
      alert('Query copied to clipboard');
    } catch (err) {
      alert('Failed to copy query');
    }
  };

  const runQuery = async (id: number) => {
    try {
      const res = await fetch(
        'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/refs/heads/master/examples/northwind/data/csv/orders.csv'
      );
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
    } catch (err) {
      alert('Failed to fetch or parse CSV');
    }
  };

  const addNewTab = () => {
    const newId = tabs.length + 1;
    setTabs([...tabs, { id: newId, title: `Query ${newId}`, query: '', result: [] }]);
    setActiveTabId(newId);
  };
  const bgClass = theme === 'light' ? 'bg-white text-black' : 'bg-black text-white';

  return (
    <div>      
      {/* Tab Headers */}
      <div className="flex items-center">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative">
            <button
              onClick={() => setActiveTabId(tab.id)}
              className={`px-3 py-1 pr-6 cursor-pointer ${
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
        <button
          onClick={addNewTab}
          className="ml-2 text-sm px-2 py-1 bg-green-500 text-white cursor-pointer"
        >
          <PlusIcon className="h-4 w-4 inline mb-0.5" />
        </button>
      </div>

      {/* Active Tab Content */}
      <div className=' rounded-lg shadow-sm'>
        <QueryInput
          value={activeTab.query}
          onChange={(val) => updateTabQuery(activeTab.id, val)}
        />
        <div className={`p-4 border border-gray-300 border-t-0`}>
          <Button className='mr-2' onClick={() => runQuery(activeTab.id)}><PlayIcon className='h-4 w-4 inline mb-1'/> Run Query</Button>
          {activeTab.result.length > 0 && (
            <Button
              onClick={() => downloadCSV(activeTab.result, `${activeTab.title.replace(' ', '_')}.csv`)}
              disabled={activeTab.result.length === 0}
              className="bg-gray-600 hover:bg-gray-700 mr-2"
            >
              <ArrowDownTrayIcon className='h-4 w-4 inline mb-1.5 mr-2' />Download CSV
            </Button>
          )}
          {activeTab.query.length > 0 && (
            <Button
              onClick={() => copyToClipboard(activeTab.query)}
              disabled={!activeTab.query}
              className="bg-gray-500 hover:bg-gray-600"
            >
              <DocumentDuplicateIcon className='h-4 w-4 inline mb-1 mr-1' />Copy Query
            </Button>
          )}
          
          <ResultTable data={paginatedResult} totalResultCount={activeTab.result.length} />
          {activeTab.result.length > pageSize && (
            <div className="mt-2 flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <label htmlFor="rowsPerPage">Rows per page:</label>
                <select
                  id="rowsPerPage"
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setTabPageMap(prev => ({ ...prev, [activeTabId]: 1 })); // Reset to page 1
                  }}
                  className="border rounded px-2 py-1"
                >
                  {pageSizeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() =>
                    setTabPageMap((prev) => ({
                      ...prev,
                      [activeTabId]: Math.max((prev[activeTabId] || 1) - 1, 1),
                    }))
                  }
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {Math.ceil(activeTab.result.length / pageSize)}
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
                  disabled={currentPage === Math.ceil(activeTab.result.length / pageSize)}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}