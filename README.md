# Sigcraft — Email Signature Generator

A fast, no-account email signature generator with:

- **3 templates** — Minimal, Classic, Social
- **Logo color extraction** — paste a logo URL and auto-derive brand colors from the image
- **URL-shareable config** — your entire config lives in the URL hash, no backend needed
- **Outlook compatibility mode** — toggle to preview how the signature degrades in Outlook
- **Copy as rich text or raw HTML** — paste directly into Gmail, Outlook, or Apple Mail
- **Download as `.html`** — for apps that accept file-based signatures

## Quickstart

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Cloudflare Pages

```bash
npm run deploy
```

One-time setup: `wrangler login` then run the command above. Zero config required.

Or connect the repo to Cloudflare Pages in the dashboard — set build command `npm run build`, output dir `dist`.

## How it works

- **URL state** — `SignatureConfig` is base64-encoded into the URL hash on every keystroke (debounced 400ms). Sharing the URL gives anyone an instant live preview of your setup.
- **Color extraction** — draws the logo to a hidden canvas, samples pixel data, buckets into a 32-step color cube, and returns the top dominant colors (skipping near-white/black since those dominate most logos but aren't useful brand colors).
- **Template rendering** — templates are pure functions `(config) -> HTML string` using table-based layouts and inline styles, so they render correctly in Outlook, Gmail, and Apple Mail.
- **Outlook mode** — applies a CSS class that strips `border-radius`, `box-shadow`, `background-image`, and normalizes `line-height` — the main properties Outlook ignores.

## Bring your own logo

Any publicly accessible image URL works. For best color extraction results, use a CDN-hosted image with CORS headers. If the image blocks cross-origin access, the extractor will return nothing and fall back silently.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · Cloudflare Pages

No backend. No analytics. No accounts. Everything runs in the browser.

## License

MIT
