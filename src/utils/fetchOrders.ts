export async function fetchOrdersCSV(): Promise<Record<string, string>[]> {
  const res = await fetch(
    "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/refs/heads/master/examples/northwind/data/csv/orders.csv"
  );
  if (!res.ok) {
    throw new Error(`Failed to load CSV: ${res.statusText}`);
  }
  const text = await res.text();
  return csvToJson(text);
}

function csvToJson(csv: string): Record<string, string>[] {
  const [headerLine, ...lines] = csv.trim().split("\n");
  const headers = headerLine.split(",");

  return lines.map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, idx) => {
      obj[header] = values[idx];
      return obj;
    }, {} as Record<string, string>);
  });
}