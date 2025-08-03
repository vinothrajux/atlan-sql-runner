import Controlled from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function QueryInput({ value, onChange }: Props) {
  return (
    <div className="mb-4 w-100%">
      <Controlled
        value={value}
        height="200px"
        extensions={[sql()]}
        onChange={(val) => onChange(val)}
        placeholder="Enter SQL query here..."
      />
    </div>
  );
}