import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, TrendingUp, Zap } from 'lucide-react'
import gemini from '../services/gemini'
import useStore from '../store'
import { Card, PageHeader, Button, EmptyState, LoadingCard, CopyButton, Badge, ProgressBar, GlassCard } from '../components/shared'
import { NICHES, PLATFORMS, scoreColor } from '../utils'
import toast from 'react-hot-toast'

const MOMENTUM_COLORS = {
  Exploding: '#ef4444',
  Rising: '#f97316',
  Stable: '#22c55e',
  Declining: '#6b7280',
}

// ==================== TRENDING DISCOVERY ====================
export function TrendingDiscovery() {
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('YouTube Shorts')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const { addToHistory } = useStore()

  const discover = async () => {
    setLoading(true)
    try {
      const res = await gemini.getTrending({ niche, platform })
      setData(res?.data)
      addToHistory({ type: 'Trends', title: niche || 'General trends' })
      toast.success('Trends loaded!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Trending Discovery" description="AI-powered trend analysis for your niche" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Niche</label>
            <input className="input-field" placeholder="Any niche (or leave blank)" value={niche} onChange={e => setNiche(e.target.value)} list="niches" />
            <datalist id="niches">{NICHES.map(n => <option key={n} value={n} />)}</datalist>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Platform</label>
            <select className="input-field" value={platform} onChange={e => setPlatform(e.target.value)}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={discover} loading={loading} icon={Search} className="w-full justify-center">Discover Trends</Button>
          </div>
        </div>
      </Card>

      {loading && <LoadingCard count={4} />}
      {!loading && !data && <EmptyState icon={TrendingUp} title="Discover what's trending" description="Find viral trends in your niche right now" />}

      {!loading && data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Insights */}
          {data.insights && (
            <GlassCard>
              <p className="text-sm text-[var(--text-secondary)]">📊 {data.insights}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.bestFormats?.map(f => <Badge key={f} color="purple">{f}</Badge>)}
                {data.peakPostTimes?.map(t => <Badge key={t} color="green">🕐 {t}</Badge>)}
              </div>
            </GlassCard>
          )}

          {/* Trending topics */}
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">🔥 Trending Topics</h2>
            <div className="grid gap-3">
              {data.trending?.map((trend, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-[var(--text-primary)]">{trend.topic}</h3>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ color: MOMENTUM_COLORS[trend.momentum] || '#888', background: `${MOMENTUM_COLORS[trend.momentum] || '#888'}15` }}
                          >
                            {trend.momentum}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">{trend.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold font-mono" style={{ color: scoreColor(trend.opportunity) }}>{trend.opportunity}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">opportunity</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <Badge>{trend.category}</Badge>
                      <Badge color={trend.competition === 'Low' ? 'green' : trend.competition === 'High' ? 'red' : 'yellow'}>
                        {trend.competition} competition
                      </Badge>
                      <Badge color="blue">{trend.estimatedLifespan}</Badge>
                    </div>
                    {trend.contentIdeas && (
                      <div className="space-y-1 pt-2 border-t border-[var(--border)]">
                        <p className="text-xs font-semibold text-[var(--text-muted)]">Content ideas:</p>
                        {trend.contentIdeas.map((idea, j) => (
                          <p key={j} className="text-xs text-[var(--text-secondary)] flex gap-1.5">
                            <span className="text-[var(--accent)] shrink-0">→</span>{idea}
                          </p>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Emerging niches */}
          {data.emergingNiches?.length > 0 && (
            <Card>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">🌱 Emerging Niches</h3>
              <div className="flex flex-wrap gap-2">
                {data.emergingNiches.map(n => (
                  <Badge key={n} color="green">{n}</Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Avoid */}
          {data.avoidTopics?.length > 0 && (
            <Card>
              <h3 className="text-sm font-bold text-[var(--text-muted)] mb-2">⚠️ Declining Topics to Avoid</h3>
              <div className="flex flex-wrap gap-2">
                {data.avoidTopics.map(t => <Badge key={t} color="red">{t}</Badge>)}
              </div>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}

// ==================== VIRAL KEYWORDS ====================
export function ViralKeywords() {
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('YouTube Shorts')
  const [loading, setLoading] = useState(false)
  const [keywords, setKeywords] = useState([])
  const [filter, setFilter] = useState('All')
  const { addToHistory } = useStore()

  const generate = async () => {
    if (!niche.trim()) { toast.error('Enter a niche'); return }
    setLoading(true)
    try {
      const res = await gemini.getViralKeywords({ niche, platform })
      setKeywords(res?.data?.keywords || [])
      addToHistory({ type: 'Keywords', title: niche })
      toast.success('Keywords found!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  const categories = ['All', ...new Set(keywords.map(k => k.category))]
  const filtered = filter === 'All' ? keywords : keywords.filter(k => k.category === filter)

  const TREND_COLORS = { Rising: '#22c55e', Stable: '#eab308', Declining: '#6b7280' }

  return (
    <div>
      <PageHeader title="Viral Keywords" description="Find high-impact keywords for titles, hooks, and descriptions" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Niche *</label>
            <input className="input-field" placeholder="e.g. Finance, Fitness..." value={niche} onChange={e => setNiche(e.target.value)} list="niches" />
            <datalist id="niches">{NICHES.map(n => <option key={n} value={n} />)}</datalist>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Platform</label>
            <select className="input-field" value={platform} onChange={e => setPlatform(e.target.value)}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={generate} loading={loading} icon={Zap} className="w-full justify-center">Find Keywords</Button>
          </div>
        </div>
      </Card>

      {loading && <LoadingCard count={5} />}
      {!loading && keywords.length === 0 && <EmptyState icon={Search} title="Find viral keywords" description="Discover the exact words that trigger clicks and views" />}

      {!loading && keywords.length > 0 && (
        <>
          <div className="flex gap-2 flex-wrap mb-4">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === c ? 'bg-[var(--purple)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid gap-2">
            {filtered.map((kw, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="group">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{kw.keyword}</span>
                        <span className="text-xs font-semibold" style={{ color: TREND_COLORS[kw.trend] || '#888' }}>
                          {kw.trend === 'Rising' ? '↑' : kw.trend === 'Declining' ? '↓' : '→'} {kw.trend}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Badge color="purple">{kw.category}</Badge>
                        <Badge color={kw.searchVolume === 'High' ? 'green' : kw.searchVolume === 'Medium' ? 'yellow' : 'default'}>
                          {kw.searchVolume} volume
                        </Badge>
                        <Badge color={kw.competition === 'Low' ? 'green' : kw.competition === 'High' ? 'red' : 'yellow'}>
                          {kw.competition} comp
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono" style={{ color: scoreColor(kw.viralPotential) }}>{kw.viralPotential}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">viral</div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text={kw.keyword} id={`kw-${i}`} />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => {
              const text = filtered.map(k => k.keyword).join(', ')
              navigator.clipboard.writeText(text)
              toast.success('All keywords copied!')
            }}>Copy All Keywords</Button>
          </div>
        </>
      )}
    </div>
  )
}
