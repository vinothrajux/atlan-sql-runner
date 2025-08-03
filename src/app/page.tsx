// import QueryRunnerPanel from "../components/organisms/QueryRunnerPanel";
import Header from "./Header";
import TabbedQueryRunnerPanel from "../components/organisms/TabbedQueryRunnerPanel";
import LeftPanelAccordion from "../components/organisms/LeftPanelAccordion";

export default function Home() {
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
    <div className="flex min-h-screen">
      {/* Sidebar for this page */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-4">
        <LeftPanelAccordion
          tables={mockTables}
          history={queryHistory}
          // onSelect={(query) => updateActiveTabQuery(query)} // connect to tab logic
        />
      </aside>

      {/* Main content next to sidebar */}
      <main className="flex-1 p-6 bg-white dark:bg-black text-black dark:text-white">
        <TabbedQueryRunnerPanel />
      </main>
    </div>
  );
}