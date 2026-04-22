export interface CompTrack {
  song: string
  artist: string
  score: number
  matchPct: string
}

export interface AIAnalysis {
  viralScore: number
  mixScore: number
  arrangementScore: number
  hookScore: number
  timbreScore: number
  marketFitScore: number
  energyScore: number
  structureScore: number
  verdict: 'hot' | 'solid' | 'weak'
  verdictLabel: string
  insight: string
  fixes: { type: 'good' | 'warn' | 'bad'; label: string }[]
  compTracks: CompTrack[]
  platformScores: { tiktok: number; spotify: number; apple: number; youtube: number }
  signingRecommendation: 'sign' | 'develop' | 'pass'
  dealNotes: string
  analyzedAt: string
}

export interface Demo {
  id: string
  artist: string
  song: string
  genre: string
  bpm?: number
  key?: string
  source: 'TikTok' | 'Instagram' | 'Email' | 'Beatport' | 'Spotify' | 'SoundCloud' | 'Internal' | 'Other'
  viralScore: number
  status: 'new' | 'review' | 'hold' | 'sign' | 'pass' | 'ref'
  notes: string
  tags: string[]
  dateAdded: string
  duration?: string
  aiAnalysis?: AIAnalysis
}

export interface Campaign {
  id: string
  name: string
  artist: string
  type: 'TikTok' | 'Meta Ads' | 'Organic' | 'Influencer' | 'Full Launch'
  status: 'idea' | 'brief' | 'production' | 'live' | 'completed'
  budget?: number
  targetPlatform: string[]
  linkedDemoId?: string
  notes: string
  dueDate?: string
}

export interface Release {
  id: string
  artist: string
  title: string
  type: 'Single' | 'EP' | 'Album'
  releaseDate: string
  status: 'planned' | 'mastering' | 'distributed' | 'live'
  platforms: string[]
  linkedDemoId?: string
}
