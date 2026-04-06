import { DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { useFinance } from '../../hooks/useFinance.js'
import { formatCurrency } from '../../utils/format.js'
import { Card } from '../ui/Card.jsx'

export function SummaryCards() {
  const { totals, darkMode } = useFinance()
  const { balance, income, expense } = totals

  const savingsRate = useMemo(() => {
    if (income <= 0) return 0
    return Math.round(((income - expense) / income) * 1000) / 10
  }, [income, expense])

  const labelCls = darkMode ? 'text-slate-400' : 'text-slate-500'
  const valueCls = darkMode ? 'text-white' : 'text-slate-900'

  const cards = [
    {
      key: 'balance',
      label: 'Total Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      iconBg: 'bg-sky-600',
      iconRing: 'ring-sky-500/30',
    },
    {
      key: 'income',
      label: 'Total Income',
      value: formatCurrency(income),
      icon: TrendingUp,
      iconBg: 'bg-emerald-500',
      iconRing: 'ring-emerald-500/30',
    },
    {
      key: 'expense',
      label: 'Total Expenses',
      value: formatCurrency(expense),
      icon: TrendingDown,
      iconBg: 'bg-rose-500',
      iconRing: 'ring-rose-500/30',
    },
    {
      key: 'savings',
      label: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: DollarSign,
      iconBg: 'bg-teal-500',
      iconRing: 'ring-teal-500/30',
    },
  ]

  return (
    <section
      id="overview"
      className="scroll-mt-24"
      aria-labelledby="overview-heading"
    >
      <h2 id="overview-heading" className="sr-only">
        Overview
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-stagger">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <Card
              key={c.key}
              className="relative overflow-hidden pt-5 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={`text-xs font-medium uppercase tracking-wide ${labelCls}`}>
                    {c.label}
                  </p>
                  <p
                    className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${valueCls}`}
                  >
                    {c.value}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg ring-2 ${c.iconBg} ${c.iconRing}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
