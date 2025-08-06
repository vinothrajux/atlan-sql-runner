import Controlled from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "../../context/ThemeProvider";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function QueryInput({ value, onChange }: Props) {
  const { theme } = useTheme();
  return (
    <>
     <style>
        {`
          /* Fix color contrast for CodeMirror placeholder for accessibilty fix */
          .cm-placeholder[aria-hidden="true"] {
            color: #6d6d6d !important;
          }
        `}
      </style>
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