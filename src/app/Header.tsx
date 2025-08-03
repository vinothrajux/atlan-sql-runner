'use client';

import { useTheme } from '../context/ThemeProvider';
import RadixThemeSwitch from "../components/atoms/RadixThemeSwitch";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
    <h1 className="text-2xl font-bold mb-4">ATLAN - SQL Query Runner</h1>
      <RadixThemeSwitch />
    </>
  )
}