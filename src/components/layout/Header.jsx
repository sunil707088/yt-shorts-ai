import { motion } from 'framer-motion'
import { Menu, Sun, Moon, Bell } from 'lucide-react'
import useStore from '../../store'

export default function Header({ title }) {
  const { toggleSidebar, sidebarOpen, theme, toggleTheme } = useStore()

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]"
      style={{ background: 'var(--bg-primary)', backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
          >
            <Menu size={18} />
          </button>
        )}
        {title && (
          <h2 className="text-sm font-semibold text-[var(--text-secondary)]">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </motion.button>
      </div>
    </header>
  )
}
