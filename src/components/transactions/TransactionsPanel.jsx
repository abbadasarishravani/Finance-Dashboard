import { useMemo, useState } from 'react'
import {
  ArrowDownUp,
  Download,
  FileJson,
  Pencil,
  Plus,
  Search,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance.js'
import { exportRowsAsCsv } from '../../utils/exportCsv.js'
import { downloadJson } from '../../utils/exportJson.js'
import { formatCurrency, formatShortDate } from '../../utils/format.js'
import { Card, CardTitle } from '../ui/Card.jsx'
import { EmptyState } from '../ui/EmptyState.jsx'
import { TransactionModal } from './TransactionModal.jsx'

export function TransactionsPanel() {
  const {
    transactions,
    filteredTransactions,
    filters,
    setFilters,
    isAdmin,
  } = useFinance()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const categoryOptions = useMemo(() => {
    const s = new Set()
    for (const t of transactions) s.add(t.category)
    return ['all', ...[...s].sort()]
  }, [transactions])

  const toggleSort = (key) => {
    setFilters((f) => {
      if (f.sortBy === key) {
        return { ...f, sortDir: f.sortDir === 'asc' ? 'desc' : 'asc' }
      }
      return { ...f, sortBy: key, sortDir: key === 'date' ? 'desc' : 'asc' }
    })
  }

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  const handleExportCsv = () => {
    const rows = filteredTransactions.map((t) => ({
      Date: t.date,
      Type: t.type,
      Category: t.category,
      Amount: t.amount,
      Description: t.description,
    }))
    exportRowsAsCsv(
      rows,
      ['Date', 'Type', 'Category', 'Amount', 'Description'],
      'transactions.csv',
    )
  }

  const handleExportJson = () => {
    downloadJson('transactions.json', filteredTransactions)
  }

  const globalEmpty = transactions.length === 0
  const filteredEmpty = !globalEmpty && filteredTransactions.length === 0

  const sortLabel =
    filters.sortBy === 'date'
      ? 'Date'
      : filters.sortBy === 'amount'
        ? 'Amount'
        : filters.sortBy === 'category'
          ? 'Category'
          : 'Type'

  return (
    <section
      id="transactions"
      className="scroll-mt-24"
      aria-labelledby="activity-heading"
    >
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="activity-heading"
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Activity
        </h2>
        {isAdmin ? (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 sm:w-auto"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add Transaction
          </button>
        ) : null}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-slate-200/80 p-5 dark:border-slate-700/80 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle id="transactions-heading">Transactions</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredTransactions.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              CSV
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              disabled={filteredTransactions.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <FileJson className="h-3.5 w-3.5" aria-hidden />
              JSON
            </button>
          </div>
        </div>

        <div className="grid gap-3 border-b border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-700/80 dark:bg-slate-900/50 lg:grid-cols-12">
          <div className="relative lg:col-span-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search transactions…"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none ring-0 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
              aria-label="Search transactions"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-5 lg:grid-cols-2">
            <label className="sr-only" htmlFor="filter-cat">
              Category
            </label>
            <select
              id="filter-cat"
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="filter-type">
              Type
            </label>
            <select
              id="filter-type"
              value={filters.type}
              onChange={(e) =>
                setFilters((f) => ({ ...f, type: e.target.value }))
              }
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:col-span-3">
            <button
              type="button"
              onClick={() => toggleSort('date')}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              title="Toggle date sort"
            >
              <ArrowDownUp className="h-3.5 w-3.5 opacity-70" />
              Date
              {filters.sortBy === 'date' ? (
                <span className="text-cyan-500">
                  {filters.sortDir === 'asc' ? '↑' : '↓'}
                </span>
              ) : null}
            </button>
            <label className="sr-only" htmlFor="sort-by">
              Sort by
            </label>
            <select
              id="sort-by"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  sortBy: e.target.value,
                  sortDir: e.target.value === 'date' ? 'desc' : 'asc',
                }))
              }
              className="min-w-[8rem] flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="category">Sort by Category</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>

        <div className="sr-only" aria-live="polite">
          Sorted by {sortLabel}, {filters.sortDir === 'asc' ? 'ascending' : 'descending'}
        </div>

        {globalEmpty ? (
          <div className="p-8">
            <EmptyState
              title="No transactions"
              description="Switch to Admin and add your first transaction, or clear site data to reload sample data."
            />
          </div>
        ) : filteredEmpty ? (
          <div className="p-8">
            <EmptyState
              title="No matches"
              description="Try clearing filters or search to see more results."
            />
          </div>
        ) : (
          <ul className="max-h-[min(520px,70vh)] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
            {filteredTransactions.map((t) => (
              <li key={t.id}>
                <div className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <span
                    className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                      t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {t.description}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {t.category} · {formatShortDate(t.date)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-white"
                        aria-label={`Edit ${t.description}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    ) : null}
                    <span
                      className={`text-right text-sm font-semibold tabular-nums sm:text-base ${
                        t.type === 'income'
                          ? 'text-emerald-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '−'}
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <TransactionModal
        open={modalOpen}
        onClose={closeModal}
        editing={editing}
      />
    </section>
  )
}
