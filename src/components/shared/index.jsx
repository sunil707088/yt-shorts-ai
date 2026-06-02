import { motion } from 'framer-motion'
import { Copy, Check, Download, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { useCopy } from '../../hooks'
import { scoreColor } from '../../utils'

export function Button({ children, variant = 'primary', size = 'md', className = '', loading, icon: Icon, ...props }) {
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }
  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    outline: 'border border-[var(--border-bright)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--purple)] px-4 py-2 rounded-lg transition-all',
    danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-lg transition-all',
    success: 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 px-4 py-2 rounded-lg transition-all',
  }

  return (
    <button
      className={`inline-flex items-center gap-2 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : Icon ? <Icon size={15} /> : null}
      {children}
    </button>
  )
}

export function Card({ children, className = '', hover = true, glow, ...props }) {
  return (
    <div
      className={`card p-5 ${hover ? '' : 'hover:bg-[var(--bg-card)] hover:border-[var(--border)]'} ${glow ? 'glow-purple' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function GlassCard({ children, className = '', ...props }) {
  return (
    <div className={`glass rounded-2xl p-5 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function ScoreBadge({ score, label }) {
  const color = scoreColor(score)
  return (
    <span
      className="score-badge"
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
    >
      {score}
      {label && <span style={{ color: `${color}99` }}>{label}</span>}
    </span>
  )
}

export function CopyButton({ text, id, size = 16 }) {
  const { copied, copy } = useCopy()
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => copy(text, id)}
      className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
      title="Copy"
    >
      {copied === id ? <Check size={size} className="text-green-400" /> : <Copy size={size} />}
    </motion.button>
  )
}

export function SaveButton({ item, saved, onSave, onRemove }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => saved ? onRemove() : onSave()}
      className={`p-1.5 rounded-md transition-all ${saved ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'} hover:bg-white/5`}
      title={saved ? 'Unsave' : 'Save'}
    >
      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
    </motion.button>
  )
}

export function Skeleton({ className = '', lines = 1 }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`shimmer rounded-lg h-4 ${i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function LoadingCard({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="space-y-3">
          <Skeleton />
          <Skeleton lines={2} />
          <div className="flex gap-2">
            <div className="shimmer rounded-full h-6 w-16" />
            <div className="shimmer rounded-full h-6 w-20" />
          </div>
        </Card>
      ))}
    </>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
          <Icon size={24} className="text-[var(--text-muted)]" />
        </div>
      )}
      <h3 className="text-[var(--text-primary)] font-semibold mb-1">{title}</h3>
      <p className="text-[var(--text-muted)] text-sm max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Badge({ children, color = 'default' }) {
  const colors = {
    default: 'bg-white/5 text-[var(--text-secondary)] border-[var(--border)]',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }
  return (
    <span className={`tag ${colors[color]}`}>{children}</span>
  )
}

export function Select({ label, options, value, onChange, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-field appearance-none cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Input({ label, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">{label}</label>}
      <input className="input-field" {...props} />
    </div>
  )
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">{label}</label>}
      <textarea className="input-field resize-none" {...props} />
    </div>
  )
}

export function ProgressBar({ value, max = 100, color }) {
  const pct = Math.min(100, (value / max) * 100)
  const c = color || scoreColor(pct)
  return (
    <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: c }}
      />
    </div>
  )
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] gradient-text">{title}</h1>
        {description && <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            active === tab.id
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          {active === tab.id && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute inset-0 bg-[var(--bg-card)] rounded-lg"
              style={{ zIndex: 0 }}
            />
          )}
          <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            {tab.icon && <tab.icon size={14} />}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}

export function ResultCard({ title, content, onSave, onCopy, saved, type, extra }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onSave && <SaveButton saved={saved} onSave={onSave} />}
          {onCopy && <CopyButton text={content} id={title} />}
        </div>
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{content}</p>
      {extra}
    </motion.div>
  )
}
