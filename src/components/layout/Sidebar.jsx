import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Lightbulb, FileText, Zap, Target, Type, Hash,
  Image, User, RefreshCw, ArrowLeftRight, Share2, BarChart2,
  TrendingUp, Search, MessageSquare, Layers, Calendar, GitBranch,
  Users, Bookmark, Clock, Download, Settings, ChevronLeft,
  Youtube, Sparkles
} from 'lucide-react'
import useStore from '../../store'

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/ideas', icon: Lightbulb, label: 'Idea Generator' },
      { to: '/script', icon: FileText, label: 'Script Generator' },
      { to: '/hooks', icon: Zap, label: 'Hook Generator' },
    ]
  },
  {
    label: 'Content Tools',
    items: [
      { to: '/cta', icon: Target, label: 'CTA Generator' },
      { to: '/titles', icon: Type, label: 'Title Generator' },
      { to: '/hashtags', icon: Hash, label: 'Hashtag Generator' },
      { to: '/thumbnail', icon: Image, label: 'Thumbnail Text' },
      { to: '/bio', icon: User, label: 'Bio Generator' },
      { to: '/rewriter', icon: RefreshCw, label: 'Script Rewriter' },
    ]
  },
  {
    label: 'Advanced',
    items: [
      { to: '/converter', icon: ArrowLeftRight, label: 'Long→Shorts' },
      { to: '/repurpose', icon: Share2, label: 'Content Repurposer' },
      { to: '/analyzer', icon: BarChart2, label: 'Viral Analyzer' },
      { to: '/predictor', icon: TrendingUp, label: 'Performance Predictor' },
      { to: '/trends', icon: Search, label: 'Trending Discovery' },
      { to: '/keywords', icon: Sparkles, label: 'Viral Keywords' },
    ]
  },
  {
    label: 'Strategy',
    items: [
      { to: '/assistant', icon: MessageSquare, label: 'AI Assistant' },
      { to: '/multi-platform', icon: Layers, label: 'Multi-Platform' },
      { to: '/calendar', icon: Calendar, label: 'Content Calendar' },
      { to: '/series', icon: GitBranch, label: 'Series Planner' },
      { to: '/collabs', icon: Users, label: 'Collab Ideas' },
    ]
  },
  {
    label: 'Library',
    items: [
      { to: '/saved', icon: Bookmark, label: 'Saved Library' },
      { to: '/history', icon: Clock, label: 'History' },
      { to: '/export', icon: Download, label: 'Export Center' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ]
  }
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, stats } = useStore()
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 0, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full z-30 overflow-hidden flex-shrink-0"
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
      >
        <div className="w-[260px] h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 20px var(--accent-glow)' }}>
                <Youtube size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)] font-display leading-tight">Shorts Machine</div>
                <div className="text-[10px] text-[var(--text-muted)]">AI Content Studio</div>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Stats pills */}
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <div className="flex gap-2">
              <div className="flex-1 text-center py-2 rounded-lg bg-[var(--bg-card)]">
                <div className="text-lg font-bold text-[var(--accent)] font-mono">{stats.totalGenerations}</div>
                <div className="text-[10px] text-[var(--text-muted)]">Generated</div>
              </div>
              <div className="flex-1 text-center py-2 rounded-lg bg-[var(--bg-card)]">
                <div className="text-lg font-bold text-[var(--purple)] font-mono">{stats.ideasGenerated}</div>
                <div className="text-[10px] text-[var(--text-muted)]">Ideas</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
            {NAV_GROUPS.map(group => (
              <div key={group.label}>
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-1">
                  {group.label}
                </div>
                {group.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `sidebar-item ${isActive ? 'active' : ''}`
                    }
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--border)]">
            <div className="text-xs text-[var(--text-muted)] text-center">
              Powered by Gemini 2.5 Flash
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
