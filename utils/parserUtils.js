const cheerio = require('cheerio');

export function extractRelevantContent(metadata) {
   const $ = cheerio.load(metadata);
  // 1. Remove ALL noise elements first
  $('script, style, nav, footer, header, aside, iframe, noscript, ' +
    '.cookie-banner, .ads, .sidebar, [aria-hidden="true"]').remove();

  const parts = [];

  // Always grab meta tags — they're tiny and SEO-relevant
  const title = $('title').text().trim();
  const metaDesc = $('meta[name="description"]').attr('content');
  const metaKeys = $('meta[name="keywords"]').attr('content');
  
  if (title) parts.push(`Title: ${title}`);
  if (metaDesc) parts.push(`Meta Description: ${metaDesc}`);
  if (metaKeys) parts.push(`Meta Keywords: ${metaKeys}`);

  // Grab headings (very token-efficient, high signal)
  const headings = [];
  $('h1, h2, h3').each((_, el) => {
    const text = $(el).text().trim();
    if (text) headings.push(text);
  });
  if (headings.length) parts.push(`Headings: ${headings.join(' | ')}`);

  // Grab main content area, truncated
  const mainContent = $('main, article, [role="main"], .content').first().text()
    .replace(/\s+/g, ' ').trim();
  
  if (mainContent) {
    parts.push(`Content: ${mainContent.slice(0, 2000)}`); // hard cap at 2000 chars
  } else {
    // Fallback: body text, heavily truncated
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    parts.push(`Content: ${bodyText.slice(0, 2000)}`);
  }

  return parts.join('\n');
}

export function extractJson(text) {
    const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
        return JSON.parse(cleanedText);
    } catch {
        const objectStart = cleanedText.indexOf('{');
        const objectEnd = cleanedText.lastIndexOf('}');
        const arrayStart = cleanedText.indexOf('[');
        const arrayEnd = cleanedText.lastIndexOf(']');

        if (objectStart !== -1 && objectEnd > objectStart) {
            return JSON.parse(cleanedText.slice(objectStart, objectEnd + 1));
        }

        if (arrayStart !== -1 && arrayEnd > arrayStart) {
            return JSON.parse(cleanedText.slice(arrayStart, arrayEnd + 1));
        }

        throw new Error('No valid JSON found in Ollama response');
    }
}