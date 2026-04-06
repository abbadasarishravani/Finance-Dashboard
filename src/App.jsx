import { FinanceProvider } from './context/FinanceProvider.jsx'
import { InsightsSection } from './components/dashboard/InsightsSection.jsx'
import { MonthlyIncomeExpenseChart } from './components/dashboard/MonthlyIncomeExpenseChart.jsx'
import { BalanceTrendChart } from './components/dashboard/BalanceTrendChart.jsx'
import { SpendingBreakdown } from './components/dashboard/SpendingBreakdown.jsx'
import { StatsStrip } from './components/dashboard/StatsStrip.jsx'
import { SummaryCards } from './components/dashboard/SummaryCards.jsx'
import { Header } from './components/layout/Header.jsx'
import { TransactionsPanel } from './components/transactions/TransactionsPanel.jsx'

function DashboardShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0f172a] dark:text-slate-100">
      <Header />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:space-y-10 lg:px-8">
        <SummaryCards />
        <StatsStrip />
        <BalanceTrendChart />
        <div className="grid gap-6 lg:grid-cols-2">
          <SpendingBreakdown />
          <MonthlyIncomeExpenseChart />
        </div>
        <TransactionsPanel />
        <InsightsSection />
      </main>
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        FinDash — React, Tailwind CSS & Recharts
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <FinanceProvider>
      <DashboardShell />
    </FinanceProvider>
  )
}
