// Vercel Serverless Function: /api/repurpose.js

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured')
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: 'You are an expert content repurposing strategist. Always respond with valid JSON.' }] },
      generationConfig: { temperature: 0.8, maxOutputTokens: 8192 }
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

  const { type, content, fromPlatform, toPlatforms, platforms, count } = req.body

  try {
    let result

    if (type === 'longToShorts') {
      const prompt = `Convert this long-form content into ${count || 5} viral YouTube Shorts ideas:

"${content}"

Return JSON:
{
  "shorts": [
    {
      "title": "Short title",
      "hook": "Opening hook",
      "script": "Full script (60-90 seconds)",
      "keyMoment": "The most compelling moment",
      "timestamp": "Approx. source timestamp if applicable",
      "viralScore": 85,
      "caption": "Video caption",
      "hashtags": ["#tag1", "#tag2"]
    }
  ],
  "strategy": "How to use these shorts to drive traffic to long-form content"
}`
      const text = await callGemini(prompt)
      result = parseJSON(text)
    } else if (type === 'repurpose') {
      const prompt = `Repurpose this ${fromPlatform} content for: ${toPlatforms?.join(', ')}

Content: "${content}"

Return JSON:
{
  "repurposed": {
    "youtube_shorts": { "script": "...", "hook": "...", "caption": "..." },
    "tiktok": { "script": "...", "hook": "...", "caption": "..." },
    "instagram_reels": { "script": "...", "hook": "...", "caption": "..." },
    "twitter": { "thread": ["Tweet 1", "Tweet 2"] },
    "linkedin": { "post": "..." }
  },
  "tips": ["Platform-specific tip 1", "Tip 2"]
}`
      const text = await callGemini(prompt)
      result = parseJSON(text)
    } else if (type === 'multiPlatform') {
      const prompt = `Adapt this content for multiple platforms: ${platforms?.join(', ')}

Content: "${content}"

Return JSON with an entry for each platform containing optimized version with platform-specific hooks, lengths, and styles:
{
  "platforms": [
    {
      "platform": "YouTube Shorts",
      "content": "Adapted content",
      "hook": "Platform-specific hook",
      "length": "60 seconds",
      "tips": ["Tip specific to this platform"]
    }
  ]
}`
      const text = await callGemini(prompt)
      result = parseJSON(text)
    }

    return res.status(200).json({ success: true, data: result })
  } catch (err) {
    console.error('Repurpose error:', err)
    return res.status(500).json({ error: err.message })
  }
}
