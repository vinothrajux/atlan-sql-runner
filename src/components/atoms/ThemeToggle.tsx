'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)} className="ml-auto px-2 py-1 text-sm border rounded">
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}