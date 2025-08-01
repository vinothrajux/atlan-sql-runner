'use client';

import { useState } from 'react';
import QueryInput from '../molecules/QueryInput';
import ResultTable from '../molecules/ResultTable';
import Button from '../atoms/Button';
import { downloadCSV } from '../../utils/download';

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

  const activeTab = tabs.find(tab => tab.id === activeTabId)!;

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

  const runQuery = (id: number) => {
    const dummyResult = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
    ];
    setTabs(prev =>
      prev.map(tab =>
        tab.id === id ? { ...tab, result: dummyResult } : tab
      )
    );
  };

  const addNewTab = () => {
    const newId = tabs.length + 1;
    setTabs([...tabs, { id: newId, title: `Query ${newId}`, query: '', result: [] }]);
    setActiveTabId(newId);
  };

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex items-center space-x-2 mb-4">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative">
            <button
              onClick={() => setActiveTabId(tab.id)}
              className={`px-3 py-1 border rounded pr-6 ${
                tab.id === activeTabId ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {tab.title}
            </button>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="absolute right-1 top-0 text-sm text-white hover:text-red-400"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addNewTab}
          className="ml-2 text-sm px-2 py-1 bg-green-500 text-white rounded"
        >
          + Add Tab
        </button>
      </div>

      {/* Active Tab Content */}
      <div>
        <QueryInput
          value={activeTab.query}
          onChange={(val) => updateTabQuery(activeTab.id, val)}
        />
        <Button onClick={() => runQuery(activeTab.id)}>Run Query</Button>
        <Button
          onClick={() => downloadCSV(activeTab.result, `${activeTab.title.replace(' ', '_')}.csv`)}
          disabled={activeTab.result.length === 0}
          className="ml-2 bg-gray-600 hover:bg-gray-700"
        >
          Download CSV
        </Button>
        <ResultTable data={activeTab.result} />
      </div>
    </div>
  );
}