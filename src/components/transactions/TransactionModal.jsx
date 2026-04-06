import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance.js'

const emptyForm = {
  date: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  description: '',
}

function buildForm(editing, expenseCategories) {
  if (editing) {
    return {
      date: editing.date,
      amount: String(editing.amount),
      type: editing.type,
      category: editing.category,
      description: editing.description === '—' ? '' : editing.description,
    }
  }
  const today = new Date().toISOString().slice(0, 10)
  return {
    ...emptyForm,
    date: today,
    category: expenseCategories[0],
  }
}

function TransactionModalInner({ onClose, editing }) {
  const {
    addTransaction,
    updateTransaction,
    expenseCategories,
    incomeCategories,
  } = useFinance()

  const [form, setForm] = useState(() =>
    buildForm(editing, expenseCategories),
  )

  const catOptions =
    form.type === 'income' ? incomeCategories : expenseCategories

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = Number(form.amount)
    if (!form.date || !Number.isFinite(amount) || amount <= 0) return
    const category = catOptions.includes(form.category)
      ? form.category
      : catOptions[0]
    const payload = {
      date: form.date,
      amount,
      type: form.type,
      category,
      description: form.description,
    }
    if (editing) updateTransaction(editing.id, payload)
    else addTransaction(payload)
    onClose()
  }

  return (
    <div
      className="w-full max-w-md animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-modal-title"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2
          id="tx-modal-title"
          className="text-lg font-bold text-slate-900 dark:text-white"
        >
          {editing ? 'Edit transaction' : 'New transaction'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="tx-date"
            className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            Date
          </label>
          <input
            id="tx-date"
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="tx-type"
            className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            Type
          </label>
          <select
            id="tx-type"
            value={form.type}
            onChange={(e) => {
              const type = e.target.value
              const nextCat =
                type === 'income' ? incomeCategories[0] : expenseCategories[0]
              setForm((f) => ({ ...f, type, category: nextCat }))
            }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="tx-category"
            className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            Category
          </label>
          <select
            id="tx-category"
            value={
              catOptions.includes(form.category) ? form.category : catOptions[0]
            }
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          >
            {catOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="tx-amount"
            className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            Amount (USD)
          </label>
          <input
            id="tx-amount"
            type="number"
            min="0.01"
            step="0.01"
            required
            value={form.amount}
            onChange={(e) =>
              setForm((f) => ({ ...f, amount: e.target.value }))
            }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="tx-desc"
            className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            Description
          </label>
          <input
            id="tx-desc"
            type="text"
            placeholder="e.g. Weekly groceries"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition hover:brightness-105"
          >
            {editing ? 'Save changes' : 'Add transaction'}
          </button>
        </div>
      </form>
    </div>
  )
}

export function TransactionModal({ open, onClose, editing }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <TransactionModalInner
        key={editing ? editing.id : 'new'}
        editing={editing}
        onClose={onClose}
      />
    </div>
  )
}
