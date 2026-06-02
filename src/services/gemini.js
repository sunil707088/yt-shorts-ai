// Centralized Gemini service - all requests go through Vercel API routes
// Never expose API keys in frontend

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

class GeminiService {
  constructor() {
    this.retryAttempts = 3
    this.retryDelay = 1000
    this.requestQueue = []
    this.processing = false
  }

  async _request(endpoint, payload, attempt = 0) {
    try {
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        if (response.status === 429 && attempt < this.retryAttempts) {
          await this._delay(this.retryDelay * Math.pow(2, attempt))
          return this._request(endpoint, payload, attempt + 1)
        }
        throw new Error(error.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      if (attempt < this.retryAttempts && err.name !== 'AbortError') {
        await this._delay(this.retryDelay * Math.pow(2, attempt))
        return this._request(endpoint, payload, attempt + 1)
      }
      throw err
    }
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Generate viral ideas
  async generateIdeas({ niche, audience, platform, count = 30 }) {
    return this._request('generate', {
      type: 'ideas',
      niche,
      audience,
      platform,
      count,
    })
  }

  // Generate full script
  async generateScript({ topic, tone, duration, niche }) {
    return this._request('generate', {
      type: 'script',
      topic,
      tone,
      duration,
      niche,
    })
  }

  // Generate hooks
  async generateHooks({ topic, niche, count = 20 }) {
    return this._request('generate', {
      type: 'hooks',
      topic,
      niche,
      count,
    })
  }

  // Generate CTAs
  async generateCTAs({ topic, goal }) {
    return this._request('generate', {
      type: 'ctas',
      topic,
      goal,
    })
  }

  // Generate titles
  async generateTitles({ topic, niche }) {
    return this._request('generate', {
      type: 'titles',
      topic,
      niche,
    })
  }

  // Generate hashtags
  async generateHashtags({ topic, niche, platform }) {
    return this._request('generate', {
      type: 'hashtags',
      topic,
      niche,
      platform,
    })
  }

  // Generate thumbnail text
  async generateThumbnailText({ topic, emotion }) {
    return this._request('generate', {
      type: 'thumbnail',
      topic,
      emotion,
    })
  }

  // Generate bio
  async generateBio({ niche, personality, goals }) {
    return this._request('generate', {
      type: 'bio',
      niche,
      personality,
      goals,
    })
  }

  // Rewrite script
  async rewriteScript({ script, tone, improvements }) {
    return this._request('generate', {
      type: 'rewrite',
      script,
      tone,
      improvements,
    })
  }

  // Convert long form to shorts
  async convertToShorts({ content, count = 5 }) {
    return this._request('repurpose', {
      type: 'longToShorts',
      content,
      count,
    })
  }

  // Repurpose content
  async repurposeContent({ content, fromPlatform, toPlatforms }) {
    return this._request('repurpose', {
      type: 'repurpose',
      content,
      fromPlatform,
      toPlatforms,
    })
  }

  // Analyze viral potential
  async analyzeViral({ content, platform }) {
    return this._request('analyze', {
      type: 'viral',
      content,
      platform,
    })
  }

  // Predict performance
  async predictPerformance({ content, niche, platform }) {
    return this._request('analyze', {
      type: 'performance',
      content,
      niche,
      platform,
    })
  }

  // Get trending topics
  async getTrending({ niche, platform }) {
    return this._request('trends', {
      niche,
      platform,
    })
  }

  // Get viral keywords
  async getViralKeywords({ niche, platform }) {
    return this._request('generate', {
      type: 'keywords',
      niche,
      platform,
    })
  }

  // AI assistant chat
  async chat({ messages, context }) {
    return this._request('assistant', {
      messages,
      context,
    })
  }

  // Multi-platform content
  async generateMultiPlatform({ content, platforms }) {
    return this._request('repurpose', {
      type: 'multiPlatform',
      content,
      platforms,
    })
  }

  // Generate content calendar
  async generateCalendar({ niche, frequency, duration, goals }) {
    return this._request('generate', {
      type: 'calendar',
      niche,
      frequency,
      duration,
      goals,
    })
  }

  // Generate series ideas
  async generateSeries({ niche, topic, episodeCount }) {
    return this._request('generate', {
      type: 'series',
      niche,
      topic,
      episodeCount,
    })
  }

  // Generate collab ideas
  async generateCollabs({ niche, audience, style }) {
    return this._request('generate', {
      type: 'collabs',
      niche,
      audience,
      style,
    })
  }
}

export const gemini = new GeminiService()
export default gemini
