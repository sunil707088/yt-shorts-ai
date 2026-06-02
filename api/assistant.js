// Vercel Serverless Function: /api/assistant.js

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

  const { messages, context } = req.body
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  try {
    const systemPrompt = `You are ShortsGPT, an expert AI assistant specializing in YouTube Shorts content creation, viral strategies, and audience growth. You have deep knowledge of:
- YouTube Shorts algorithm and optimization
- Viral content formulas and psychology
- Content strategy and planning  
- Hook writing and retention techniques
- Monetization strategies
- Trend analysis and niche research
- Audience building and engagement

${context ? `Current context: ${context}` : ''}

Be conversational, actionable, and specific. Use examples. Format responses clearly.`

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
          topP: 0.95,
        }
      })
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'Gemini API error')
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return res.status(200).json({ success: true, message: text })
  } catch (err) {
    console.error('Assistant error:', err)
    return res.status(500).json({ error: err.message })
  }
}
