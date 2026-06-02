import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Type, Hash, Image, User, Sparkles } from 'lucide-react'
import gemini from '../services/gemini'
import useStore from '../store'
import { Card, PageHeader, Button, EmptyState, LoadingCard, CopyButton, SaveButton, Badge, ProgressBar } from '../components/shared'
import { NICHES, PLATFORMS, scoreColor } from '../utils'
import toast from 'react-hot-toast'

// ==================== CTA GENERATOR ====================
export function CTAGenerator() {
  const [topic, setTopic] = useState('')
  const [goal, setGoal] = useState('Subscribe')
  const [loading, setLoading] = useState(false)
  const [ctas, setCtas] = useState([])
  const { saveItem, addToHistory } = useStore()

  const generate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return }
    setLoading(true)
    try {
      const res = await gemini.generateCTAs({ topic, goal })
      setCtas(res?.data?.ctas || [])
      addToHistory({ type: 'CTAs', title: topic })
      toast.success('CTAs generated!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="CTA Generator" description="15 powerful calls-to-action for your Shorts" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Topic *</label>
            <input className="input-field" placeholder="Video topic" value={topic} onChange={e => setTopic(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Goal</label>
            <select className="input-field" value={goal} onChange={e => setGoal(e.target.value)}>
              {['Subscribe', 'Follow', 'Like', 'Comment', 'Share', 'Visit Website', 'Buy', 'DM Me'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <Button onClick={generate} loading={loading} icon={Sparkles}>Generate CTAs</Button>
      </Card>
      {loading && <LoadingCard count={3} />}
      {!loading && ctas.length === 0 && <EmptyState icon={Target} title="No CTAs yet" description="Generate powerful calls to action" />}
      {!loading && ctas.length > 0 && (
        <div className="grid gap-2">
          {ctas.map((cta, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-1">"{cta.text}"</p>
                    <div className="flex gap-2">
                      <Badge color="blue">{cta.type}</Badge>
                      <Badge color={cta.urgency === 'High' ? 'red' : cta.urgency === 'Medium' ? 'yellow' : 'default'}>{cta.urgency} urgency</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={cta.text} id={`cta-${i}`} />
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

// ==================== TITLE GENERATOR ====================
export function TitleGenerator() {
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('')
  const [loading, setLoading] = useState(false)
  const [titles, setTitles] = useState([])
  const { addToHistory } = useStore()

  const generate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return }
    setLoading(true)
    try {
      const res = await gemini.generateTitles({ topic, niche })
      setTitles(res?.data?.titles || [])
      addToHistory({ type: 'Titles', title: topic })
      toast.success('Titles generated!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Title Generator" description="20 viral YouTube Shorts titles with SEO scores" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Topic *</label>
            <input className="input-field" placeholder="Video topic" value={topic} onChange={e => setTopic(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Niche</label>
            <input className="input-field" placeholder="Optional" value={niche} onChange={e => setNiche(e.target.value)} list="niches" />
            <datalist id="niches">{NICHES.map(n => <option key={n} value={n} />)}</datalist>
          </div>
        </div>
        <Button onClick={generate} loading={loading} icon={Sparkles}>Generate Titles</Button>
      </Card>
      {loading && <LoadingCard count={5} />}
      {!loading && titles.length === 0 && <EmptyState icon={Type} title="No titles yet" description="Generate viral titles for your Shorts" />}
      {!loading && titles.length > 0 && (
        <div className="grid gap-2">
          {titles.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-2">{t.text}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ l: 'Clickbait', v: t.clickbaitScore }, { l: 'Clarity', v: t.clarityScore }, { l: 'SEO', v: t.seoScore }].map(s => (
                        <div key={s.l}>
                          <div className="flex justify-between text-[10px] mb-0.5">
                            <span className="text-[var(--text-muted)]">{s.l}</span>
                            <span className="font-mono" style={{ color: scoreColor(s.v) }}>{s.v}</span>
                          </div>
                          <ProgressBar value={s.v} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={t.text} id={`title-${i}`} />
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

// ==================== HASHTAG GENERATOR ====================
export function HashtagGenerator() {
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('YouTube Shorts')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const { addToHistory } = useStore()

  const generate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return }
    setLoading(true)
    try {
      const res = await gemini.generateHashtags({ topic, niche, platform })
      setData(res?.data)
      addToHistory({ type: 'Hashtags', title: topic })
      toast.success('Hashtags generated!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  const allTags = data ? [...(data.primary||[]), ...(data.niche||[]), ...(data.trending||[]), ...(data.long_tail||[])].slice(0, data.optimal_count || 8) : []

  return (
    <div>
      <PageHeader title="Hashtag Generator" description="Optimal hashtag strategy for maximum reach" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Topic *</label>
            <input className="input-field" placeholder="Video topic" value={topic} onChange={e => setTopic(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Niche</label>
            <input className="input-field" placeholder="Optional" value={niche} onChange={e => setNiche(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Platform</label>
            <select className="input-field" value={platform} onChange={e => setPlatform(e.target.value)}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <Button onClick={generate} loading={loading} icon={Sparkles}>Generate Hashtags</Button>
      </Card>
      {loading && <LoadingCard count={2} />}
      {!loading && !data && <EmptyState icon={Hash} title="No hashtags yet" description="Generate optimized hashtags for your content" />}
      {!loading && data && (
        <div className="space-y-4">
          {/* Optimal Set */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">✨ Optimal Set ({data.optimal_count} tags)</h3>
              <CopyButton text={allTags.join(' ')} id="all-hashtags" />
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(h => (
                <button key={h} onClick={() => { navigator.clipboard.writeText(h); toast.success('Copied!') }}
                  className="tag hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all cursor-pointer">
                  {h}
                </button>
              ))}
            </div>
            {data.strategy && <p className="text-xs text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--border)]">{data.strategy}</p>}
          </Card>
          {[
            { key: 'primary', label: '🔥 High Volume', color: 'red' },
            { key: 'niche', label: '🎯 Niche Specific', color: 'purple' },
            { key: 'trending', label: '📈 Trending', color: 'green' },
            { key: 'long_tail', label: '🔍 Long Tail', color: 'blue' },
          ].map(cat => data[cat.key]?.length > 0 && (
            <Card key={cat.key}>
              <h4 className="text-xs font-bold text-[var(--text-muted)] mb-2">{cat.label}</h4>
              <div className="flex flex-wrap gap-1.5">
                {data[cat.key].map(h => (
                  <button key={h} onClick={() => { navigator.clipboard.writeText(h); toast.success('Copied!') }}
                    className="tag hover:opacity-80 transition-opacity cursor-pointer text-xs">
                    {h}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== THUMBNAIL TEXT ====================
export function ThumbnailTextGenerator() {
  const [topic, setTopic] = useState('')
  const [emotion, setEmotion] = useState('Curiosity')
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const { addToHistory } = useStore()

  const generate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return }
    setLoading(true)
    try {
      const res = await gemini.generateThumbnailText({ topic, emotion })
      setOptions(res?.data?.options || [])
      addToHistory({ type: 'Thumbnail', title: topic })
      toast.success('Thumbnail text generated!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Thumbnail Text Generator" description="High-click thumbnail text with emotion targeting" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Topic *</label>
            <input className="input-field" placeholder="Video topic" value={topic} onChange={e => setTopic(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Emotion Target</label>
            <select className="input-field" value={emotion} onChange={e => setEmotion(e.target.value)}>
              {['Curiosity', 'Shock', 'FOMO', 'Fear', 'Joy', 'Anger', 'Inspiration'].map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <Button onClick={generate} loading={loading} icon={Sparkles}>Generate Thumbnail Text</Button>
      </Card>
      {loading && <LoadingCard count={4} />}
      {!loading && options.length === 0 && <EmptyState icon={Image} title="No thumbnail text yet" description="Generate high-click thumbnail text" />}
      {!loading && options.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {options.map((opt, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className="group">
                <div className="flex justify-between mb-2">
                  <Badge color={opt.emotion === 'Shock' ? 'red' : opt.emotion === 'Joy' ? 'green' : 'purple'}>{opt.emotion}</Badge>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={`${opt.mainText}\n${opt.subText || ''}`} id={`thumb-${i}`} />
                  </div>
                </div>
                <div className="text-center py-4 px-3 rounded-xl bg-[var(--bg-secondary)] mb-2">
                  <div className="text-2xl font-black text-[var(--text-primary)] leading-tight">{opt.mainText}</div>
                  {opt.subText && <div className="text-sm text-[var(--text-secondary)] mt-1">{opt.subText}</div>}
                </div>
                <div className="flex items-center justify-between">
                  <Badge>{opt.style}</Badge>
                  {opt.clickRate && <span className="text-xs font-mono" style={{ color: scoreColor(opt.clickRate) }}>CTR ~{opt.clickRate}%</span>}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== BIO GENERATOR ====================
export function BioGenerator() {
  const [niche, setNiche] = useState('')
  const [personality, setPersonality] = useState('Casual & Friendly')
  const [goals, setGoals] = useState('Grow audience and monetize')
  const [loading, setLoading] = useState(false)
  const [bios, setBios] = useState([])
  const { addToHistory } = useStore()

  const generate = async () => {
    if (!niche.trim()) { toast.error('Enter your niche'); return }
    setLoading(true)
    try {
      const res = await gemini.generateBio({ niche, personality, goals })
      setBios(res?.data?.bios || [])
      addToHistory({ type: 'Bio', title: niche })
      toast.success('Bios generated!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Bio Generator" description="Compelling YouTube channel bios that convert visitors" />
      <Card className="mb-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Niche *</label>
            <input className="input-field" placeholder="Your content niche" value={niche} onChange={e => setNiche(e.target.value)} list="niches" />
            <datalist id="niches">{NICHES.map(n => <option key={n} value={n} />)}</datalist>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Personality</label>
            <select className="input-field" value={personality} onChange={e => setPersonality(e.target.value)}>
              {['Casual & Friendly', 'Professional', 'Humorous', 'Inspirational', 'Educational', 'Edgy'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Goals</label>
            <input className="input-field" placeholder="e.g. Grow audience, sell course" value={goals} onChange={e => setGoals(e.target.value)} />
          </div>
        </div>
        <Button onClick={generate} loading={loading} icon={Sparkles}>Generate Bios</Button>
      </Card>
      {loading && <LoadingCard count={3} />}
      {!loading && bios.length === 0 && <EmptyState icon={User} title="No bios yet" description="Generate compelling channel bios" />}
      {!loading && bios.length > 0 && (
        <div className="grid gap-3">
          {bios.map((bio, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex gap-2">
                    <Badge color="purple">{bio.style}</Badge>
                    <Badge>{bio.length}</Badge>
                    {bio.includes_cta && <Badge color="green">Has CTA</Badge>}
                  </div>
                  <CopyButton text={bio.text} id={`bio-${i}`} />
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{bio.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
