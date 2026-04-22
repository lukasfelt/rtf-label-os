import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import cors from 'cors'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '..', '.env') })

const app = express()
app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Standard analysis (returns JSON)
app.post('/api/analyze', async (req, res) => {
  try {
    const { system, prompt } = req.body
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system,
      messages: [{ role: 'user', content: prompt }],
    })
    res.json({ content: message.content[0].text })
  } catch (err) {
    console.error('Analyze error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Streaming (for briefs, decisions, strategies)
app.post('/api/stream', async (req, res) => {
  const { system, prompt } = req.body
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: system || 'You are the RTF A&R AI engine for Respect The Funk Records.',
      messages: [{ role: 'user', content: prompt }],
    })

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`)
    })
    stream.on('end', () => {
      res.write('data: [DONE]\n\n')
      res.end()
    })
    stream.on('error', (err) => {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
      res.end()
    })
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

app.get('/api/health', (_, res) => res.json({ status: 'ok', model: 'claude-sonnet-4-5' }))

// Serve built frontend in production
const distPath = join(__dirname, '..', 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (_, res) => res.sendFile(join(distPath, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`RTF API server running on :${PORT}`))
