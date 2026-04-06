import { useMemo } from 'react'
import { useFinance } from '../../hooks/useFinance.js'
import { buildQuickStats } from '../../utils/chartData.js'
import { formatCurrency } from '../../utils/format.js'
import { Card } from '../ui/Card.jsx'

export function StatsStrip() {
  const { transactions, darkMode } = useFinance()
  const stats = useMemo(() => buildQuickStats(transactions), [transactions])

  const labelCls = darkMode ? 'text-slate-400' : 'text-slate-500'
  const titleCls = darkMode ? 'text-white' : 'text-slate-900'
  const mutedCls = darkMode ? 'text-slate-400' : 'text-slate-500'

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="py-5">
        <p className={`text-xs font-medium uppercase tracking-wide ${labelCls}`}>
          Top category
        </p>
        <p
          className={`mt-2 truncate text-lg font-semibold ${titleCls}`}
          title={stats.topCategory?.name}
        >
          {stats.topCategory?.name ?? '—'}
        </p>
        <p className={`mt-3 text-3xl font-bold tabular-nums ${titleCls}`}>
          {stats.topCategory ? formatCurrency(stats.topCategory.amount) : '—'}
        </p>
      </Card>

      <Card className="py-5">
        <p className={`text-xs font-medium uppercase tracking-wide ${labelCls}`}>
          Average
        </p>
        <p className={`mt-2 text-3xl font-bold tabular-nums ${titleCls}`}>
          {formatCurrency(stats.avgExpense)}
        </p>
        <p className={`mt-1 text-sm ${mutedCls}`}>Per expense</p>
      </Card>

      <Card className="py-5">
        <p className={`text-xs font-medium uppercase tracking-wide ${labelCls}`}>
          Breadth
        </p>
        <p className={`mt-2 text-3xl font-bold tabular-nums ${titleCls}`}>
          {stats.categoryCount}
        </p>
        <p className={`mt-1 text-sm ${mutedCls}`}>Spending categories</p>
      </Card>
    </div>
  )
}
