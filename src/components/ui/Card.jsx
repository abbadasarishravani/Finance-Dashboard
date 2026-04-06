export function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-200/50 backdrop-blur-sm transition-shadow duration-300 hover:shadow-md dark:border-slate-700/60 dark:bg-[#1e293b]/90 dark:shadow-lg dark:shadow-black/20 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', id }) {
  return (
    <h3
      id={id}
      className={`text-base font-bold tracking-tight text-slate-900 dark:text-white ${className}`}
    >
      {children}
    </h3>
  )
}
