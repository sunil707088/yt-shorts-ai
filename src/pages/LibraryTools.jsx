import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Clock, Download, Settings, Trash2, Search, FileText, File, Table, Copy } from 'lucide-react'
import useStore from '../store'
import { Card, PageHeader, Button, EmptyState, Badge, CopyButton, GlassCard } from '../components/shared'
import { formatRelativeTime, formatDate, downloadText, downloadCSV, downloadPDF, truncate } from '../utils'
import toast from 'react-hot-toast'

// ==================== SAVED LIBRARY ====================
export function SavedLibrary() {
  const { savedItems, removeItem, clearSaved } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const types = ['All', ...new Set(savedItems.map(i => i.type))]
  const filtered = savedItems.filter(item => {
    const matchesType = filter === 'All' || item.type === filter
    const matchesSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase()) || item.content?.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div>
      <PageHeader
        title="Saved Library"
        description={`${savedItems.length} saved items`}
        actions={savedItems.length > 0 && (
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => { clearSaved(); toast.success('Library cleared') }}>
            Clear All
          </Button>
        )}
      />

      {savedItems.length > 0 && (
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input className="input-field pl-9 text-sm" placeholder="Search saved..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${filter === t ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {savedItems.length === 0 && <EmptyState icon={Bookmark} title="Nothing saved yet" description="Save ideas, hooks, and scripts to access them later" />}

      <div className="grid gap-3">
        <AnimatePresence>
          {filtered.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              layout
            >
              <Card className="group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge color="purple">{item.type}</Badge>
                      <span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(item.savedAt)}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-0.5 truncate">{item.title}</h3>
                    {item.content && <p className="text-xs text-[var(--text-muted)]">{truncate(item.content, 100)}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {item.content && <CopyButton text={item.content} id={item.id} />}
                    <button
                      onClick={() => { removeItem(item.id); toast.success('Removed') }}
                      className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && search && (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">No results for "{search}"</p>
        )}
      </div>
    </div>
  )
}

// ==================== HISTORY ====================
export function History() {
  const { history, clearHistory } = useStore()
  const [search, setSearch] = useState('')

  const filtered = history.filter(h => !search || h.title?.toLowerCase().includes(search.toLowerCase()) || h.type?.toLowerCase().includes(search.toLowerCase()))

  const TYPE_COLORS = {
    Ideas: 'red', Script: 'purple', Hooks: 'yellow', Titles: 'blue',
    Hashtags: 'green', Analysis: 'blue', Performance: 'green', Trends: 'blue',
    Keywords: 'purple', Calendar: 'green', Series: 'yellow', Collabs: 'blue',
  }

  return (
    <div>
      <PageHeader
        title="History"
        description={`${history.length} generations`}
        actions={history.length > 0 && (
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => { clearHistory(); toast.success('History cleared') }}>
            Clear
          </Button>
        )}
      />

      {history.length > 0 && (
        <div className="mb-4 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input className="input-field pl-9 text-sm" placeholder="Search history..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {history.length === 0 && <EmptyState icon={Clock} title="No history yet" description="Your generation history will appear here" />}

      <div className="grid gap-2">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
            <Card className="py-3">
              <div className="flex items-center gap-3">
                <Badge color={TYPE_COLORS[item.type] || 'default'}>{item.type}</Badge>
                <span className="text-sm text-[var(--text-primary)] flex-1 truncate">{item.title}</span>
                <span className="text-xs text-[var(--text-muted)] shrink-0">{formatRelativeTime(item.timestamp)}</span>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && search && (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">No results for "{search}"</p>
        )}
      </div>
    </div>
  )
}

// ==================== EXPORT CENTER ====================
export function ExportCenter() {
  const { savedItems, history } = useStore()

  const exportTXT = () => {
    const content = savedItems.map(item =>
      `=== ${item.type}: ${item.title} ===\n${item.content || ''}\nSaved: ${formatDate(item.savedAt)}\n`
    ).join('\n')
    downloadText(content || 'No saved items', 'shorts-machine-export.txt')
    toast.success('Exported as TXT!')
  }

  const exportCSV = () => {
    const data = savedItems.map(item => ({
      Type: item.type,
      Title: item.title,
      Content: item.content || '',
      Saved: formatDate(item.savedAt),
    }))
    if (data.length === 0) { toast.error('No saved items to export'); return }
    downloadCSV(data, 'shorts-machine-export.csv')
    toast.success('Exported as CSV!')
  }

  const exportPDF = async () => {
    const content = savedItems.map(item =>
      `${item.type}: ${item.title}\n${item.content || ''}\nSaved: ${formatDate(item.savedAt)}\n\n`
    ).join('')
    if (!content.trim()) { toast.error('No saved items to export'); return }
    await downloadPDF(content, 'shorts-machine-export.pdf')
    toast.success('Exported as PDF!')
  }

  const exportHistory = () => {
    const data = history.map(h => ({
      Type: h.type,
      Title: h.title,
      Date: formatDate(h.timestamp),
    }))
    if (data.length === 0) { toast.error('No history to export'); return }
    downloadCSV(data, 'shorts-machine-history.csv')
    toast.success('History exported!')
  }

  return (
    <div>
      <PageHeader title="Export Center" description="Download your content in multiple formats" />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: FileText, label: 'Export as TXT', desc: 'Plain text file', color: '#06b6d4', action: exportTXT },
          { icon: Table, label: 'Export as CSV', desc: 'Spreadsheet format', color: '#22c55e', action: exportCSV },
          { icon: File, label: 'Export as PDF', desc: 'Formatted document', color: 'var(--accent)', action: exportPDF },
        ].map(exp => (
          <motion.div key={exp.label} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <button onClick={exp.action} className="card w-full p-5 text-center group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${exp.color}15` }}>
                <exp.icon size={22} style={{ color: exp.color }} />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">{exp.label}</h3>
              <p className="text-xs text-[var(--text-muted)]">{exp.desc}</p>
              <p className="text-xs font-mono mt-2" style={{ color: exp.color }}>{savedItems.length} items</p>
            </button>
          </motion.div>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Export History</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">{history.length} generation records</p>
        <Button variant="outline" size="sm" icon={Download} onClick={exportHistory}>Export History as CSV</Button>
      </Card>
    </div>
  )
}

// ==================== SETTINGS ====================
export function SettingsPage() {
  const { preferences, setPreference, theme, toggleTheme } = useStore()
  const { NICHES, TONES, PLATFORMS } = { NICHES: ['Finance & Investing', 'Fitness & Health', 'Tech & AI', 'Food & Cooking', 'Travel & Adventure'], TONES: ['Engaging', 'Educational', 'Entertaining', 'Inspirational', 'Humorous'], PLATFORMS: ['YouTube Shorts', 'TikTok', 'Instagram Reels'] }

  return (
    <div>
      <PageHeader title="Settings" description="Customize your Shorts Machine experience" />

      <div className="space-y-5">
        <Card>
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-primary)]">Dark Mode</p>
              <p className="text-xs text-[var(--text-muted)]">Toggle light/dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-[var(--accent)]' : 'bg-[var(--border-bright)]'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">Default Preferences</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Default Niche</label>
              <input
                className="input-field"
                placeholder="Your primary niche"
                value={preferences.defaultNiche}
                onChange={e => setPreference('defaultNiche', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Default Tone</label>
              <select className="input-field" value={preferences.defaultTone} onChange={e => setPreference('defaultTone', e.target.value)}>
                {['engaging', 'educational', 'entertaining', 'inspirational', 'humorous'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Default Platform</label>
              <select className="input-field" value={preferences.defaultPlatform} onChange={e => setPreference('defaultPlatform', e.target.value)}>
                {['youtube', 'tiktok', 'instagram'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">About</h3>
          <p className="text-xs text-[var(--text-muted)]">Shorts Machine AI v1.0.0</p>
          <p className="text-xs text-[var(--text-muted)]">Powered by Google Gemini 2.5 Flash</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">Build viral YouTube Shorts content with AI assistance</p>
        </Card>
      </div>
    </div>
  )
}
