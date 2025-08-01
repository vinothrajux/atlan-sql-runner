import { useState } from "react";
import { executeSQL } from "../lib/queryExecutor";

export function useQueryRunner() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<Record<string, any>[]>([]);

  const run = (query: string) => {
    const result = executeSQL(query);
    setData(result);
  };

  return { data, run };
}