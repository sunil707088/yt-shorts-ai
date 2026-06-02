const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

async function ask(prompt) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`)
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

class GeminiService {
  async generateIdeas({ niche, audience, platform, count = 10 }) {
    return { result: await ask(`Generate ${count} viral YouTube Shorts ideas for niche: ${niche}, audience: ${audience}, platform: ${platform}. Numbered list with title and description.`) }
  }
  async generateScript({ topic, tone, duration, niche }) {
    return { result: await ask(`Write a ${duration}-second YouTube Shorts script about "${topic}" in ${tone} tone for ${niche} niche. Include hook, content, CTA.`) }
  }
  async generateHooks({ topic, niche, count = 10 }) {
    return { result: await ask(`Generate ${count} viral hooks for a YouTube Short about "${topic}" in ${niche} niche.`) }
  }
  async generateCTAs({ topic, goal }) {
    return { result: await ask(`Generate 10 CTAs for a YouTube Short about "${topic}" with goal: ${goal}.`) }
  }
  async generateTitles({ topic, niche }) {
    return { result: await ask(`Generate 15 viral YouTube Shorts titles for "${topic}" in ${niche} niche.`) }
  }
  async generateHashtags({ topic, niche, platform }) {
    return { result: await ask(`Generate 30 hashtags for ${platform} short about "${topic}" in ${niche} niche.`) }
  }
  async generateThumbnailText({ topic, emotion }) {
    return { result: await ask(`Generate 10 thumbnail text ideas for "${topic}" evoking ${emotion}. Under 6 words each.`) }
  }
  async generateBio({ niche, personality, goals }) {
    return { result: await ask(`Write 5 YouTube bio options for ${niche} creator with ${personality} personality. Goals: ${goals}.`) }
  }
  async rewriteScript({ script, tone, improvements }) {
    return { result: await ask(`Rewrite this script in ${tone} tone with improvements: ${improvements}.\n\n${script}`) }
  }
  async convertToShorts({ content, count = 5 }) {
    return { result: await ask(`Convert this content into ${count} YouTube Shorts scripts:\n\n${content}`) }
  }
  async repurposeContent({ content, fromPlatform, toPlatforms }) {
    return { result: await ask(`Repurpose this ${fromPlatform} content for ${toPlatforms.join(', ')}:\n\n${content}`) }
  }
  async analyzeViral({ content, platform }) {
    return { result: await ask(`Analyze viral potential of this ${platform} content. Score 1-10 with tips:\n\n${content}`) }
  }
  async predictPerformance({ content, niche, platform }) {
    return { result: await ask(`Predict performance of this ${platform} content in ${niche} niche:\n\n${content}`) }
  }
  async getTrending({ niche, platform }) {
    return { result: await ask(`Top 20 trending topics for ${platform} in ${niche} niche right now.`) }
  }
  async getViralKeywords({ niche, platform }) {
    return { result: await ask(`30 viral keywords for ${platform} content in ${niche} niche.`) }
  }
  async chat({ messages, context }) {
    const history = messages.map(m => `${m.role}: ${m.content}`).join('\n')
    return { result: await ask(`You are a YouTube Shorts expert. Context: ${context}\n\n${history}`) }
  }
  async generateMultiPlatform({ content, platforms }) {
    return { result: await ask(`Adapt this content for ${platforms.join(', ')}:\n\n${content}`) }
  }
  async generateCalendar({ niche, frequency, duration, goals }) {
    return { result: await ask(`Create ${duration} content calendar for ${niche} creator posting ${frequency}x/week. Goals: ${goals}.`) }
  }
  async generateSeries({ niche, topic, episodeCount }) {
    return { result: await ask(`Create ${episodeCount}-episode Shorts series about "${topic}" for ${niche} niche.`) }
  }
  async generateCollabs({ niche, audience, style }) {
    return { result: await ask(`Suggest 10 collab ideas for ${niche} creator with ${audience} audience and ${style} style.`) }
  }
}

export const gemini = new GeminiService()
export default gemini