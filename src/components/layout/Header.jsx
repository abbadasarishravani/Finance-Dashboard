import { Eye, Moon, Shield, Sun } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance.js'

export function Header() {
  const { role, setRole, darkMode, toggleDarkMode } = useFinance()

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        darkMode
          ? 'border-slate-800/80 bg-[#0f172a]/90'
          : 'border-slate-200/80 bg-white/90'
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-lg font-bold text-white shadow-lg shadow-sky-500/30">
            F
          </div>
          <span
            className={`text-xl font-bold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            FinDash
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`hidden text-sm sm:inline ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Role:
          </span>
          <div
            className={`inline-flex rounded-xl border p-1 ${
              darkMode
                ? 'border-slate-700/80 bg-slate-900/80'
                : 'border-slate-200 bg-slate-100'
            }`}
            role="group"
            aria-label="Role"
          >
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : darkMode
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Shield className="h-4 w-4" aria-hidden />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('viewer')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                role === 'viewer'
                  ? darkMode
                    ? 'bg-slate-700 text-white'
                    : 'bg-white text-slate-900 shadow-sm'
                  : darkMode
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className="h-4 w-4" aria-hidden />
              Viewer
            </button>
          </div>

          <button
            type="button"
            onClick={toggleDarkMode}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
              darkMode
                ? 'border-slate-700 bg-slate-800/80 text-amber-300 hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50'
            }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
