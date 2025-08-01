// import QueryRunnerPanel from "../components/organisms/QueryRunnerPanel";
import TabbedQueryRunnerPanel from "../components/organisms/TabbedQueryRunnerPanel";

export default function Home() {
  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ATLAN - SQL Query Runner</h1>
      <TabbedQueryRunnerPanel />
    </main>
  );
}