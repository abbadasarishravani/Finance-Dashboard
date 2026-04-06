import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useFinance } from '../../hooks/useFinance.js'
import { buildMonthlyIncomeExpenseBars } from '../../utils/chartData.js'
import { formatCurrency } from '../../utils/format.js'
import { Card, CardTitle } from '../ui/Card.jsx'
import { EmptyState } from '../ui/EmptyState.jsx'

export function MonthlyIncomeExpenseChart() {
  const { transactions, darkMode } = useFinance()
  const data = useMemo(
    () => buildMonthlyIncomeExpenseBars(transactions),
    [transactions],
  )

  const maxY = useMemo(() => {
    let m = 0
    for (const row of data) {
      m = Math.max(m, row.income, row.expense)
    }
    return m > 0 ? Math.ceil(m / 1000) * 1000 + 1000 : 8000
  }, [data])

  const gridColor = darkMode ? '#334155' : '#e2e8f0'
  const axisColor = darkMode ? '#94a3b8' : '#64748b'
  const tooltipBg = darkMode ? '#1e293b' : '#ffffff'
  const tooltipBorder = darkMode ? '#334155' : '#e2e8f0'
  const tooltipColor = darkMode ? '#f8fafc' : '#0f172a'
  const cursorFill = darkMode
    ? 'rgba(148, 163, 184, 0.12)'
    : 'rgba(15, 23, 42, 0.06)'

  return (
    <Card className="flex min-h-[360px] flex-col">
      <div className="mb-4">
        <CardTitle>Monthly Income vs Expenses</CardTitle>
      </div>
      {data.length === 0 ? (
        <EmptyState
          title="No monthly data"
          description="Add dated transactions to compare income and expenses by month."
        />
      ) : (
        <div className="h-[300px] w-full animate-fade-in-up">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 4, bottom: 8 }}
              barGap={4}
              barCategoryGap="18%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical
                horizontal
              />
              <XAxis
                dataKey="shortLabel"
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: axisColor, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, maxY]}
                tickFormatter={(v) =>
                  `$${v >= 1000 ? `${(v / 1000).toFixed(1)}` : '0.0'}k`
                }
              />
              <Tooltip
                cursor={{ fill: cursorFill }}
                contentStyle={{
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: tooltipColor,
                }}
                formatter={(value, name) => [
                  formatCurrency(value),
                  name === 'income' ? 'Income' : 'Expenses',
                ]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.shortLabel ?? ''
                }
              />
              <Bar
                dataKey="income"
                name="income"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
              <Bar
                dataKey="expense"
                name="expense"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
