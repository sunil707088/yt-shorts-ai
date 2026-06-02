import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, GitBranch, Users, Sparkles, Plus, Trash2 } from 'lucide-react'
import gemini from '../services/gemini'
import useStore from '../store'
import { Card, PageHeader, Button, EmptyState, LoadingCard, Badge, GlassCard } from '../components/shared'
import { NICHES } from '../utils'
import toast from 'react-hot-toast'

// ==================== CONTENT CALENDAR ====================
export function ContentCalendar() {
  const [niche, setNiche] = useState('')
  const [frequency, setFrequency] = useState('3')
  const [duration, setDuration] = useState('4')
  const [goals, setGoals] = useState('Grow to 10K subscribers')
  const [loading, setLoading] = useState(false)
  const [calendar, setCalendar] = useState(null)
  const { calendarItems, addCalendarItem, removeCalendarItem, addToHistory } = useStore()

  const generate = async () => {
    if (!niche.trim()) { toast.error('Enter your niche'); return }
    setLoading(true)
    try {
      const res = await gemini.generateCalendar({ niche, frequency, duration, goals })
      setCalendar(res?.data)
      addToHistory({ type: 'Calendar', title: niche })
      toast.success('Calendar generated!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  const DAY_COLORS = {
    Monday: '#ef4444', Tuesday: '#f97316', Wednesday: '#eab308',
    Thursday: '#22c55e', Friday: '#06b6d4', Saturday: '#8b5cf6', Sunday: '#ec4899'
  }

  return (
    <div>
      <PageHeader title="Content Calendar" description="AI-generated posting schedule tailored to your goals" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Niche *</label>
            <input className="input-field" placeholder="Your niche" value={niche} onChange={e => setNiche(e.target.value)} list="niches" />
            <datalist id="niches">{NICHES.map(n => <option key={n} value={n} />)}</datalist>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Posts per week</label>
            <select className="input-field" value={frequency} onChange={e => setFrequency(e.target.value)}>
              {['1', '2', '3', '5', '7'].map(f => <option key={f} value={f}>{f}x/week</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Duration</label>
            <select className="input-field" value={duration} onChange={e => setDuration(e.target.value)}>
              {[['2', '2 weeks'], ['4', '4 weeks'], ['8', '8 weeks'], ['12', '12 weeks']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Goal</label>
            <input className="input-field" placeholder="e.g. 10K subs" value={goals} onChange={e => setGoals(e.target.value)} />
          </div>
        </div>
        <Button onClick={generate} loading={loading} icon={Sparkles}>Generate Calendar</Button>
      </Card>

      {loading && <LoadingCard count={3} />}
      {!loading && !calendar && <EmptyState icon={Calendar} title="Generate your content calendar" description="A structured posting schedule optimized for growth" />}

      {!loading && calendar && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {calendar.strategy && (
            <GlassCard>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">📋 Strategy</h3>
              <p className="text-sm text-[var(--text-secondary)]">{calendar.strategy}</p>
              {calendar.milestones?.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {calendar.milestones.map((m, i) => <Badge key={i} color="green">🎯 {m}</Badge>)}
                </div>
              )}
            </GlassCard>
          )}

          {calendar.weeks?.map((week, wi) => (
            <Card key={wi}>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">
                Week {week.week} {week.theme && <span className="text-[var(--text-muted)] font-normal">— {week.theme}</span>}
              </h3>
              <div className="grid gap-2">
                {week.posts?.map((post, pi) => (
                  <div key={pi} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]">
                    <div
                      className="w-14 text-center py-1 rounded-lg text-xs font-bold shrink-0"
                      style={{ color: DAY_COLORS[post.day] || '#888', background: `${DAY_COLORS[post.day] || '#888'}15` }}
                    >
                      {post.day?.slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] mb-0.5">{post.title}</p>
                      {post.hook && <p className="text-xs text-[var(--text-muted)] truncate">Hook: "{post.hook}"</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Badge color={post.format?.includes('Tutorial') ? 'blue' : 'purple'}>{post.format}</Badge>
                      <Badge color={post.priority === 'High' ? 'red' : post.priority === 'Low' ? 'default' : 'yellow'}>{post.priority}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  )
}

// ==================== SERIES PLANNER ====================
export function SeriesPlanner() {
  const [niche, setNiche] = useState('')
  const [topic, setTopic] = useState('')
  const [episodeCount, setEpisodeCount] = useState('5')
  const [loading, setLoading] = useState(false)
  const [series, setSeries] = useState(null)
  const { addSeries: saveSeries, series: savedSeries, removeSeries, addToHistory } = useStore()

  const generate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return }
    setLoading(true)
    try {
      const res = await gemini.generateSeries({ niche, topic, episodeCount })
      setSeries(res?.data)
      addToHistory({ type: 'Series', title: topic })
      toast.success('Series planned!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Series Planner" description="Plan a binge-worthy episodic Shorts series" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Topic *</label>
            <input className="input-field" placeholder="Series topic" value={topic} onChange={e => setTopic(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Niche</label>
            <input className="input-field" placeholder="Optional" value={niche} onChange={e => setNiche(e.target.value)} list="niches" />
            <datalist id="niches">{NICHES.map(n => <option key={n} value={n} />)}</datalist>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Episodes</label>
            <select className="input-field" value={episodeCount} onChange={e => setEpisodeCount(e.target.value)}>
              {['3', '5', '7', '10', '15'].map(n => <option key={n} value={n}>{n} episodes</option>)}
            </select>
          </div>
        </div>
        <Button onClick={generate} loading={loading} icon={Sparkles}>Plan Series</Button>
      </Card>

      {loading && <LoadingCard count={4} />}
      {!loading && !series && <EmptyState icon={GitBranch} title="Plan your series" description="Create episodic content that keeps viewers coming back" />}

      {!loading && series && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <GlassCard>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">{series.seriesName}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{series.concept}</p>
              </div>
              <Button variant="outline" size="sm" icon={Plus}
                onClick={() => { saveSeries({ title: series.seriesName, topic, data: series }); toast.success('Series saved!') }}>
                Save
              </Button>
            </div>
          </GlassCard>

          <div className="grid gap-3">
            {series.episodes?.map((ep, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <Card>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-sm font-bold shrink-0">
                      {ep.number}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">{ep.title}</h4>
                      <p className="text-xs text-[var(--accent)] mb-2">Hook: "{ep.hook}"</p>
                      {ep.keyPoints && (
                        <ul className="space-y-0.5 mb-2">
                          {ep.keyPoints.map((p, j) => <li key={j} className="text-xs text-[var(--text-secondary)] flex gap-1"><span className="text-[var(--purple)] shrink-0">•</span>{p}</li>)}
                        </ul>
                      )}
                      {ep.cliffhanger && (
                        <p className="text-xs text-[var(--text-muted)] italic">🎬 "{ep.cliffhanger}"</p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {series.brandingTips && (
            <Card>
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2">🎨 Branding Tips</h4>
              {series.brandingTips.map((t, i) => <p key={i} className="text-xs text-[var(--text-secondary)] flex gap-1.5 mb-1"><span className="text-[var(--purple)]">→</span>{t}</p>)}
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}

// ==================== COLLAB IDEAS ====================
export function CollabIdeas() {
  const [niche, setNiche] = useState('')
  const [audience, setAudience] = useState('Gen Z (18-24)')
  const [style, setStyle] = useState('Casual & Entertaining')
  const [loading, setLoading] = useState(false)
  const [collabs, setCollabs] = useState([])
  const { addToHistory } = useStore()

  const generate = async () => {
    if (!niche.trim()) { toast.error('Enter your niche'); return }
    setLoading(true)
    try {
      const res = await gemini.generateCollabs({ niche, audience, style })
      setCollabs(res?.data?.collabs || [])
      addToHistory({ type: 'Collabs', title: niche })
      toast.success('Collab ideas generated!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Collab Ideas" description="Creative collaboration concepts to grow your audience" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Your niche *</label>
            <input className="input-field" placeholder="e.g. Fitness" value={niche} onChange={e => setNiche(e.target.value)} list="niches" />
            <datalist id="niches">{NICHES.map(n => <option key={n} value={n} />)}</datalist>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Audience</label>
            <select className="input-field" value={audience} onChange={e => setAudience(e.target.value)}>
              {['Gen Z (18-24)', 'Millennials (25-34)', 'Mixed', 'Professionals', 'Students'].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Content style</label>
            <select className="input-field" value={style} onChange={e => setStyle(e.target.value)}>
              {['Casual & Entertaining', 'Educational', 'Motivational', 'Comedy', 'Controversial', 'Storytelling'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <Button onClick={generate} loading={loading} icon={Sparkles}>Generate Collab Ideas</Button>
      </Card>

      {loading && <LoadingCard count={4} />}
      {!loading && collabs.length === 0 && <EmptyState icon={Users} title="Find collab opportunities" description="Creative partnership ideas for viral growth" />}

      {!loading && collabs.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {collabs.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="h-full">
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">{c.concept}</h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge color="blue">{c.format}</Badge>
                  <Badge color="purple">{c.partnerType}</Badge>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">{c.mutualBenefit}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)]">
                  <div>
                    <div className="text-[10px] text-[var(--text-muted)] mb-0.5">Viral potential</div>
                    <div className="text-sm font-bold font-mono" style={{ color: c.viralPotential >= 70 ? '#22c55e' : '#eab308' }}>{c.viralPotential}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--text-muted)] mb-0.5">Difficulty</div>
                    <div className="text-sm font-bold font-mono" style={{ color: c.difficulty <= 40 ? '#22c55e' : c.difficulty <= 70 ? '#eab308' : '#ef4444' }}>{c.difficulty}%</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
