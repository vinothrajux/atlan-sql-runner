'use client';

import { useTheme } from '../context/ThemeProvider';
import RadixThemeSwitch from "../components/atoms/RadixThemeSwitch";

export default function Header() {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center justify-between p-4 bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}>
      <h1 className="text-2xl font-bold mb-4">ATLAN - SQL Query Runner</h1>
      <RadixThemeSwitch />
    </div>
  )
}