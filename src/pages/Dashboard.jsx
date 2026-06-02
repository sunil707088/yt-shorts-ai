import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Lightbulb, FileText, Zap, TrendingUp, Bookmark, Clock,
  BarChart2, Sparkles, ArrowRight, Youtube, Flame, Target
} from 'lucide-react'
import useStore from '../store'
import { Card, GlassCard, ScoreBadge, PageHeader } from '../components/shared'
import { formatRelativeTime, truncate } from '../utils'

const QUICK_ACTIONS = [
  { to: '/ideas', icon: Lightbulb, label: 'Generate Ideas', color: '#ff3b2a', desc: '30 viral ideas' },
  { to: '/script', icon: FileText, label: 'Write Script', color: '#7c5af6', desc: 'Full script + hooks' },
  { to: '/hooks', icon: Zap, label: 'Create Hooks', color: '#eab308', desc: '20 viral hooks' },
  { to: '/analyzer', icon: BarChart2, label: 'Analyze Content', color: '#22c55e', desc: 'Viral score' },
  { to: '/trends', icon: TrendingUp, label: 'Find Trends', color: '#06b6d4', desc: 'Trending now' },
  { to: '/assistant', icon: Sparkles, label: 'AI Chat', color: '#f472b6', desc: 'Ask anything' },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Dashboard() {
  const { stats, savedItems, history } = useStore()
  const recentHistory = history.slice(0, 5)

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--purple)]/10" />
        </div>
        <GlassCard className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center" style={{ boxShadow: '0 0 20px var(--accent-glow)' }}>
                  <Youtube size={16} className="text-white" />
                </div>
                <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest">Shorts Machine AI</span>
              </div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                Create Viral <span className="gradient-text">Shorts</span>
              </h1>
              <p className="text-[var(--text-muted)] text-sm max-w-md">
                AI-powered content generation engine. Generate ideas, scripts, hooks, and strategies that consistently go viral.
              </p>
            </div>
            <div className="hidden md:block text-6xl animate-float">🚀</div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Total Generations', value: stats.totalGenerations, icon: Flame, color: 'var(--accent)' },
          { label: 'Ideas Created', value: stats.ideasGenerated, icon: Lightbulb, color: '#eab308' },
          { label: 'Scripts Written', value: stats.scriptsGenerated, icon: FileText, color: 'var(--purple)' },
          { label: 'Saved Items', value: savedItems.length, icon: Bookmark, color: '#22c55e' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="text-center py-4">
              <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Target size={16} className="text-[var(--accent)]" />
          Quick Actions
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {QUICK_ACTIONS.map(action => (
            <motion.div key={action.to} variants={item}>
              <Link to={action.to}>
                <Card className="cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: `${action.color}15` }}
                    >
                      <action.icon size={18} style={{ color: action.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{action.label}</div>
                      <div className="text-xs text-[var(--text-muted)]">{action.desc}</div>
                    </div>
                    <ArrowRight size={14} className="text-[var(--text-muted)] ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recent + Saved */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Clock size={15} className="text-[var(--text-muted)]" />
              Recent Activity
            </h2>
            <Link to="/history" className="text-xs text-[var(--purple)] hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {recentHistory.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-sm text-[var(--text-muted)]">No activity yet. Start generating!</p>
              </Card>
            ) : (
              recentHistory.map(h => (
                <Card key={h.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[var(--text-primary)] truncate">{h.title || h.type}</div>
                      <div className="text-xs text-[var(--text-muted)]">{formatRelativeTime(h.timestamp)}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] shrink-0">{h.type}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Saved */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Bookmark size={15} className="text-[var(--text-muted)]" />
              Saved Items
            </h2>
            <Link to="/saved" className="text-xs text-[var(--purple)] hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {savedItems.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-sm text-[var(--text-muted)]">Nothing saved yet. Save your best ideas!</p>
              </Card>
            ) : (
              savedItems.slice(0, 5).map(item => (
                <Card key={item.id} className="py-3">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</div>
                      <div className="text-xs text-[var(--text-muted)]">{truncate(item.content || item.description, 60)}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] shrink-0">{item.type}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
