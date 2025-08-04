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
    <div className="w-100%">
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
  );
}