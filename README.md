# SEO Miner

SEO Miner is a modern SEO research workspace for extracting keywords from public pages, comparing competitor language, finding keyword gaps, and turning research into draft content with an AI writer.

Live demo: https://seokeywordminer.vercel.app

## Features

- Extract SEO-relevant keywords from any public URL.
- Compare competitor pages and surface keyword gaps.
- Auto-scroll to the generated report after extraction finishes.
- Export reports as CSV or JSON.
- Generate SEO-friendly draft content from a topic, target keywords, and word count.
- Responsive interface with sticky navigation, mobile menu, legal pages, and contact form.
- Free to use with no login required.

## Tech Stack

- Next.js 16
- React 19
- JavaScript
- Tailwind CSS 4
- Framer Motion
- Lucide React icons
- Nodemailer contact API
- Ollama-compatible AI API integration

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

Create a `.env.local` file and configure the services you use:

```bash
OLLAMA_HOST=https://your-remote-ollama-host.example.com
OLLAMA_API_KEY=
OLLAMA_MODEL=gpt-oss:20b
OLLAMA_KEYWORD_MODEL=gpt-oss:20b
OLLAMA_CONTENT_MODEL=gpt-oss:20b
OLLAMA_TEMPERATURE=0.2

EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password

NEXT_PUBLIC_GOOGLE_ANALYTICS=
```

`OLLAMA_API_KEY` is optional and is sent as a Bearer token when your remote provider requires authentication.

## Project Structure

```text
components/      Shared UI such as Header and Footer
pages/           Next.js pages and API routes
pages/api/       Contact and metadata API handlers
services/        AI/content service helpers
styles/          Global styles and Tailwind import
utils/           Keyword, SEO, and parser utilities
```

## Workflow

1. Enter a public page URL.
2. SEO Miner normalizes and fetches page metadata.
3. The app extracts keywords from the current page.
4. Competitor URLs are discovered and analyzed.
5. Keyword gaps are calculated.
6. The report section appears and scrolls into view automatically.
7. Export the report or use the AI Writer to draft content.

## Deployment

The app is built for Vercel deployment. Add the same environment variables in your Vercel project settings before deploying.

## Contributing

Pull requests are welcome. For larger changes, open an issue first so the direction can be discussed.
