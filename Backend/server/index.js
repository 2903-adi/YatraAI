import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config({ path: new URL('../.env', import.meta.url) })

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/models', async (_req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim()
    if (!apiKey) {
      return res.status(500).json({
        error:
          'GEMINI_API_KEY is not set. Add it to a .env file (see .env.example) and restart the API server.',
      })
    }

    const url = new URL('https://generativelanguage.googleapis.com/v1beta/models')
    url.searchParams.set('key', apiKey)

    const resp = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
    const data = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      return res.status(resp.status).json({
        error:
          data?.error?.message ||
          `Failed to list models (HTTP ${resp.status}).`,
      })
    }

    const models = Array.isArray(data?.models) ? data.models : []
    const supported = models
      .filter((m) =>
        Array.isArray(m?.supportedGenerationMethods)
          ? m.supportedGenerationMethods.includes('generateContent')
          : false,
      )
      .map((m) => ({
        name: m.name,
        displayName: m.displayName,
        methods: m.supportedGenerationMethods,
      }))

    return res.json({ models: supported })
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Unknown server error',
    })
  }
})

app.post('/api/results', async (req, res) => {
  try {
    const {
      planType,
      legType,
      from,
      to,
      startDate,
      returnDate,
      tripDays,
      comfort,
    } = req.body ?? {}

    if (!from || !to || !startDate || !comfort) {
      return res.status(400).json({
        error:
          'Missing required fields: from, to, startDate, comfort (and optional returnDate/tripDays depending on selection).',
      })
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim()
    if (!apiKey) {
      return res.status(500).json({
        error:
          'GEMINI_API_KEY is not set. Add it to a .env file (see .env.example) and restart the API server.',
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const requestedModel = process.env.GEMINI_MODEL?.trim()
    const modelCandidates = [
      requestedModel,
      'models/gemini-flash-latest',
      'models/gemini-2.0-flash',
      'models/gemini-2.5-flash',
      'models/gemini-pro-latest',
    ].filter(Boolean)

    const prompt = `
You are YatraAI, a travel planner.
Return a concise, practical plan in Markdown.

User request:
- Trip type: ${planType ?? 'transport'}
- Journey: ${legType ?? 'oneway'}
- From: ${from}
- To: ${to}
- Start date: ${startDate}
- Return date: ${returnDate ?? 'N/A'}
- Trip length (days): ${tripDays ?? 'N/A'}
- Comfort preference: ${comfort}

Output format (Markdown):
## Summary
Start with exactly these two lines:
- Via: <comma-separated intermediate cities, or "Direct">
- Summary: <1 short paragraph>

## Options (2-3)
For each option include:
- Estimated total cost (INR) as a rough range
- Transport details (and stay ideas if vacation)
- Pros/cons

## Recommended itinerary
Day-by-day (or segment-by-segment for transport-only).

## What to book / do next
Bullet checklist.
`.trim()

    let lastErr = null
    let text = ''

    for (const rawCandidate of modelCandidates) {
      try {
        const candidate = rawCandidate.startsWith('models/')
          ? rawCandidate
          : `models/${rawCandidate}`
        const model = genAI.getGenerativeModel({ model: candidate })
        const result = await model.generateContent(prompt)
        text = result?.response?.text?.() ?? ''
        if (text) break
      } catch (e) {
        lastErr = e
      }
    }

    if (!text) {
      const message =
        lastErr instanceof Error ? lastErr.message : 'Empty response from Gemini.'
      return res.status(502).json({ error: message })
    }

    const viaMatch = text.match(/^\s*Via:\s*(.+)\s*$/im)
    const viaRaw = viaMatch?.[1]?.trim() || ''
    const via =
      !viaRaw || viaRaw.toLowerCase() === 'direct' ? 'Direct' : viaRaw

    return res.json({ text, via })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown server error'
    const isKeyInvalid =
      typeof message === 'string' &&
      (message.includes('API_KEY_INVALID') || message.includes('API key not valid'))

    return res.status(502).json({
      error: isKeyInvalid
        ? [
            'Gemini rejected the API key (API_KEY_INVALID).',
            'Fix: generate a Gemini API key from Google AI Studio, or (if using Google Cloud Console) enable the “Generative Language API” and remove key restrictions.',
            'Then restart the API server.',
          ].join(' ')
        : message,
    })
  }
})

const port = Number(process.env.PORT || 3931)
const server = app.listen(port, '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`)
})

server.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('API server error:', err)
})

