import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Trash2, Sparkles, Bot, User } from 'lucide-react'
import gemini from '../services/gemini'
import useStore from '../store'
import { Card, PageHeader, Button, CopyButton } from '../components/shared'
import toast from 'react-hot-toast'

const SUGGESTIONS = [
  'What are the best hooks for finance content?',
  'How do I increase watch time on Shorts?',
  'Give me a viral content strategy for fitness',
  'What are trending topics right now?',
  'How to monetize my Shorts channel fast?',
  'Best posting times for YouTube Shorts?',
]

function MessageBubble({ msg }) {
  const isBot = msg.role === 'assistant'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isBot ? 'bg-[var(--accent)]' : 'bg-[var(--purple)]'}`}>
        {isBot ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
      </div>
      <div className={`max-w-[80%] ${isBot ? '' : 'items-end'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] rounded-tl-sm'
              : 'bg-[var(--purple)] text-white rounded-tr-sm'
          }`}
        >
          <div className="whitespace-pre-wrap">{msg.content}</div>
        </div>
        {isBot && (
          <div className="flex gap-1">
            <CopyButton text={msg.content} id={msg.id} size={13} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shrink-0">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}

export default function AIAssistant() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { chatMessages, addChatMessage, clearChat } = useStore()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, loading])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')

    addChatMessage({ role: 'user', content: msg })
    setLoading(true)

    try {
      const history = [...chatMessages, { role: 'user', content: msg }]
      const res = await gemini.chat({
        messages: history.map(m => ({ role: m.role, content: m.content })),
        context: 'YouTube Shorts content creation assistant'
      })
      addChatMessage({ role: 'assistant', content: res.message })
    } catch (e) {
      toast.error(e.message)
      addChatMessage({ role: 'assistant', content: "Sorry, I encountered an error. Please try again." })
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <PageHeader
        title="AI Assistant"
        description="Your personal YouTube Shorts strategist"
        actions={
          chatMessages.length > 0 && (
            <Button variant="ghost" size="sm" icon={Trash2} onClick={() => { clearChat(); toast.success('Chat cleared') }}>
              Clear
            </Button>
          )
        }
      />

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {chatMessages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center mx-auto mb-4" style={{ boxShadow: '0 0 30px var(--accent-glow)' }}>
              <Sparkles size={28} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">ShortsGPT</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
              Your expert AI strategist for viral YouTube Shorts content. Ask me anything about growing your channel.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-xl mx-auto">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left px-3 py-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-bright)] hover:bg-[var(--bg-card)] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {chatMessages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] pt-4">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            className="input-field flex-1 resize-none text-sm"
            rows={2}
            placeholder="Ask about hooks, scripts, strategy, trends..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="btn-primary px-4 self-end rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-1.5">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}
