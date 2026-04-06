import { Inbox } from 'lucide-react'

export function EmptyState({
  title = 'Nothing here yet',
  description = 'Try adjusting filters or add a transaction.',
  icon = Inbox,
}) {
  const IconGraphic = icon
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/40">
      <IconGraphic
        className="h-10 w-10 text-slate-300 dark:text-slate-600"
        aria-hidden
      />
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {title}
      </p>
      {description ? (
        <p className="max-w-sm text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  )
}
