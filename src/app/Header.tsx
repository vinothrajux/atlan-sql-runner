'use client';

import { useTheme } from '../context/ThemeProvider';
import RadixThemeSwitch from "../components/atoms/RadixThemeSwitch";
import Image from 'next/image';

export default function Header() {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center sticky justify-between p-4  shadow-lg bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'white' : 'black'}`}>
      <a href="https://atlan.com/" aria-label="Atlan Logo">
      {theme === 'dark' ? 
        <Image width={80} height={24} alt="Atlan Logo" src="https://website-assets.atlan.com/img/logo.svg"  />
        :
        <Image width={80} height={24} alt="Atlan Logo" src="https://website-assets.atlan.com/img/atlan-blue.svg" />
      }
      </a>
      <h1 className="text-sm sm:text-2xl font-bold text-center px-4">SQL Query Runner <span className='text-xs'>AI powered</span></h1>
      <RadixThemeSwitch />
    </div>
  )
}