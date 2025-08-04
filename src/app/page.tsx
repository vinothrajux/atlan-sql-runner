'use client';

import TabbedQueryRunnerPanel from "../components/organisms/TabbedQueryRunnerPanel";
import LeftPanelAccordion from "../components/organisms/LeftPanelAccordion";
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeProvider';

export default function Home() {
  const { theme } = useTheme();
  console.log('Current theme:', theme);
  const mockTables = [
  'customers',
  'orders',
  'products',
  'employees',
  'suppliers',
  'categories',
  'order_details',
  'shippers',
  'regions',
  'territories',
];
const queryHistory = [
  'SELECT * FROM customers;',
  'SELECT name, price FROM products WHERE price > 100;',
  'SELECT o.id, c.name FROM orders o JOIN customers c ON o.customer_id = c.id;',
  'SELECT COUNT(*) FROM orders WHERE status = "shipped";',
  'SELECT * FROM employees WHERE region = "West";',
  'SELECT product_id, SUM(quantity) FROM order_details GROUP BY product_id;',
  'SELECT * FROM suppliers ORDER BY company_name;',
  'SELECT * FROM territories WHERE region_id = 2;',
  'SELECT category_name, COUNT(*) FROM products GROUP BY category_name;',
];
  return (
    <div className="flex min-h-screen w-screen overflow-hidden">
      {/* Sidebar for this page */}
      <aside className={`flex-shrink-0 w-96 max-w-md ${theme === 'dark' ? '' : 'bg-gray-100'} p-4 dark:text-white h-screen overflow-y-auto`}>
        <div className="flex items-center mb-4">
          <Bars3CenterLeftIcon className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-blue-500'} mr-2`} />
          <span className="font-semibold">Side Panel</span>
        </div>
        <LeftPanelAccordion
          tables={mockTables}
          history={queryHistory}
          onSelect={(query) => {
            // Fill the active tab's query input with the selected query
            // updateTabQuery is available in TabbedQueryRunnerPanel, so we need to lift it up
            // We'll use a ref and callback
            window.dispatchEvent(new CustomEvent('fill-active-tab-query', { detail: query }));
          }}
        />
      </aside>

      {/* Main content next to sidebar */}
      <main className="flex-1 p-6 bg-white dark:bg-black text-black dark:text-white h-screen overflow-y-auto max-w-full">
        <TabbedQueryRunnerPanel />
      </main>
    </div>
  );
}