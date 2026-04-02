import { useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { formatInr, recentSearches as seedSearches } from './mockRecentSearches'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Results from './pages/Results.jsx'
import { fetchAiResults } from './api/ai.js'
import './App.css'

function estimatePriceInr({ kind, tier, leg }) {
  const base =
    kind === 'vacation'
      ? tier === 'luxury'
        ? 65000
        : tier === 'comfort'
          ? 42000
          : 28000
      : tier === 'luxury'
        ? 4500
        : tier === 'comfort'
          ? 2800
          : 1800

  const multiplier = leg === 'return' ? 1.85 : 1
  return Math.round(base * multiplier)
}

function SearchBoard({ rows, filter, onFilterChange }) {
  const rowsFiltered = useMemo(() => {
    if (filter === 'all') return rows
    return rows.filter((s) => s.kind === filter)
  }, [filter, rows])

  return (
    <aside className="board" aria-label="Recent searches from travellers">
      <div className="board-top">
        <h2 className="board-title">Live board</h2>
        <p className="board-note">
          Last 30 searches — not bookings. Filter by trip type; prices are
          indicative (demo).
        </p>
        <div className="board-tabs" role="tablist" aria-label="Filter board">
          {[
            { id: 'all', label: 'All' },
            { id: 'vacation', label: 'Vacation' },
            { id: 'transport', label: 'Transport' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={filter === t.id}
              className={`board-tab ${filter === t.id ? 'is-on' : ''}`}
              onClick={() => onFilterChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <ul className="board-list">
        {rowsFiltered.map((s) => (
          <li key={s.id} className="board-row">
            <div className="board-row-top">
              <span
                className={`kind-pill kind-${s.kind}`}
                title={s.kind === 'vacation' ? 'Full vacation plan' : 'Transport only'}
              >
                {s.kind === 'vacation' ? 'Vacation' : 'Transport'}
              </span>
              <span className="board-price">{formatInr(s.price)}</span>
            </div>
            <div className="board-route">
              <span className="city">{s.from}</span>
              <span className="arrow" aria-hidden>
                →
              </span>
              <span className="city">{s.to}</span>
            </div>
            <div className="board-meta">
              <span className={`pill pill-${s.tier}`}>{s.tier}</span>
              {s.kind === 'vacation' ? (
                <span className="via">{s.days} days</span>
              ) : (
                <span className="via">
                  {s.leg === 'return' ? 'Return' : 'One way'} · via {s.via}
                </span>
              )}
              <span className="ago">{s.ago}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function HeaderActions() {
  const location = useLocation()

  return (
    <div className="top-actions" aria-label="Account actions">
      <Link
        to="/login"
        className={`top-link ${location.pathname === '/login' ? 'is-on' : ''}`}
      >
        Log in
      </Link>
      <Link
        to="/signup"
        className={`top-link top-link-primary ${location.pathname === '/signup' ? 'is-on' : ''}`}
      >
        Sign up
      </Link>
    </div>
  )
}

function ResultsPanel({ title, subtitle, isLoading, error, result }) {
  return (
    <section className="results-col" aria-label="AI results panel">
      <div className="results-col-top">
        <div>
          <h2 className="results-col-title">{title}</h2>
          <p className="results-col-sub">{subtitle}</p>
        </div>
        <Link to="/results" className="results-open">
          Open →
        </Link>
      </div>
      <div className="ai-card">
        {isLoading ? (
          <p className="ai-muted">Generating your plan…</p>
        ) : error ? (
          <div className="ai-error">
            <p className="ai-error-title">Couldn’t generate results</p>
            <p className="ai-error-body">{error}</p>
          </div>
        ) : result ? (
          <div className="ai-md">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {result}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="ai-muted">
            Your AI results will appear here after you submit the form.
          </p>
        )}
      </div>
    </section>
  )
}

function Home({ onGenerate, isLoading, error, result, onNewSearch, searches }) {
  const [planType, setPlanType] = useState('transport')
  const [legType, setLegType] = useState('oneway')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [startDate, setStartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [tripDays, setTripDays] = useState('5')
  const [comfort, setComfort] = useState('Budget')
  const [boardFilter, setBoardFilter] = useState('all')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const kind = planType === 'vacation' ? 'vacation' : 'transport'
    const tier = comfort.toLowerCase()
    const leg = legType === 'return' ? 'return' : 'oneway'

    const payload = {
      planType,
      legType,
      from,
      to,
      startDate,
      returnDate: legType === 'return' ? returnDate : null,
      tripDays: planType === 'vacation' ? Number(tripDays) || 0 : null,
      comfort,
    }

    const out = await onGenerate(payload)

    onNewSearch?.({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      kind,
      tier,
      from: from || '—',
      to: to || '—',
      price: estimatePriceInr({ kind, tier, leg }),
      ago: 'just now',
      leg,
      via: out?.via || 'Direct',
      days: planType === 'vacation' ? Number(tripDays) || 0 : null,
    })

    navigate('/results', { state: { request: payload } })
  }

  return (
    <div className="page">
      <div className="bg-image" aria-hidden />
      <div className="bg-shade" aria-hidden />

      <div className="shell">
        <div className="shell-bar">
          <HeaderActions />
        </div>
        <main className="main" aria-label="Trip details">
          <header className="brand">
            <p className="eyebrow">Travel planning</p>
            <h1>YatraAI</h1>
            <p className="lead">
              Pick transport-only routes or a full vacation plan — like choosing
              one-way vs return for flights. Bookings stay off for now; the board
              on the right shows what others searched.
            </p>
          </header>

          <form className="trip-form" onSubmit={handleSubmit}>
            <fieldset className="seg-group">
              <legend className="sr-only">What do you need</legend>
              <span className="field-label">Trip type</span>
              <div className="segmented" role="group" aria-label="Trip type">
                <button
                  type="button"
                  className={`seg-btn ${planType === 'transport' ? 'is-on' : ''}`}
                  onClick={() => setPlanType('transport')}
                >
                  Transport only
                </button>
                <button
                  type="button"
                  className={`seg-btn ${planType === 'vacation' ? 'is-on' : ''}`}
                  onClick={() => setPlanType('vacation')}
                >
                  Vacation plan
                </button>
              </div>
            </fieldset>

            <fieldset className="seg-group">
              <legend className="sr-only">Journey</legend>
              <span className="field-label">Journey</span>
              <div className="segmented" role="group" aria-label="One way or return">
                <button
                  type="button"
                  className={`seg-btn ${legType === 'oneway' ? 'is-on' : ''}`}
                  onClick={() => setLegType('oneway')}
                >
                  One way
                </button>
                <button
                  type="button"
                  className={`seg-btn ${legType === 'return' ? 'is-on' : ''}`}
                  onClick={() => setLegType('return')}
                >
                  Return
                </button>
              </div>
            </fieldset>

            <label className="text-field">
              <span className="field-label">From</span>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="City or station"
                autoComplete="off"
              />
            </label>
            <label className="text-field">
              <span className="field-label">To</span>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="City or station"
                autoComplete="off"
              />
            </label>

            <label className="text-field">
              <span className="field-label">
                {planType === 'vacation' ? 'Trip starts' : 'Depart date'}
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>

            {legType === 'return' && (
              <label className="text-field">
                <span className="field-label">Return date</span>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </label>
            )}

            {planType === 'vacation' && (
              <label className="text-field">
                <span className="field-label">How many days</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={tripDays}
                  onChange={(e) => setTripDays(e.target.value)}
                  placeholder="e.g. 5"
                />
              </label>
            )}

            <label className="text-field">
              <span className="field-label">Comfort</span>
              <select
                value={comfort}
                onChange={(e) => setComfort(e.target.value)}
              >
                <option value="Budget">Budget</option>
                <option value="Comfort">Comfort</option>
                <option value="Luxury">Luxury</option>
              </select>
            </label>

            <button type="submit" className="submit-btn">
              {planType === 'vacation' ? 'Plan vacation' : 'Find transport'}
            </button>
          </form>
        </main>

        <ResultsPanel
          title="AI results"
          subtitle="Based on your comfort preference."
          isLoading={isLoading}
          error={error}
          result={result}
        />

        <SearchBoard
          rows={searches}
          filter={boardFilter}
          onFilterChange={setBoardFilter}
        />
      </div>
    </div>
  )
}

export default function App() {
  const [aiText, setAiText] = useState('')
  const [aiError, setAiError] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [lastRequest, setLastRequest] = useState(null)
  const [searches, setSearches] = useState(() =>
    seedSearches.map((s, idx) => ({
      ...s,
      id: `seed-${idx}`,
    })),
  )

  function handleNewSearch(next) {
    setSearches((prev) => [next, ...prev].slice(0, 30))
  }

  async function handleGenerate(payload) {
    setAiLoading(true)
    setAiError('')
    setLastRequest(payload)
    try {
      const data = await fetchAiResults(payload)
      setAiText(data.text)
      return { via: data.via, text: data.text }
    } catch (e) {
      setAiText('')
      setAiError(e instanceof Error ? e.message : 'Failed to generate results')
      return null
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            onGenerate={handleGenerate}
            isLoading={aiLoading}
            error={aiError}
            result={aiText}
            onNewSearch={handleNewSearch}
            searches={searches}
          />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/results"
        element={
          <Results
            result={aiText}
            error={aiError}
            isLoading={aiLoading}
            request={lastRequest}
          />
        }
      />
    </Routes>
  )
}
