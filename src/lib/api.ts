const API_BASE = ''

export async function analyzeTrack(system: string, prompt: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, prompt }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.content
}

export async function streamResponse(
  prompt: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  system?: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, prompt }),
  })

  if (!res.ok) throw new Error(`Stream API error: ${res.status}`)

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') {
          onDone()
          return
        }
        try {
          const parsed = JSON.parse(data)
          if (parsed.text) onChunk(parsed.text)
        } catch {
          // ignore parse errors
        }
      }
    }
  }
  onDone()
}

export const ANALYSIS_SYSTEM = `You are the RTF AI A&R Engine — an expert music industry analyst for Respect The Funk Records, a viral-first music label. Your job is to score demo tracks across 8 dimensions and provide actionable A&R intelligence.

You think like a combination of: a seasoned A&R director who has worked with majors, a mix engineer who understands technical production, and a data analyst who tracks viral music trends on TikTok, Spotify, and Beatport.

RTF's philosophy: We are not genre-driven, we are signal-driven. We engineer viral songs and campaigns. We sign tracks that have viral potential, not just good production.

Always respond in valid JSON only. No markdown, no preamble.`

export function buildAnalysisPrompt(demo: {
  artist: string
  song: string
  genre: string
  bpm?: number
  key?: string
  source: string
  notes: string
  tags: string[]
}): string {
  return `Analyze this track for Respect The Funk Records:

Artist: ${demo.artist}
Song: ${demo.song}
Genre: ${demo.genre}
BPM: ${demo.bpm || 'Unknown'}
Key: ${demo.key || 'Unknown'}
Source: ${demo.source}
A&R Notes: ${demo.notes}
Tags: ${demo.tags.join(', ')}

Score this track on all 8 dimensions (0-100 scale) and provide full analysis.

Return ONLY this JSON structure:
{
  "viralScore": number,
  "mixScore": number,
  "arrangementScore": number,
  "hookScore": number,
  "timbreScore": number,
  "marketFitScore": number,
  "energyScore": number,
  "structureScore": number,
  "verdict": "hot" | "solid" | "weak",
  "verdictLabel": "string (3-4 words, punchy)",
  "insight": "string (3-5 sentences, specific production + market intelligence, use HTML bold tags for key phrases)",
  "fixes": [
    { "type": "good" | "warn" | "bad", "label": "string (2-3 words)" }
  ],
  "compTracks": [
    { "song": "string", "artist": "string", "score": number, "matchPct": "string (e.g. 87%)" }
  ],
  "platformScores": {
    "tiktok": number,
    "spotify": number,
    "apple": number,
    "youtube": number
  },
  "signingRecommendation": "sign" | "develop" | "pass",
  "dealNotes": "string (1-2 sentences on deal structure if signing)"
}

Scoring rubric:
- viralScore: Composite score weighted 40% hook + 30% marketFit + 30% energy
- mixScore: Mix balance, frequency response, LUFS loudness, sidechain quality
- arrangementScore: Structural arc, intro/drop/breakdown logic, tension/release
- hookScore: Hook density, placement quality, 15-second TikTok window compliance
- timbreScore: Sonic palette authenticity vs genre reference, tonal character
- marketFitScore: Alignment with current trending sounds on TikTok/Beatport/Spotify
- energyScore: Raw intensity, drive, sustained engagement potential
- structureScore: Song architecture, section clarity, DJ-mix compatibility

For compTracks: provide 3 real market reference tracks that are sonically similar.
For fixes: provide 6 items covering strengths (good), warnings (warn), and issues (bad).`
}
