// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function executeSQL(query: string): Record<string, any>[] {
  return [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
  ];
}