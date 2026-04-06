import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  mockTransactions,
} from '../data/mockData'
import { FinanceContext } from './financeContext.js'

const STORAGE_TX = 'finance-dashboard-transactions-v1'
const STORAGE_THEME = 'finance-dashboard-theme-v1'
const STORAGE_ROLE = 'finance-dashboard-role-v1'

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = loadJson(STORAGE_TX, null)
    if (Array.isArray(saved)) return saved
    return mockTransactions.map((t) => ({ ...t }))
  })

  const [role, setRoleState] = useState(() => {
    const r = loadJson(STORAGE_ROLE, 'viewer')
    return r === 'admin' ? 'admin' : 'viewer'
  })

  const [darkMode, setDarkModeState] = useState(() => {
    const t = loadJson(STORAGE_THEME, null)
    if (t === 'dark' || t === 'light') return t === 'dark'
    return true
  })

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    sortBy: 'date',
    sortDir: 'desc',
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_TX, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(STORAGE_ROLE, JSON.stringify(role))
  }, [role])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_THEME,
      JSON.stringify(darkMode ? 'dark' : 'light'),
    )
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const setRole = useCallback((next) => {
    setRoleState(next === 'admin' ? 'admin' : 'viewer')
  }, [])

  const setDarkMode = useCallback((value) => {
    setDarkModeState((prev) =>
      typeof value === 'function' ? Boolean(value(prev)) : Boolean(value),
    )
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkModeState((d) => !d)
  }, [])

  const isAdmin = role === 'admin'

  const addTransaction = useCallback(
    (payload) => {
      if (!isAdmin) return
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      setTransactions((prev) => [
        {
          id,
          date: payload.date,
          amount: Math.abs(Number(payload.amount) || 0),
          type: payload.type,
          category: payload.category,
          description: (payload.description || '').trim() || '—',
        },
        ...prev,
      ])
    },
    [isAdmin],
  )

  const updateTransaction = useCallback(
    (id, payload) => {
      if (!isAdmin) return
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                date: payload.date,
                amount: Math.abs(Number(payload.amount) || 0),
                type: payload.type,
                category: payload.category,
                description: (payload.description || '').trim() || '—',
              }
            : t,
        ),
      )
    },
    [isAdmin],
  )

  const totals = useMemo(() => {
    let income = 0
    let expense = 0
    for (const t of transactions) {
      if (t.type === 'income') income += t.amount
      else expense += t.amount
    }
    return {
      income,
      expense,
      balance: income - expense,
    }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    let list = [...transactions]
    const { search, category, type, sortBy, sortDir } = filters
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          String(t.amount).includes(q),
      )
    }
    if (category !== 'all') list = list.filter((t) => t.category === category)
    if (type !== 'all') list = list.filter((t) => t.type === type)
    const dir = sortDir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      if (sortBy === 'amount') return (a.amount - b.amount) * dir
      if (sortBy === 'category') return a.category.localeCompare(b.category) * dir
      if (sortBy === 'type') return a.type.localeCompare(b.type) * dir
      if (a.date < b.date) return -1 * dir
      if (a.date > b.date) return 1 * dir
      return 0
    })
    return list
  }, [transactions, filters])

  const value = useMemo(
    () => ({
      transactions,
      role,
      setRole,
      isAdmin,
      darkMode,
      setDarkMode,
      toggleDarkMode,
      filters,
      setFilters,
      addTransaction,
      updateTransaction,
      totals,
      filteredTransactions,
      expenseCategories: EXPENSE_CATEGORIES,
      incomeCategories: INCOME_CATEGORIES,
    }),
    [
      transactions,
      role,
      setRole,
      isAdmin,
      darkMode,
      setDarkMode,
      toggleDarkMode,
      filters,
      addTransaction,
      updateTransaction,
      totals,
      filteredTransactions,
    ],
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}
