import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, ArrowLeftRight, Share2, BarChart2, TrendingUp, Sparkles } from 'lucide-react'
import gemini from '../services/gemini'
import useStore from '../store'
import { Card, PageHeader, Button, EmptyState, LoadingCard, CopyButton, Badge, ProgressBar, GlassCard } from '../components/shared'
import { PLATFORMS, scoreColor } from '../utils'
import toast from 'react-hot-toast'

// ==================== SCRIPT REWRITER ====================
export function ScriptRewriter() {
  const [script, setScript] = useState('')
  const [tone, setTone] = useState('Engaging')
  const [improvements, setImprovements] = useState(['Better hook', 'Stronger CTA', 'Better pacing'])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { addToHistory } = useStore()

  const generate = async () => {
    if (!script.trim()) { toast.error('Paste your script'); return }
    setLoading(true)
    try {
      const res = await gemini.rewriteScript({ script, tone, improvements })
      setResult(res?.data)
      addToHistory({ type: 'Rewrite', title: 'Script rewrite' })
      toast.success('Script rewritten!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Script Rewriter" description="AI-powered script optimization with score improvements" />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Original Script</h3>
          <textarea
            className="input-field mb-4 text-sm"
            rows={12}
            placeholder="Paste your existing script here..."
            value={script}
            onChange={e => setScript(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Tone</label>
              <select className="input-field" value={tone} onChange={e => setTone(e.target.value)}>
                {['Engaging', 'Educational', 'Entertaining', 'Inspirational', 'Humorous', 'Dramatic'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">Focus improvements:</label>
            <div className="flex flex-wrap gap-2">
              {['Better hook', 'Stronger CTA', 'Better pacing', 'More emotion', 'Shorter sentences', 'Add humor'].map(imp => (
                <button
                  key={imp}
                  onClick={() => setImprovements(prev => prev.includes(imp) ? prev.filter(i => i !== imp) : [...prev, imp])}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${improvements.includes(imp) ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30' : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                >
                  {imp}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={generate} loading={loading} icon={Sparkles} className="w-full justify-center">Rewrite Script</Button>
        </Card>

        <div>
          {loading && <LoadingCard count={2} />}
          {!loading && !result && (
            <Card className="h-full flex items-center justify-center">
              <EmptyState icon={RefreshCw} title="Rewritten script appears here" description="Paste your script and click rewrite" />
            </Card>
          )}
          {!loading && result && (
            <div className="space-y-4">
              {result.score_before && result.score_after && (
                <div className="grid grid-cols-2 gap-3">
                  <Card className="text-center">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Before</div>
                    <div className="text-2xl font-bold font-mono" style={{ color: scoreColor(result.score_before) }}>{result.score_before}</div>
                  </Card>
                  <Card className="text-center">
                    <div className="text-xs text-[var(--text-muted)] mb-1">After</div>
                    <div className="text-2xl font-bold font-mono" style={{ color: scoreColor(result.score_after) }}>{result.score_after}</div>
                  </Card>
                </div>
              )}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">✨ Rewritten Script</h3>
                  <CopyButton text={result.rewritten} id="rewritten" />
                </div>
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">{result.rewritten}</p>
              </Card>
              {result.changes && (
                <Card>
                  <h4 className="text-xs font-bold text-[var(--text-muted)] mb-2">Changes Made</h4>
                  {result.changes.map((c, i) => <p key={i} className="text-xs text-[var(--text-secondary)] flex gap-1"><span className="text-green-400">✓</span>{c}</p>)}
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== LONG TO SHORTS ====================
export function LongToShorts() {
  const [content, setContent] = useState('')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [shorts, setShorts] = useState([])
  const { addToHistory } = useStore()

  const generate = async () => {
    if (!content.trim()) { toast.error('Paste your content'); return }
    setLoading(true)
    try {
      const res = await gemini.convertToShorts({ content, count })
      setShorts(res?.data?.shorts || [])
      addToHistory({ type: 'LongToShorts', title: 'Content converted' })
      toast.success(`${res?.data?.shorts?.length} shorts created!`)
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Long Form → Shorts" description="Extract viral Shorts ideas from long-form content" />
      <Card className="mb-6">
        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Long-form content *</label>
          <textarea
            className="input-field text-sm"
            rows={8}
            placeholder="Paste your blog post, video transcript, article, or any long-form content..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--text-muted)]">Shorts count:</label>
            {[3, 5, 8, 10].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${count === n ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                {n}
              </button>
            ))}
          </div>
          <Button onClick={generate} loading={loading} icon={Sparkles}>Convert to Shorts</Button>
        </div>
      </Card>
      {loading && <LoadingCard count={3} />}
      {!loading && shorts.length === 0 && <EmptyState icon={ArrowLeftRight} title="Paste content to convert" description="We'll extract the most viral moments" />}
      {!loading && shorts.length > 0 && (
        <div className="grid gap-4">
          {shorts.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">Short #{i + 1}: {s.title}</h3>
                    <Badge color="blue" className="mt-1">{s.viralScore}% viral</Badge>
                  </div>
                  <CopyButton text={`${s.title}\n\nHook: ${s.hook}\n\nScript:\n${s.script}\n\nCaption: ${s.caption}\n\n${s.hashtags?.join(' ')}`} id={`short-${i}`} />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-[var(--accent)] font-semibold">Hook: "{s.hook}"</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{s.script}</p>
                  {s.hashtags && <div className="flex flex-wrap gap-1 pt-2">{s.hashtags.map(h => <Badge key={h}>{h}</Badge>)}</div>}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== VIRAL ANALYZER ====================
export function ViralAnalyzer() {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('YouTube Shorts')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { addToHistory } = useStore()

  const analyze = async () => {
    if (!content.trim()) { toast.error('Enter content to analyze'); return }
    setLoading(true)
    try {
      const res = await gemini.analyzeViral({ content, platform })
      setResult(res?.data)
      addToHistory({ type: 'Analysis', title: 'Viral analysis' })
      toast.success('Analysis complete!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Viral Analyzer" description="AI-powered viral potential analysis with detailed scoring" />
      <Card className="mb-6">
        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Content to analyze *</label>
          <textarea
            className="input-field text-sm"
            rows={6}
            placeholder="Paste your script, idea, or hook to analyze..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Platform</label>
            <select className="input-field w-48" value={platform} onChange={e => setPlatform(e.target.value)}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <Button onClick={analyze} loading={loading} icon={BarChart2}>Analyze</Button>
        </div>
      </Card>
      {loading && <LoadingCard count={2} />}
      {!loading && !result && <EmptyState icon={BarChart2} title="Paste content to analyze" description="Get a detailed viral potential breakdown" />}
      {!loading && result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Overall score */}
          <GlassCard className="text-center py-6">
            <div className="text-5xl font-black font-mono mb-1" style={{ color: scoreColor(result.overallScore) }}>
              {result.overallScore}
            </div>
            <div className="text-sm text-[var(--text-muted)] mb-2">Overall Viral Score</div>
            <Badge color={result.viralPotential === 'High' ? 'green' : result.viralPotential === 'Medium' ? 'yellow' : 'red'}>
              {result.viralPotential} Viral Potential
            </Badge>
            {result.predictedViews && <p className="text-sm text-[var(--text-secondary)] mt-3">Predicted views: <span className="font-semibold">{result.predictedViews}</span></p>}
          </GlassCard>

          {/* Score breakdown */}
          <Card>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">Score Breakdown</h3>
            <div className="grid gap-3">
              {result.scores && Object.entries(result.scores).map(([key, s]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-secondary)] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-mono" style={{ color: scoreColor(s.score) }}>{s.score}</span>
                  </div>
                  <ProgressBar value={s.score} />
                  {s.feedback && <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.feedback}</p>}
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {result.strengths && (
              <Card>
                <h4 className="text-sm font-bold text-green-400 mb-2">✅ Strengths</h4>
                {result.strengths.map((s, i) => <p key={i} className="text-xs text-[var(--text-secondary)] flex gap-1.5 mb-1"><span className="text-green-400 shrink-0">+</span>{s}</p>)}
              </Card>
            )}
            {result.improvements && (
              <Card>
                <h4 className="text-sm font-bold text-[var(--accent)] mb-2">🚀 Improvements</h4>
                {result.improvements.map((s, i) => <p key={i} className="text-xs text-[var(--text-secondary)] flex gap-1.5 mb-1"><span className="text-[var(--accent)] shrink-0">→</span>{s}</p>)}
              </Card>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ==================== PERFORMANCE PREDICTOR ====================
export function PerformancePredictor() {
  const [content, setContent] = useState('')
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('YouTube Shorts')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { addToHistory } = useStore()

  const predict = async () => {
    if (!content.trim()) { toast.error('Enter content'); return }
    setLoading(true)
    try {
      const res = await gemini.predictPerformance({ content, niche, platform })
      setResult(res?.data)
      addToHistory({ type: 'Performance', title: 'Performance prediction' })
      toast.success('Prediction ready!')
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="Performance Predictor" description="AI predictions for views, engagement, and viral probability" />
      <Card className="mb-6">
        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Content / Script *</label>
          <textarea className="input-field text-sm" rows={5} placeholder="Paste script or content idea..." value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
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
        <Button onClick={predict} loading={loading} icon={TrendingUp}>Predict Performance</Button>
      </Card>
      {loading && <LoadingCard count={3} />}
      {!loading && !result && <EmptyState icon={TrendingUp} title="Predict your content's performance" description="Get detailed engagement and view predictions" />}
      {!loading && result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {result.predictions && [
              { label: 'Views', data: result.predictions.views, color: 'var(--accent)' },
              { label: 'Likes', data: result.predictions.likes, color: '#eab308' },
              { label: 'Comments', data: result.predictions.comments, color: 'var(--purple)' },
              { label: 'Shares', data: result.predictions.shares, color: '#22c55e' },
            ].map(m => (
              <Card key={m.label} className="text-center">
                <div className="text-xs text-[var(--text-muted)] mb-1">{m.label}</div>
                <div className="text-lg font-bold font-mono" style={{ color: m.color }}>
                  {m.data?.estimated || m.data?.mid || '-'}
                </div>
                {m.data?.rate && <div className="text-xs text-[var(--text-muted)]">{m.data.rate} rate</div>}
              </Card>
            ))}
          </div>

          {result.virality && (
            <Card>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Viral Probability</h3>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black font-mono" style={{ color: scoreColor(result.virality.probability) }}>
                  {result.virality.probability}%
                </div>
                <div>
                  {result.virality.timeToViral && <p className="text-xs text-[var(--text-muted)]">{result.virality.timeToViral}</p>}
                  {result.virality.triggers?.map((t, i) => (
                    <p key={i} className="text-xs text-[var(--text-secondary)] flex gap-1"><span className="text-[var(--accent)]">⚡</span>{t}</p>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {result.recommendations && (
            <Card>
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2">Optimization Tips</h4>
              {result.recommendations.map((r, i) => (
                <p key={i} className="text-xs text-[var(--text-secondary)] flex gap-1.5 mb-1"><span className="text-[var(--purple)]">→</span>{r}</p>
              ))}
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}
