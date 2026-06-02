export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(date))
}

export function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function scoreColor(score) {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  return '#ef4444'
}

export function scoreLabel(score) {
  if (score >= 80) return 'High'
  if (score >= 60) return 'Medium'
  return 'Low'
}

export function truncate(str, max = 100) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '...' : str
}

export function downloadText(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadCSV(data, filename) {
  if (!data || data.length === 0) return
  const headers = Object.keys(data[0])
  const rows = data.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  downloadText(csv, filename)
}

export async function downloadPDF(content, filename) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  const lines = doc.splitTextToSize(content, 180)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  let y = 20
  lines.forEach(line => {
    if (y > 280) { doc.addPage(); y = 20 }
    doc.text(line, 15, y)
    y += 6
  })
  doc.save(filename)
}

export const NICHES = [
  'Finance & Investing', 'Fitness & Health', 'Tech & AI', 'Food & Cooking',
  'Travel & Adventure', 'Fashion & Style', 'Gaming', 'Education & Learning',
  'Beauty & Skincare', 'Business & Entrepreneurship', 'Relationships & Dating',
  'Motivation & Self-Help', 'Comedy & Entertainment', 'News & Current Events',
  'DIY & Crafts', 'Pets & Animals', 'Sports & Athletics', 'Music',
  'Art & Creativity', 'Mental Health & Wellness', 'Parenting', 'Real Estate'
]

export const TONES = [
  'Engaging', 'Educational', 'Entertaining', 'Inspirational', 'Controversial',
  'Humorous', 'Dramatic', 'Casual', 'Professional', 'Urgent', 'Storytelling'
]

export const PLATFORMS = [
  'YouTube Shorts', 'TikTok', 'Instagram Reels', 'Facebook Reels', 'Snapchat'
]

export const AUDIENCES = [
  'Gen Z (18-24)', 'Millennials (25-34)', 'Gen X (35-44)', 'Boomers (45+)',
  'Teenagers (13-17)', 'Parents', 'Professionals', 'Students', 'Entrepreneurs'
]
