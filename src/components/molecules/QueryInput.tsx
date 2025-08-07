import Controlled from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "../../context/ThemeProvider";
import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function QueryInput({ value, onChange }: Props) {
  const { theme } = useTheme();
  const [nlInput, setNlInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConvert() {
  setLoading(true);
  try {
    const response = await fetch("/api/text-to-sql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nlInput }),
    });
    const data = await response.json();
    onChange(data.sql || "");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    alert("Failed to convert natural language to SQL.");
  }
  setLoading(false);
}

  return (
    <>
      <style>
        {`
          .cm-placeholder[aria-hidden="true"] {
            color: #6d6d6d !important;
          }
        `}
      </style>
      <div className="border-gray-300 border border-b-2 p-3">
         <h2 className="mb-1"><SparklesIcon className="inline h-6 w-6 mb-2 text-blue-800"/> <span className="text-xl">AI Search</span></h2>
        <div className=" flex gap-2 items-center">
          
          <input
            type="text"
            value={nlInput}
            onChange={e => setNlInput(e.target.value)}
            placeholder="AI Search- Describe your query in natural language... for eg: fetch data from orders table"
            className="border border-gray-400 px-2 py-1 rounded w-full text-sm"
          />
          <button
            onClick={handleConvert}
            disabled={loading || !nlInput}
            className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Converting..." : "Convert to SQL Query"}
          </button>
        </div>
      </div>
      
      <div className="w-100% border-gray-300 border border-t-0">
        <Controlled
          value={value}
          height="250px"
          extensions={[sql()]}
          theme={theme === "dark" ? vscodeDark : vscodeLight}
          onChange={(val) => onChange(val)}
          placeholder="Enter SQL query here..."
          style={{ fontSize: "14px" }}
        />
      </div>
    </>
  );
}