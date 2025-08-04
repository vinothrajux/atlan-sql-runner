'use client';
import { useState } from "react";
import QueryInput from "../molecules/QueryInput";
import ResultTable from "../molecules/ResultTable";
// Update the import path below to the correct relative path if needed
import Button from "../atoms/Button";
import { PlayIcon } from "@heroicons/react/24/outline";

export default function QueryRunnerPanel() {
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<Record<string, any>[]>([]);

  const runQuery = () => {
    // Dummy query execution logic
    const rows = [
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
    ];
    setData(rows);
  };

  return (
    <div>
      <QueryInput value={query} onChange={setQuery} />
      <Button onClick={runQuery}><PlayIcon /> Run Query</Button>
      <ResultTable data={data} />
    </div>
  );
}