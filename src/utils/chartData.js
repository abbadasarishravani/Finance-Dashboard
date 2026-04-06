import { monthKey } from './format.js'

function enumerateMonths(fromYm, toYm) {
  const out = []
  let [y, m] = fromYm.split('-').map(Number)
  const [ty, tm] = toYm.split('-').map(Number)
  while (y < ty || (y === ty && m <= tm)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`)
    m += 1
    if (m > 12) {
      m = 1
      y += 1
    }
  }
  return out
}

export function formatMonthLabel(ym) {
  const [y, mo] = ym.split('-').map(Number)
  const d = new Date(y, mo - 1, 1)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function shortMonth(ym) {
  const [y, mo] = ym.split('-').map(Number)
  const d = new Date(y, mo - 1, 1)
  return d.toLocaleDateString('en-US', { month: 'short' })
}

/**
 * Income, expense, and cumulative balance per month — for multi-line trend.
 * @param {import('../data/mockData').Transaction[]} transactions
 */
export function buildMonthlyMultiLineSeries(transactions) {
  if (!transactions.length) return []
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
  const fromYm = monthKey(sorted[0].date)
  const toYm = monthKey(sorted[sorted.length - 1].date)
  const months = enumerateMonths(fromYm, toYm)
  const incomeByMonth = {}
  const expenseByMonth = {}
  for (const t of sorted) {
    const mk = monthKey(t.date)
    if (t.type === 'income') {
      incomeByMonth[mk] = (incomeByMonth[mk] || 0) + t.amount
    } else {
      expenseByMonth[mk] = (expenseByMonth[mk] || 0) + t.amount
    }
  }
  let running = 0
  return months.map((mk) => {
    const income = incomeByMonth[mk] || 0
    const expense = expenseByMonth[mk] || 0
    running += income - expense
    return {
      month: mk,
      label: formatMonthLabel(mk),
      shortLabel: shortMonth(mk),
      income,
      expense,
      balance: running,
    }
  })
}

/**
 * Grouped bar chart: income vs expense per month.
 * @param {import('../data/mockData').Transaction[]} transactions
 */
export function buildMonthlyIncomeExpenseBars(transactions) {
  return buildMonthlyMultiLineSeries(transactions).map(
    ({ month, shortLabel, income, expense }) => ({
      month,
      shortLabel,
      income,
      expense,
    }),
  )
}

/**
 * @param {import('../data/mockData').Transaction[]} transactions
 */
export function buildExpenseByCategory(transactions) {
  const map = {}
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    map[t.category] = (map[t.category] || 0) + t.amount
  }
  const entries = Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
  const total = entries.reduce((s, e) => s + e.value, 0)
  return entries.map((e) => ({
    ...e,
    percent: total > 0 ? Math.round((e.value / total) * 1000) / 10 : 0,
  }))
}

/**
 * Top expense category amount, avg expense, distinct category count.
 * @param {import('../data/mockData').Transaction[]} transactions
 */
export function buildQuickStats(transactions) {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const byCat = {}
  for (const t of expenses) {
    byCat[t.category] = (byCat[t.category] || 0) + t.amount
  }
  const topEntry = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]
  const sumExp = expenses.reduce((s, t) => s + t.amount, 0)
  const avg =
    expenses.length > 0 ? Math.round((sumExp / expenses.length) * 100) / 100 : 0
  return {
    topCategory: topEntry ? { name: topEntry[0], amount: topEntry[1] } : null,
    avgExpense: avg,
    categoryCount: Object.keys(byCat).length,
  }
}
