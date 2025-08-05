// Radix UI Switch for theme toggling
'use client';
import * as Switch from '@radix-ui/react-switch';
import { useTheme } from '../../context/ThemeProvider';

export default function RadixThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs sm:text-sm">{isDark ? 'Dark' : 'Light'} Mode</span>
      <Switch.Root
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="w-10 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative focus:outline-none cursor-pointer"
        id="theme-switch"
      >
        <Switch.Thumb
          className={`block w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow transition-transform duration-200 absolute top-0.5 left-0 ${isDark ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </Switch.Root>
    </div>
  );
}
