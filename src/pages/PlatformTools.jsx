import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Share2, Sparkles } from 'lucide-react'
import gemini from '../services/gemini'
import useStore from '../store'
import { Card, PageHeader, Button, EmptyState, LoadingCard, CopyButton, Badge, GlassCard } from '../components/shared'
import { PLATFORMS } from '../utils'
import toast from 'react-hot-toast'

const PLATFORM_ICONS = {
  'YouTube Shorts': '▶️',
  'TikTok': '🎵',
  'Instagram Reels': '📸',
  'Facebook Reels': '👥',
  'Snapchat': '👻',
  'Twitter': '🐦',
  'LinkedIn': '💼',
}

// ==================== CONTENT REPURPOSER ====================
export function ContentRepurposer() {
  const [content, setContent] = useState('')
  const [fromPlatform, setFromPlatform] = useState('YouTube Shorts')
  const [toPlatforms, setToPlatforms] = useState(['TikTok', 'Instagram Reels'])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { addToHistory } = useStore()

  const togglePlatform = (p) => {
    setToPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const generate = async () => {
    if (!content.trim()) { toast.error('Enter content to repurpose'); return }
    if (toPlatforms.length === 0) { toast.error('Select target platforms'); return }
    setLoading(true)
    try {
      const res = await gemini.repurposeContent({ content, fromPlatform, toPlatforms })
      setResult(res?.data?.repurposed)
      addToHistory({ type: 'Repurpose', title: 'Content repurposed' })
      toast.success('Content repurposed!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  const platformKeys = {
    'TikTok': 'tiktok',
    'Instagram Reels': 'instagram_reels',
    'YouTube Shorts': 'youtube_shorts',
    'Twitter': 'twitter',
    'LinkedIn': 'linkedin',
  }

  return (
    <div>
      <PageHeader title="Content Repurposer" description="Adapt your content for any platform automatically" />
      <Card className="mb-6">
        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Original content *</label>
          <textarea className="input-field text-sm" rows={5} placeholder="Paste your script or content..." value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">From platform</label>
            <select className="input-field" value={fromPlatform} onChange={e => setFromPlatform(e.target.value)}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">Target platforms</label>
            <div className="flex flex-wrap gap-2">
              {['TikTok', 'Instagram Reels', 'Twitter', 'LinkedIn'].map(p => (
                <button key={p} onClick={() => togglePlatform(p)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${toPlatforms.includes(p) ? 'bg-[var(--purple)]/10 text-[var(--purple)] border-[var(--purple)]/30' : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
                  {PLATFORM_ICONS[p]} {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button onClick={generate} loading={loading} icon={Sparkles}>Repurpose Content</Button>
      </Card>

      {loading && <LoadingCard count={3} />}
      {!loading && !result && <EmptyState icon={Share2} title="Paste content to repurpose" description="We'll adapt it for every platform perfectly" />}

      {!loading && result && (
        <div className="grid gap-4">
          {Object.entries(result).map(([platform, data]) => {
            if (!data) return null
            const label = Object.keys(platformKeys).find(k => platformKeys[k] === platform) || platform
            return (
              <motion.div key={platform} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      {PLATFORM_ICONS[label] || '📱'} {label}
                    </h3>
                    <CopyButton text={JSON.stringify(data, null, 2)} id={platform} />
                  </div>
                  {data.hook && <p className="text-xs text-[var(--accent)] font-semibold mb-2">Hook: "{data.hook}"</p>}
                  {data.script && <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">{data.script}</p>}
                  {data.thread && (
                    <div className="space-y-2">
                      {data.thread.map((tweet, i) => (
                        <div key={i} className="text-sm text-[var(--text-secondary)] pl-3 border-l-2 border-[var(--border)]">{tweet}</div>
                      ))}
                    </div>
                  )}
                  {data.post && <p className="text-sm text-[var(--text-secondary)]">{data.post}</p>}
                  {data.caption && <p className="text-xs text-[var(--text-muted)] mt-2">{data.caption}</p>}
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ==================== MULTI-PLATFORM GENERATOR ====================
export function MultiPlatformGenerator() {
  const [content, setContent] = useState('')
  const [platforms, setPlatforms] = useState(['YouTube Shorts', 'TikTok', 'Instagram Reels'])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const { addToHistory } = useStore()

  const togglePlatform = (p) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const generate = async () => {
    if (!content.trim()) { toast.error('Enter content'); return }
    if (platforms.length === 0) { toast.error('Select platforms'); return }
    setLoading(true)
    try {
      const res = await gemini.generateMultiPlatform({ content, platforms })
      setResults(res?.data?.platforms || [])
      addToHistory({ type: 'MultiPlatform', title: 'Multi-platform content' })
      toast.success('Content generated for all platforms!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Multi-Platform Generator" description="Create platform-optimized content for all channels at once" />
      <Card className="mb-6">
        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Content idea or script *</label>
          <textarea className="input-field text-sm" rows={4} placeholder="Your content idea or base script..." value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">Target platforms</label>
          <div className="flex flex-wrap gap-2">
            {[...PLATFORMS, 'Twitter', 'LinkedIn'].map(p => (
              <button key={p} onClick={() => togglePlatform(p)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${platforms.includes(p) ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30' : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
                {PLATFORM_ICONS[p] || '📱'} {p}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={generate} loading={loading} icon={Layers}>Generate for All Platforms</Button>
      </Card>

      {loading && <LoadingCard count={3} />}
      {!loading && results.length === 0 && <EmptyState icon={Layers} title="Generate multi-platform content" description="One idea, optimized for every platform" />}

      {!loading && results.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {results.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
              <Card className="h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {PLATFORM_ICONS[r.platform] || '📱'} {r.platform}
                  </h3>
                  <div className="flex gap-1 items-center">
                    <Badge color="blue">{r.length}</Badge>
                    <CopyButton text={`${r.hook}\n\n${r.content}`} id={`mp-${i}`} />
                  </div>
                </div>
                {r.hook && <p className="text-xs font-semibold text-[var(--accent)] mb-2">"{r.hook}"</p>}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{r.content}</p>
                {r.tips?.length > 0 && (
                  <div className="pt-2 border-t border-[var(--border)]">
                    {r.tips.map((tip, j) => (
                      <p key={j} className="text-xs text-[var(--text-muted)] flex gap-1"><span>💡</span>{tip}</p>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
