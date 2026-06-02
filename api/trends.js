// Vercel Serverless Function: /api/trends.js

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { niche, platform } = req.body
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  try {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const prompt = `You are a viral content trend analyst. Based on your knowledge of YouTube Shorts trends and viral content patterns as of ${today}, identify trending topics for the "${niche || 'general'}" niche on ${platform || 'YouTube Shorts'}.

Return JSON:
{
  "trending": [
    {
      "topic": "Trend name",
      "description": "What this trend is about",
      "momentum": "Exploding|Rising|Stable|Declining",
      "searchVolume": "High|Medium|Low",
      "competition": "High|Medium|Low",
      "opportunity": 85,
      "contentIdeas": ["Idea 1", "Idea 2", "Idea 3"],
      "estimatedLifespan": "1 week|1 month|3 months|Evergreen",
      "category": "Challenge|Educational|Entertainment|Lifestyle|Tech|etc"
    }
  ],
  "emergingNiches": ["Niche 1", "Niche 2"],
  "avoidTopics": ["Declining topic 1"],
  "insights": "Overall trend insights for this niche",
  "bestFormats": ["Format 1", "Format 2"],
  "peakPostTimes": ["7PM-9PM EST", "12PM-2PM EST"]
}`

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
      })
    })

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`)
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const result = JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())

    return res.status(200).json({ success: true, data: result })
  } catch (err) {
    console.error('Trends error:', err)
    return res.status(500).json({ error: err.message })
  }
}
