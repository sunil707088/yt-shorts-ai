import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Sparkles } from 'lucide-react'
import gemini from '../services/gemini'
import useStore from '../store'
import { Card, PageHeader, Button, EmptyState, LoadingCard, CopyButton, SaveButton, Badge, ProgressBar } from '../components/shared'
import { NICHES, scoreColor } from '../utils'
import toast from 'react-hot-toast'

const TYPE_COLORS = {
  Curiosity: '#06b6d4', Shock: '#ef4444', Contrarian: '#f59e0b',
  Story: '#8b5cf6', Emotional: '#ec4899', Question: '#22c55e',
  Challenge: '#f97316', Statistic: '#3b82f6'
}

export default function HookGenerator() {
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('')
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState([])
  const [filter, setFilter] = useState('All')
  const { saveItem, savedItems, addToHistory, incrementStat } = useStore()

  const generate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return }
    setLoading(true)
    try {
      const res = await gemini.generateHooks({ topic, niche, count: 20 })
      const list = res?.data?.hooks || []
      setHooks(list)
      addToHistory({ type: 'Hooks', title: topic })
      incrementStat('hooksGenerated', list.length)
      toast.success(`${list.length} hooks generated!`)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const types = ['All', ...new Set(hooks.map(h => h.type))]
  const filtered = filter === 'All' ? hooks : hooks.filter(h => h.type === filter)

  return (
    <div>
      <PageHeader title="Hook Generator" description="20 viral hooks across 8 psychological categories" />

      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Topic *</label>
            <input className="input-field" placeholder="What is your video about?" value={topic} onChange={e => setTopic(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Niche (optional)</label>
            <input className="input-field" placeholder="e.g. Fitness" value={niche} onChange={e => setNiche(e.target.value)} list="niches" />
            <datalist id="niches">{NICHES.map(n => <option key={n} value={n} />)}</datalist>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={generate} loading={loading} icon={Sparkles}>Generate 20 Hooks</Button>
        </div>
      </Card>

      {loading && <LoadingCard count={4} />}

      {!loading && hooks.length === 0 && (
        <EmptyState icon={Zap} title="No hooks yet" description="Enter your topic to generate 20 powerful hooks" />
      )}

      {!loading && hooks.length > 0 && (
        <>
          <div className="flex gap-2 flex-wrap mb-4">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === t ? 'text-white' : 'text-[var(--text-muted)] bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
                style={filter === t ? { background: TYPE_COLORS[t] || 'var(--accent)' } : {}}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grid gap-3">
            {filtered.map((hook, i) => {
              const color = TYPE_COLORS[hook.type] || 'var(--accent)'
              const isSaved = savedItems.some(s => s.title === hook.text)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className="group">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed mb-2">"{hook.text}"</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge style={{ color, background: `${color}15`, borderColor: `${color}30` }}>{hook.type}</Badge>
                            {hook.psychology && (
                              <span className="text-xs text-[var(--text-muted)] truncate max-w-xs hidden md:block">{hook.psychology}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {hook.score && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-16">
                                  <ProgressBar value={hook.score} />
                                </div>
                                <span className="text-xs font-mono" style={{ color: scoreColor(hook.score) }}>{hook.score}</span>
                              </div>
                            )}
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                              <SaveButton
                                saved={isSaved}
                                onSave={() => { saveItem({ type: 'Hook', title: hook.text, content: hook.text, data: hook }); toast.success('Saved!') }}
                                onRemove={() => {}}
                              />
                              <CopyButton text={hook.text} id={`hook-${i}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
