export function getScoreColor(score: number): string {
  if (score >= 88) return '#16a34a'
  if (score >= 75) return '#FF762C'
  return '#E24B4A'
}

export function getViralScoreColor(score: number): string {
  if (score >= 9) return '#16a34a'
  if (score >= 7) return '#FF762C'
  return '#E24B4A'
}

export function hashStringToColor(str: string): string {
  const colors = [
    '#FF762C', '#16a34a', '#3B82F6', '#7C3AED',
    '#EC4899', '#0891B2', '#D97706', '#DC2626',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
