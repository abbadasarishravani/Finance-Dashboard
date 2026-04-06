import { useMemo } from 'react'
import { Lightbulb, Sparkles } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance.js'
import { computeInsights } from '../../utils/insights.js'
import { Card, CardTitle } from '../ui/Card.jsx'
import { EmptyState } from '../ui/EmptyState.jsx'

const toneStyles = {
  good: 'border-emerald-200/80 bg-emerald-50/90 dark:border-emerald-900/50 dark:bg-emerald-950/30',
  warn: 'border-amber-200/80 bg-amber-50/90 dark:border-amber-900/50 dark:bg-amber-950/30',
  neutral:
    'border-slate-200/80 bg-slate-50/90 dark:border-slate-700/80 dark:bg-slate-800/50',
}

export function InsightsSection() {
  const { transactions } = useFinance()
  const { empty, items } = useMemo(
    () => computeInsights(transactions),
    [transactions],
  )

  return (
    <section
      id="insights"
      className="scroll-mt-24"
      aria-labelledby="insights-heading"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
          <Sparkles className="h-4 w-4" aria-hidden />
        </div>
        <div>
          <h2
            id="insights-heading"
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Insights
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Highlights from your data — updates as you edit transactions.
          </p>
        </div>
      </div>

      {empty ? (
        <EmptyState
          title="No insights yet"
          description="Add income and expense transactions to unlock comparisons."
          icon={Lightbulb}
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <Card
                className={`h-full border ${toneStyles[item.tone] || toneStyles.neutral}`}
              >
                <CardTitle className="!mb-2 !text-sm !font-semibold !text-slate-700 dark:!text-slate-200">
                  {item.title}
                </CardTitle>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.detail}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
