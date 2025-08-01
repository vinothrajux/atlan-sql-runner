import { TextareaHTMLAttributes } from "react";

export default function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className="w-full p-2 border rounded resize-none" rows={5} />
  );
}