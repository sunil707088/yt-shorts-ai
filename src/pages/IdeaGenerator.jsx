import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Sparkles, Copy, Bookmark, ChevronDown, ChevronUp } from 'lucide-react'
import gemini from '../services/gemini'
import useStore from '../store'
import {
  Card, PageHeader, Button, Select, Input, ScoreBadge,
  Badge, LoadingCard, EmptyState, CopyButton, SaveButton, ProgressBar
} from '../components/shared'
import { NICHES, AUDIENCES, PLATFORMS, scoreColor } from '../utils'
import toast from 'react-hot-toast'

function IdeaCard({ idea, index, onSave, saved }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className="group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <span className="text-xs font-mono text-[var(--text-muted)] mt-1 w-5 shrink-0">#{index + 1}</span>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight mb-1">{idea.title}</h3>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <Badge color="blue">{idea.format}</Badge>
                {idea.estimatedViews && <Badge color="green">{idea.estimatedViews}</Badge>}
              </div>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <SaveButton saved={saved} onSave={() => onSave(idea)} onRemove={() => {}} />
            <CopyButton text={`${idea.title}\n\n${idea.description}\n\nHook: ${idea.hook}`} id={`idea-${index}`} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: 'Viral', value: idea.viralityScore },
            { label: 'Difficulty', value: idea.difficultyScore },
            { label: 'Engagement', value: idea.engagementScore },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xs text-[var(--text-muted)] mb-1">{s.label}</div>
              <ProgressBar value={s.value} />
              <div className="text-xs font-mono mt-1" style={{ color: scoreColor(s.value) }}>{s.value}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Less' : 'More details'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2 border-t border-[var(--border)] mt-3">
                <div>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Hook: </span>
                  <span className="text-xs text-[var(--text-secondary)]">"{idea.hook}"</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Description: </span>
                  <span className="text-xs text-[var(--text-secondary)]">{idea.description}</span>
                </div>
                {idea.whyItWorks && (
                  <div>
                    <span className="text-xs font-semibold text-[var(--text-muted)]">Why it works: </span>
                    <span className="text-xs text-[var(--text-secondary)]">{idea.whyItWorks}</span>
                  </div>
                )}
                {idea.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {idea.tags.map(t => <Badge key={t}>{t}</Badge>)}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export default function IdeaGenerator() {
  const [niche, setNiche] = useState('')
  const [audience, setAudience] = useState('Gen Z (18-24)')
  const [platform, setPlatform] = useState('YouTube Shorts')
  const [count, setCount] = useState(30)
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState([])
  const { saveItem, savedItems, addToHistory, incrementStat } = useStore()

  const generate = async () => {
    if (!niche.trim()) { toast.error('Enter a niche first'); return }
    setLoading(true)
    try {
      const res = await gemini.generateIdeas({ niche, audience, platform, count })
      const list = res?.data?.ideas || []
      setIdeas(list)
      addToHistory({ type: 'Ideas', title: `${niche} ideas (${list.length})` })
      incrementStat('ideasGenerated', list.length)
      toast.success(`${list.length} ideas generated!`)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = (idea) => {
    saveItem({ type: 'Idea', title: idea.title, content: idea.description, data: idea })
    toast.success('Saved!')
  }

  return (
    <div>
      <PageHeader
        title="Idea Generator"
        description="Generate 30 unique viral YouTube Shorts ideas with AI scoring"
      />

      <Card className="mb-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Niche *</label>
            <input
              className="input-field"
              placeholder="e.g. Personal Finance, Fitness..."
              value={niche}
              onChange={e => setNiche(e.target.value)}
              list="niches"
            />
            <datalist id="niches">
              {NICHES.map(n => <option key={n} value={n} />)}
            </datalist>
          </div>
          <Select
            label="Target Audience"
            value={audience}
            onChange={setAudience}
            options={AUDIENCES}
          />
          <Select
            label="Platform"
            value={platform}
            onChange={setPlatform}
            options={PLATFORMS}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-xs text-[var(--text-muted)]">Ideas count:</label>
            {[10, 20, 30].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${count === n ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                {n}
              </button>
            ))}
          </div>
          <Button
            onClick={generate}
            loading={loading}
            icon={Sparkles}
          >
            Generate Ideas
          </Button>
        </div>
      </Card>

      {loading && (
        <div className="grid gap-3">
          <LoadingCard count={6} />
        </div>
      )}

      {!loading && ideas.length === 0 && (
        <EmptyState
          icon={Lightbulb}
          title="No ideas yet"
          description="Enter your niche and click Generate to get 30 viral ideas"
        />
      )}

      {!loading && ideas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--text-muted)]">{ideas.length} ideas generated</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const text = ideas.map((idea, i) => `${i+1}. ${idea.title}\n${idea.description}\nHook: ${idea.hook}\n`).join('\n')
                navigator.clipboard.writeText(text)
                toast.success('All ideas copied!')
              }}
              icon={Copy}
            >
              Copy All
            </Button>
          </div>
          <div className="grid gap-3">
            {ideas.map((idea, i) => (
              <IdeaCard
                key={i}
                idea={idea}
                index={i}
                onSave={handleSave}
                saved={savedItems.some(s => s.title === idea.title)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
