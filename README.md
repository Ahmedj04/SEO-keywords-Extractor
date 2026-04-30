# SEO Keywords Extractor

**Modern AI-powered SEO tool** that helps you discover high-impact keywords, analyze competitors, find keyword gaps — all from just a URL.

Built with **Next.js** • **JavaScript** • **Tailwind CSS**

🔗 **Live Demo:** https://seokeywordminer.vercel.app

![VN20260112_160520-ezgif com-video-to-gif-converter (1)](https://github.com/user-attachments/assets/23d8dc0b-4005-4435-ad9e-3c72ea8703d3)

Current main approach:  
Enter any website URL → tool fetches the content → **AI-powered analysis** extracts important keywords, phrases and provides SEO insights.

## ✨ Main Features

- **Instant Keyword Extraction** — enter any URL and get high-impact keywords  
- **AI-enhanced analysis** — uses modern language models + NLP for contextual understanding  
- **Keyword Gap Analysis** — discover opportunities your site is missing    
- Basic Competitor Analysis
- Clean, minimalistic single-page interface  
- Free to use (no login required)  
- Fast processing for most pages

### New: AI Writer
Generate complete **SEO-optimized articles** directly in the tool!  
Just provide:
- Content title/topic
- Target keywords (comma-separated)
- Desired style (Short & Sweet / Concise & Clear / In-Depth / Comprehensive)

→ One-click generation of ready-to-publish content

## 🚀 Tech Stack

- **Framework**: Next.js
- **Language**: JavaScript
- **Styling**: Tailwind CSS 
- **Deployment**: Vercel  
- **Backend fetching**: API routes  
- **AI part**: Ollama remote models

## Ollama Setup

Point the app at a remote Ollama-compatible API host that serves `gpt-oss:20b`. The app calls `/api/chat` on this host, so set `OLLAMA_HOST` to the base URL only.

```bash
OLLAMA_HOST=https://your-remote-ollama-host.example.com
OLLAMA_API_KEY=
OLLAMA_MODEL=gpt-oss:20b
OLLAMA_KEYWORD_MODEL=gpt-oss:20b
OLLAMA_CONTENT_MODEL=gpt-oss:20b
OLLAMA_TEMPERATURE=0.2
```

`OLLAMA_API_KEY` is optional and is sent as a Bearer token when your remote provider requires authentication.

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Ahmedj04/SEO-keywords-Extractor.git

# 2. Enter project directory
cd SEO-keywords-Extractor

# 3. Install dependencies
npm install
# or yarn install
# or pnpm install
# or bun install

# 4. Run development server
npm run dev
# or yarn dev
# or pnpm dev
# or bun dev
```
## 🤝 Contributing
Pull requests are welcome!
For major changes, please open an issue first to discuss what you would like to change.

Fork the Project
Create your Feature Branch (git checkout -b feature/cool-feature)
Commit your Changes (git commit -m 'Add cool feature')
Push to the Branch (git push origin feature/cool-feature)
Open a Pull Request
