import { useMemo } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useFinance } from '../../hooks/useFinance.js'
import { buildExpenseByCategory } from '../../utils/chartData.js'
import { formatCurrency } from '../../utils/format.js'
import { Card, CardTitle } from '../ui/Card.jsx'
import { EmptyState } from '../ui/EmptyState.jsx'

/** Order-aligned palette (teal → green → orange → purple → red → indigo → cyan) */
const COLORS = [
  '#14b8a6',
  '#22c55e',
  '#f97316',
  '#a855f7',
  '#ef4444',
  '#6366f1',
  '#0d9488',
]

export function SpendingBreakdown() {
  const { transactions, darkMode } = useFinance()
  const data = useMemo(
    () => buildExpenseByCategory(transactions),
    [transactions],
  )

  const tooltipBg = darkMode ? '#1e293b' : '#ffffff'
  const tooltipBorder = darkMode ? '#334155' : '#e2e8f0'
  const tooltipColor = darkMode ? '#f1f5f9' : '#0f172a'

  return (
    <Card className="flex min-h-[360px] flex-col">
      <div className="mb-4">
        <CardTitle>Spending Breakdown</CardTitle>
      </div>
      {data.length === 0 ? (
        <EmptyState
          title="No expense data"
          description="Expense categories will appear here once you log spending."
        />
      ) : (
        <div className="flex min-h-[260px] flex-1 flex-col gap-6 lg:flex-row lg:items-center">
          <div className="mx-auto h-[220px] w-full max-w-[260px] animate-fade-in-up lg:mx-0 lg:w-1/2">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={COLORS[i % COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: tooltipColor,
                  }}
                  formatter={(value, name) => [formatCurrency(value), name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex w-full flex-col gap-3 lg:w-1/2 lg:pl-2">
            {data.map((row, i) => (
              <li
                key={row.name}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    aria-hidden
                  />
                  <span className="truncate font-medium">{row.name}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatCurrency(row.value)}
                  </span>
                  <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {row.percent}%
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
