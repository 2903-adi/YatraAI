import { Link, useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'

function MarkdownBlock({ text }) {
  return (
    <div className="ai-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

export default function Results({ result, error, isLoading, request }) {
  const location = useLocation()
  const fromState = location.state?.request
  const req = request ?? fromState

  return (
    <div className="page">
      <div className="bg-image" aria-hidden />
      <div className="bg-shade" aria-hidden />

      <section className="results-standalone" aria-label="AI results">
        <header className="results-standalone-head">
          <div>
            <h2 className="results-standalone-title">AI Results</h2>
            {req?.from && req?.to ? (
              <p className="results-standalone-sub">
                {req.from} → {req.to} · {req.comfort}
              </p>
            ) : (
              <p className="results-standalone-sub">
                Enter trip details to generate a plan.
              </p>
            )}
          </div>
          <Link to="/" className="results-standalone-back">
            ← Back
          </Link>
        </header>

        <div className="ai-card">
          {!req ? (
            <p className="ai-muted">No request yet. Go back and submit the form.</p>
          ) : isLoading ? (
            <p className="ai-muted">Generating your plan…</p>
          ) : error ? (
            <div className="ai-error">
              <p className="ai-error-title">Couldn’t generate results</p>
              <p className="ai-error-body">{error}</p>
            </div>
          ) : result ? (
            <MarkdownBlock text={result} />
          ) : (
            <p className="ai-muted">Submit the form to see results here.</p>
          )}
        </div>
      </section>
    </div>
  )
}

