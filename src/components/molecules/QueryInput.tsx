import TextArea from "../atoms/TextArea";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function QueryInput({ value, onChange }: Props) {
  return (
    <div className="mb-4">
      <TextArea value={value} onChange={(e) => onChange(e.target.value)} placeholder="Enter SQL query here..." />
    </div>
  );
}