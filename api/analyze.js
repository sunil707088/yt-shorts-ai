// Vercel Serverless Function: /api/analyze.js

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured')

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [{ text: 'You are an expert YouTube analytics and viral content analyst. Always respond with valid JSON.' }]
      },
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
    })
  })

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`)
  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function parseJSON(text) {
  return JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { type, content, platform, niche } = req.body

  try {
    let result

    if (type === 'viral') {
      const prompt = `Analyze this YouTube Shorts content for viral potential:

"${content}"
Platform: ${platform || 'YouTube Shorts'}

Return JSON:
{
  "overallScore": 82,
  "viralPotential": "High|Medium|Low",
  "scores": {
    "hook": { "score": 85, "feedback": "Analysis" },
    "retention": { "score": 78, "feedback": "Analysis" },
    "shareability": { "score": 90, "feedback": "Analysis" },
    "emotionalImpact": { "score": 88, "feedback": "Analysis" },
    "trendAlignment": { "score": 75, "feedback": "Analysis" },
    "cta": { "score": 70, "feedback": "Analysis" }
  },
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "improvements": ["Specific improvement 1", "Specific improvement 2"],
  "predictedViews": "50K-200K",
  "bestPostTime": "7PM-9PM",
  "targetDemographic": "18-24 males interested in tech"
}`
      const text = await callGemini(prompt)
      result = parseJSON(text)
    } else if (type === 'performance') {
      const prompt = `Predict performance metrics for this YouTube Short:

Content: "${content}"
Niche: ${niche || 'general'}
Platform: ${platform || 'YouTube Shorts'}

Return JSON:
{
  "predictions": {
    "views": { "low": "10K", "mid": "50K", "high": "200K" },
    "likes": { "rate": "4-6%", "estimated": "2K-12K" },
    "comments": { "rate": "0.5-1%", "estimated": "50-200" },
    "shares": { "rate": "1-2%", "estimated": "100-400" },
    "watchTime": "85%",
    "subscriberGain": "50-200"
  },
  "virality": {
    "probability": 35,
    "triggers": ["Trigger 1", "Trigger 2"],
    "timeToViral": "24-48 hours if viral"
  },
  "algorithm": {
    "score": 78,
    "factors": [
      { "factor": "Watch time", "impact": "High", "current": "Good" }
    ]
  },
  "recommendations": ["Optimization tip 1", "Tip 2"],
  "comparativePerformance": "Top 20% in niche"
}`
      const text = await callGemini(prompt)
      result = parseJSON(text)
    } else {
      return res.status(400).json({ error: 'Unknown analysis type' })
    }

    return res.status(200).json({ success: true, data: result })
  } catch (err) {
    console.error('Analyze error:', err)
    return res.status(500).json({ error: err.message })
  }
}
