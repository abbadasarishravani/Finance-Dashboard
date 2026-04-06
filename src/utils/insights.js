import { monthKey } from './format.js'

function sumForMonth(transactions, ym, type) {
  return transactions
    .filter((t) => monthKey(t.date) === ym && t.type === type)
    .reduce((s, t) => s + t.amount, 0)
}

/**
 * @param {import('../data/mockData').Transaction[]} transactions
 */
export function computeInsights(transactions) {
  if (!transactions.length) {
    return {
      empty: true,
      items: [],
    }
  }

  const now = new Date()
  const thisYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevYm = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`

  const expenseByCat = {}
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    expenseByCat[t.category] = (expenseByCat[t.category] || 0) + t.amount
  }
  const topCat = Object.entries(expenseByCat).sort((a, b) => b[1] - a[1])[0]

  const incThis = sumForMonth(transactions, thisYm, 'income')
  const expThis = sumForMonth(transactions, thisYm, 'expense')
  const incPrev = sumForMonth(transactions, prevYm, 'income')
  const expPrev = sumForMonth(transactions, prevYm, 'expense')

  const savingsRate =
    incThis > 0 ? Math.round(((incThis - expThis) / incThis) * 1000) / 10 : null

  const expenseTx = transactions.filter((t) => t.type === 'expense')
  const avgExpense =
    expenseTx.length > 0
      ? expenseTx.reduce((s, t) => s + t.amount, 0) / expenseTx.length
      : 0

  const items = []

  if (topCat) {
    items.push({
      id: 'top-cat',
      title: 'Top spending category',
      detail: `${topCat[0]} accounts for the largest share of expenses overall (${formatUsd(topCat[1])}).`,
      tone: 'neutral',
    })
  }

  if (incThis || expThis || incPrev || expPrev) {
    const incDelta = incPrev ? ((incThis - incPrev) / incPrev) * 100 : null
    const expDelta = expPrev ? ((expThis - expPrev) / expPrev) * 100 : null
    const momParts = [
      `This month: income ${formatUsd(incThis)}, expenses ${formatUsd(expThis)}.`,
    ]
    if (incDelta !== null && Number.isFinite(incDelta)) {
      momParts.push(
        `Income vs last month: ${incDelta >= 0 ? '+' : ''}${incDelta.toFixed(1)}%.`,
      )
    }
    if (expDelta !== null && Number.isFinite(expDelta)) {
      momParts.push(
        `Expenses vs last month: ${expDelta >= 0 ? '+' : ''}${expDelta.toFixed(1)}%.`,
      )
    }
    items.push({
      id: 'mom',
      title: 'Month-over-month',
      detail: momParts.join(' '),
      tone: expDelta !== null && expDelta > 5 ? 'warn' : 'good',
    })
  }

  if (savingsRate !== null) {
    items.push({
      id: 'savings',
      title: 'Savings rate (this month)',
      detail:
        savingsRate >= 0
          ? `You retained about ${savingsRate}% of income after expenses in ${thisYm}.`
          : `Expenses exceeded income this month by ${formatUsd(expThis - incThis)}.`,
      tone: savingsRate >= 20 ? 'good' : savingsRate >= 0 ? 'neutral' : 'warn',
    })
  }

  items.push({
    id: 'avg',
    title: 'Average expense size',
    detail: `Across ${expenseTx.length} expense line items, the average amount is ${formatUsd(avgExpense)}.`,
    tone: 'neutral',
  })

  return { empty: false, items }
}

function formatUsd(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n)
}
