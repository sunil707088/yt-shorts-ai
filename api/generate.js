// Vercel Serverless Function: /api/generate.js
// Handles all generation requests via Google Gemini API

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

async function callGemini(prompt, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured')

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  }

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] }
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || `Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function parseJSON(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

const SYSTEM = `You are an expert YouTube Shorts content strategist with deep knowledge of viral content, audience psychology, and platform algorithms. You create data-driven, actionable content that consistently goes viral. Always respond with valid JSON unless instructed otherwise.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { type, ...params } = req.body

  try {
    let result

    switch (type) {
      case 'ideas': {
        const { niche, audience, platform, count } = params
        const prompt = `Generate ${count} viral YouTube Shorts ideas for the "${niche}" niche targeting "${audience}" on ${platform}.

Return a JSON object with this exact structure:
{
  "ideas": [
    {
      "title": "Compelling idea title",
      "description": "2-3 sentence description of the content",
      "hook": "Opening hook line",
      "viralityScore": 85,
      "difficultyScore": 30,
      "engagementScore": 90,
      "format": "Tutorial|Story|Challenge|Reaction|Educational|Entertainment",
      "estimatedViews": "100K-500K",
      "tags": ["tag1", "tag2", "tag3"],
      "whyItWorks": "Brief explanation of viral potential"
    }
  ]
}

Make ideas diverse in format and approach. Scores are 0-100. Be specific and actionable.`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'script': {
        const { topic, tone, duration, niche } = params
        const prompt = `Create a complete YouTube Shorts script for: "${topic}"
Niche: ${niche || 'general'}
Tone: ${tone}
Duration: ${duration} seconds

Return JSON:
{
  "hook": "Attention-grabbing opening (first 3 seconds)",
  "intro": "Setup (3-8 seconds)",
  "mainContent": "Core content broken into sections",
  "cta": "Call to action",
  "caption": "Full video caption with emojis",
  "hashtags": ["#hashtag1", "#hashtag2"],
  "thumbnailText": "Bold text for thumbnail",
  "estimatedDuration": "actual seconds estimate",
  "tips": ["Delivery tip 1", "Delivery tip 2"]
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'hooks': {
        const { topic, niche, count } = params
        const prompt = `Generate ${count} powerful YouTube Shorts hooks for: "${topic}" in the ${niche || 'general'} niche.

Return JSON:
{
  "hooks": [
    {
      "text": "The hook text",
      "type": "Curiosity|Shock|Contrarian|Story|Emotional|Question|Challenge|Statistic",
      "psychology": "Brief explanation of why this works",
      "score": 88
    }
  ]
}

Make hooks diverse, punchy, and under 15 words each. Optimize for the first 2 seconds.`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'ctas': {
        const { topic, goal } = params
        const prompt = `Generate 15 powerful CTAs for a YouTube Short about "${topic}" with goal: ${goal}.

Return JSON:
{
  "ctas": [
    {
      "text": "CTA text",
      "type": "Subscribe|Follow|Comment|Share|Like|Save|Visit|DM",
      "urgency": "High|Medium|Low",
      "effectiveness": 85
    }
  ]
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'titles': {
        const { topic, niche } = params
        const prompt = `Generate 20 viral YouTube Shorts titles for: "${topic}" in ${niche || 'general'} niche.

Return JSON:
{
  "titles": [
    {
      "text": "Title text",
      "style": "How-To|List|Question|Shock|Story|Challenge|Controversy",
      "clickbaitScore": 72,
      "clarityScore": 88,
      "seoScore": 75
    }
  ]
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'hashtags': {
        const { topic, niche, platform } = params
        const prompt = `Generate optimal hashtags for a ${platform} Short about "${topic}" in ${niche || 'general'} niche.

Return JSON:
{
  "primary": ["#hashtag (most relevant, high volume)"],
  "niche": ["#hashtag (niche specific)"],
  "trending": ["#hashtag (currently trending)"],
  "long_tail": ["#hashtag (specific, lower competition)"],
  "strategy": "Brief hashtag strategy explanation",
  "optimal_count": 8
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'thumbnail': {
        const { topic, emotion } = params
        const prompt = `Generate 15 high-impact thumbnail text options for a Short about "${topic}" targeting ${emotion || 'curiosity'} emotion.

Return JSON:
{
  "options": [
    {
      "mainText": "BIG BOLD TEXT",
      "subText": "Supporting text",
      "emotion": "Curiosity|Shock|FOMO|Fear|Joy|Anger",
      "style": "Minimal|Bold|Question|Statement|Number",
      "clickRate": 85
    }
  ]
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'bio': {
        const { niche, personality, goals } = params
        const prompt = `Write 10 YouTube channel bio options for a ${niche} creator with ${personality} personality, goals: ${goals}.

Return JSON:
{
  "bios": [
    {
      "text": "Full bio text",
      "style": "Professional|Casual|Humorous|Inspirational|Direct",
      "length": "Short|Medium|Long",
      "includes_cta": true
    }
  ]
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'rewrite': {
        const { script, tone, improvements } = params
        const prompt = `Rewrite this YouTube Shorts script with ${tone} tone, focusing on: ${improvements?.join(', ')}.

Original script:
${script}

Return JSON:
{
  "rewritten": "Full rewritten script",
  "changes": ["Change 1", "Change 2"],
  "improvements": {
    "hook": "Improved hook",
    "pacing": "Pacing notes",
    "cta": "Improved CTA"
  },
  "score_before": 65,
  "score_after": 88
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'keywords': {
        const { niche, platform } = params
        const prompt = `Find 30 viral keywords for ${niche} content on ${platform || 'YouTube Shorts'}.

Return JSON:
{
  "keywords": [
    {
      "keyword": "keyword phrase",
      "searchVolume": "High|Medium|Low",
      "competition": "High|Medium|Low",
      "viralPotential": 85,
      "trend": "Rising|Stable|Declining",
      "category": "Hook|Title|Description|Tag"
    }
  ]
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'calendar': {
        const { niche, frequency, duration, goals } = params
        const prompt = `Create a ${duration}-week content calendar for a ${niche} YouTube Shorts creator posting ${frequency}x per week, goal: ${goals}.

Return JSON:
{
  "weeks": [
    {
      "week": 1,
      "theme": "Week theme",
      "posts": [
        {
          "day": "Monday",
          "title": "Content idea",
          "format": "Tutorial|Story|etc",
          "hook": "Opening hook",
          "priority": "High|Medium|Low"
        }
      ]
    }
  ],
  "strategy": "Overall content strategy",
  "milestones": ["Milestone at week 2", "Milestone at week 4"]
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'series': {
        const { niche, topic, episodeCount } = params
        const prompt = `Plan a ${episodeCount}-episode YouTube Shorts series about "${topic}" for ${niche} niche.

Return JSON:
{
  "seriesName": "Series title",
  "concept": "Series concept",
  "episodes": [
    {
      "number": 1,
      "title": "Episode title",
      "hook": "Episode hook",
      "keyPoints": ["Point 1", "Point 2"],
      "cliffhanger": "Reason to watch next episode"
    }
  ],
  "brandingTips": ["Tip 1", "Tip 2"],
  "growthStrategy": "How to grow with this series"
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      case 'collabs': {
        const { niche, audience, style } = params
        const prompt = `Generate 15 creative collab ideas for a ${niche} creator with ${audience} audience, ${style} style.

Return JSON:
{
  "collabs": [
    {
      "concept": "Collab idea",
      "partnerType": "Type of creator to collab with",
      "format": "Duet|Challenge|Interview|Reaction|Series",
      "viralPotential": 85,
      "difficulty": 40,
      "mutualBenefit": "How both creators benefit"
    }
  ]
}`
        const text = await callGemini(prompt, SYSTEM)
        result = parseJSON(text)
        break
      }

      default:
        return res.status(400).json({ error: `Unknown type: ${type}` })
    }

    return res.status(200).json({ success: true, data: result, type })
  } catch (err) {
    console.error('Generate error:', err)
    return res.status(500).json({ error: err.message || 'Generation failed' })
  }
}
