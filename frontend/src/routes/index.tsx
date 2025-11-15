import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold">Expense tracker</h1>

        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-600 hover:text-gray-900">
            This Month
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-200">
            ⚙️
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-6 flex-1 overflow-y-auto space-y-6">

        {/* === Top Tiles (3) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 h-32">
            <div className="font-semibold text-gray-700">Total Balance</div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 h-32">
            <div className="font-semibold text-gray-700">Budget Progress</div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 h-32">
            <div className="font-semibold text-gray-700">Upcoming Bills</div>
          </div>
        </div>

        {/* === Middle Tiles (2) === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 h-64">
            <div className="font-semibold text-gray-700">Spending by Category</div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 h-64">
            <div className="font-semibold text-gray-700">Cash Flow Over Time</div>
          </div>
        </div>

        {/* === Bottom Table Tile === */}
        <div className="bg-white rounded-2xl shadow-md p-6 h-72">
          <div className="font-semibold text-gray-700">Recent Activity</div>
        </div>

      </main>
    </div>
  )
}
