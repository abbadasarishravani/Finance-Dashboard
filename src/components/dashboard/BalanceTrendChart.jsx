import { useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useFinance } from '../../hooks/useFinance.js'
import { buildMonthlyMultiLineSeries } from '../../utils/chartData.js'
import { formatCurrency } from '../../utils/format.js'
import { Card, CardTitle } from '../ui/Card.jsx'
import { EmptyState } from '../ui/EmptyState.jsx'

export function BalanceTrendChart() {
  const { transactions, darkMode } = useFinance()
  const data = useMemo(
    () => buildMonthlyMultiLineSeries(transactions),
    [transactions],
  )

  const maxY = useMemo(() => {
    let m = 0
    for (const row of data) {
      m = Math.max(m, row.income, row.expense, row.balance)
    }
    return m > 0 ? Math.ceil(m / 1000) * 1000 + 1000 : 8000
  }, [data])

  const gridColor = darkMode ? '#334155' : '#e2e8f0'
  const axisColor = darkMode ? '#94a3b8' : '#64748b'
  const tooltipBg = darkMode ? '#1e293b' : '#ffffff'
  const tooltipBorder = darkMode ? '#334155' : '#e2e8f0'
  const tooltipColor = darkMode ? '#f8fafc' : '#0f172a'

  return (
    <Card className="flex min-h-[360px] flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <CardTitle>Balance Trend</CardTitle>
        <span className="text-xs text-slate-500 dark:text-slate-500">
          Income, expenses & cumulative balance
        </span>
      </div>
      {data.length === 0 ? (
        <EmptyState
          title="No trend yet"
          description="Add transactions with dates to see trends across months."
        />
      ) : (
        <div className="h-[300px] w-full animate-fade-in-up">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: 4, bottom: 8 }}
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
                contentStyle={{
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: tooltipColor,
                }}
                formatter={(value, name) => [formatCurrency(value), name]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label ?? ''
                }
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                formatter={(value) => (
                  <span
                    className={darkMode ? 'text-slate-300' : 'text-slate-600'}
                  >
                    {value}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Expenses"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="Balance"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

