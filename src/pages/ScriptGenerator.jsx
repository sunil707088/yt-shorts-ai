import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Copy } from 'lucide-react'
import gemini from '../services/gemini'
import useStore from '../store'
import {
  Card, PageHeader, Button, Select, Input, Textarea,
  LoadingCard, EmptyState, CopyButton, SaveButton, Badge, GlassCard
} from '../components/shared'
import { TONES, NICHES } from '../utils'
import toast from 'react-hot-toast'

const DURATIONS = ['15', '30', '45', '60', '90']

export default function ScriptGenerator() {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Engaging')
  const [duration, setDuration] = useState('60')
  const [niche, setNiche] = useState('')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState(null)
  const { saveItem, addToHistory, incrementStat } = useStore()

  const generate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return }
    setLoading(true)
    try {
      const res = await gemini.generateScript({ topic, tone, duration, niche })
      setScript(res?.data)
      addToHistory({ type: 'Script', title: topic })
      incrementStat('scriptsGenerated')
      toast.success('Script generated!')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fullScript = script ? `HOOK:\n${script.hook}\n\nINTRO:\n${script.intro}\n\nMAIN CONTENT:\n${script.mainContent}\n\nCTA:\n${script.cta}\n\nCAPTION:\n${script.caption}\n\nHASHTAGS:\n${script.hashtags?.join(' ')}` : ''

  return (
    <div>
      <PageHeader
        title="Script Generator"
        description="Generate complete viral YouTube Shorts scripts with hooks, CTAs, and captions"
      />

      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Topic *</label>
            <input
              className="input-field"
              placeholder="e.g. How to make $1000 in one week..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
          </div>
          <Select label="Tone" value={tone} onChange={setTone} options={TONES} />
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Niche (optional)</label>
            <input className="input-field" placeholder="e.g. Finance" value={niche} onChange={e => setNiche(e.target.value)} list="niches" />
            <datalist id="niches">{NICHES.map(n => <option key={n} value={n} />)}</datalist>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--text-muted)]">Duration:</label>
            {DURATIONS.map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${duration === d ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                {d}s
              </button>
            ))}
          </div>
          <Button onClick={generate} loading={loading} icon={Sparkles}>
            Generate Script
          </Button>
        </div>
      </Card>

      {loading && <LoadingCard count={3} />}

      {!loading && !script && (
        <EmptyState icon={FileText} title="No script yet" description="Enter a topic and generate your viral script" />
      )}

      {!loading && script && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {script.estimatedDuration && <Badge color="blue">~{script.estimatedDuration}</Badge>}
              <Badge color="purple">{tone}</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={Copy}
                onClick={() => { navigator.clipboard.writeText(fullScript); toast.success('Copied!') }}
              >
                Copy All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveItem({ type: 'Script', title: topic, content: fullScript, data: script })}
              >
                Save
              </Button>
            </div>
          </div>

          {[
            { label: '🪝 Hook', key: 'hook', color: 'var(--accent)', tip: 'First 3 seconds — make it count!' },
            { label: '📢 Intro', key: 'intro', color: 'var(--purple)', tip: null },
            { label: '📝 Main Content', key: 'mainContent', color: '#22c55e', tip: null },
            { label: '🎯 Call To Action', key: 'cta', color: '#eab308', tip: null },
          ].map(section => (
            <Card key={section.key}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold" style={{ color: section.color }}>{section.label}</span>
                  {section.tip && <span className="text-xs text-[var(--text-muted)] ml-2">{section.tip}</span>}
                </div>
                <CopyButton text={script[section.key]} id={section.key} />
              </div>
              <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                {script[section.key]}
              </p>
            </Card>
          ))}

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">📋 Caption</span>
                <CopyButton text={script.caption} id="caption" />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{script.caption}</p>
            </Card>
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">🏷️ Hashtags</span>
                <CopyButton text={script.hashtags?.join(' ')} id="hashtags" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {script.hashtags?.map(h => (
                  <Badge key={h} color="purple">{h}</Badge>
                ))}
              </div>
            </Card>
          </div>

          {script.tips && (
            <Card>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">💡 Delivery Tips</h3>
              <ul className="space-y-1">
                {script.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                    <span className="text-[var(--accent)] shrink-0">→</span>{tip}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}
