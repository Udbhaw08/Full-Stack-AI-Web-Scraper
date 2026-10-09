import { useState } from 'react';

function SparkIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.8 14.35 9.65 21.2 12l-6.85 2.35L12 21.2l-2.35-6.85L2.8 12l6.85-2.35L12 2.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2Z" fill="currentColor" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13.8a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.7 1.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14 10.2a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.9l1.7-1.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 3.5v4h4M8.5 12h7M8.5 15.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function formatHost(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return value;
  }
}

export default function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not reach the server. Check that it is running and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PageBrief home">
          <span className="brand-mark"><SparkIcon size={19} /></span>
          <span>pagebrief<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> AI-powered page summaries</div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR WEB, WITHOUT THE NOISE</div>
          <h1>Read less.<br /><span>Know more.</span></h1>
          <p className="hero-copy">Turn any article or webpage into the ideas that matter. Paste a link, let AI do the reading, and get back to what you were doing.</p>

          <form className="url-form" onSubmit={handleSubmit}>
            <label className="url-label" htmlFor="page-url">WEBPAGE URL</label>
            <div className="input-row">
              <span className="input-icon"><LinkIcon /></span>
              <input
                id="page-url"
                name="url"
                type="url"
                inputMode="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                required
                disabled={loading}
                autoComplete="url"
              />
              <button type="submit" disabled={loading || !url.trim()}>
                {loading ? <><span className="button-spinner" /> Summarizing</> : <>Summarize <span className="button-arrow">↗</span></>}
              </button>
            </div>
            <div className="form-footnote"><span className="tiny-lock">◇</span> Public webpages only · No account needed</div>
          </form>

          {error && (
            <div className="error-panel" role="alert">
              <span className="error-mark">!</span>
              <div><strong>We couldn't summarize that page.</strong><p>{error}</p></div>
            </div>
          )}

          {loading && (
            <div className="loading-panel" role="status" aria-live="polite">
              <div className="loading-orbit"><SparkIcon size={22} /></div>
              <div><strong>Reading the page</strong><p>Finding the main ideas and putting them into focus…</p></div>
              <span className="loading-dots"><i /><i /><i /></span>
            </div>
          )}

          {result && !loading && (
            <section className="result-card" aria-live="polite">
              <div className="result-header">
                <div className="result-icon"><FileIcon /></div>
                <div className="result-heading">
                  <div className="result-kicker">YOUR SUMMARY</div>
                  <h2>{result.title || 'Page summary'}</h2>
                  <a className="source-link" href={result.sourceUrl} target="_blank" rel="noreferrer">{formatHost(result.sourceUrl)} <span>↗</span></a>
                </div>
                <span className="ai-tag"><SparkIcon size={14} /> AI summary</span>
              </div>
              <div className="result-rule" />
              <div className="summary-content">{result.summary}</div>
              <div className="result-footer">
                <span><span className="footer-dot" /> Based on page content</span>
                <span>{Number(result.extractedChars || 0).toLocaleString()} characters analyzed</span>
              </div>
            </section>
          )}
        </section>

        {!result && !loading && (
          <section className="how-section" aria-label="How it works">
            <div className="section-heading"><span>THREE STEPS</span><div /></div>
            <div className="steps-grid">
              <article className="step-card">
                <div className="step-number">01</div>
                <div className="step-icon"><LinkIcon /></div>
                <h3>Drop a link</h3>
                <p>Start with an article, guide, blog post, or public webpage.</p>
              </article>
              <article className="step-card">
                <div className="step-number">02</div>
                <div className="step-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16M4 10h11M4 15h8M4 20h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="m17 14 1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" transform="translate(0 -2) scale(.9)"/></svg></div>
                <h3>AI gets the gist</h3>
                <p>The app extracts readable text and asks Gemini to find the key points.</p>
              </article>
              <article className="step-card">
                <div className="step-number">03</div>
                <div className="step-icon"><FileIcon /></div>
                <h3>Get the brief</h3>
                <p>A clear, concise summary appears right here, ready to read.</p>
              </article>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <a className="footer-brand" href="#top">pagebrief<span className="brand-period">.</span></a>
        <span>Less scrolling. More signal.</span>
      </footer>
    </div>
  );
}
