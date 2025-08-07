import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(req: NextRequest) {
  const { nlInput } = await req.json();
  if (!nlInput) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }
  console.log(process.env.COHERE_API_KEY)
  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: `Convert this to SQL: ${nlInput}`,
        max_tokens: 128,
      }),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await response.json();
    let sqlQuery = data.generations?.[0]?.text || "";
    const match = sqlQuery.match(/```sql\s*([\s\S]*?)```/i);
    if (match) {
      sqlQuery = match[1].trim();
    } else {
      const lines = sqlQuery.split("\n").map((l: string) => l.trim());
      const firstSql = lines.find((l: string) =>
        l.toUpperCase().startsWith("SELECT") ||
        l.toUpperCase().startsWith("INSERT") ||
        l.toUpperCase().startsWith("UPDATE") ||
        l.toUpperCase().startsWith("DELETE")
      );
      sqlQuery = firstSql || sqlQuery;
    }
    return NextResponse.json({ sql: sqlQuery });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed to convert." }, { status: 500 });
  }
}
