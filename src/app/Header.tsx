'use client';

import { useTheme } from '../context/ThemeProvider';
import Button from "../components/atoms/Button";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
    <h1 className="text-2xl font-bold mb-4">ATLAN - SQL Query Runner</h1>
      <Button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </Button>
    </>
  )
}