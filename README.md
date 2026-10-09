# PageBrief — AI Web Scraper & Summarizer

A small full-stack app that accepts a public webpage URL, extracts the readable HTML text on the server, and asks Gemini to generate a concise summary with key takeaways.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Scraping:** Cheerio
- **AI:** Google Gemini API using the official `@google/genai` SDK
- **Safety basics:** URL validation, private-network address blocking, redirect revalidation, request timeout/size limits, and API rate limiting

## Requirements

- Node.js 20 or newer
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Run locally

1. Open this folder in a terminal.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your local environment file:

   **Windows PowerShell**

   ```powershell
   Copy-Item .env.example .env
   ```

   **macOS / Linux**

   ```bash
   cp .env.example .env
   ```

4. Open `.env` and replace `your_gemini_api_key_here` with your own key. Keep the key private; do not paste it into frontend code or commit `.env` to Git.
5. Start the frontend and backend:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173).

Vite serves the React UI and forwards `/api` requests to the Express backend at port `3001`.

## Production build

```bash
npm run build
npm start
```

The Express server serves the built frontend and API on port `3000` by default. Configure `PORT` if your hosting platform requires another port. Set `NODE_ENV=production` in the hosting environment.

## API

### `POST /api/summarize`

Request:

```json
{
  "url": "https://example.com/article"
}
```

Success response:

```json
{
  "title": "Example article title",
  "sourceUrl": "https://example.com/article",
  "summary": "Summary ...\n\nKey takeaways\n- ...",
  "extractedChars": 5840
}
```

`GET /api/health` reports API health and whether a Gemini key is configured.

## Configuration

- `GEMINI_API_KEY` — required for summaries.
- `GEMINI_MODEL` — optional Gemini model override. The default is `gemini-3.5-flash-lite`; model availability and free-tier limits can vary by account and region.
- `PORT` — optional backend port.

## Notes and limitations

- This scraper processes **public HTML pages**. It does not run browser JavaScript, log into sites, or bypass bot protection.
- Some websites disallow automated access or require client-side rendering; those pages may fail or produce limited text.
- The server rejects non-standard ports, private/reserved IP targets, and redirects to unsafe destinations. Requests have a 12-second timeout and a 1.5 MB response limit.
- The endpoint is rate-limited to 15 requests per IP per 15 minutes. Production deployments should also add appropriate monitoring, stricter abuse controls, and review target sites' terms and robots policies.
- On Gemini's free tier, quotas and data-use terms apply. Review Google's current [Gemini API pricing and free-tier details](https://ai.google.dev/gemini-api/docs/pricing).
