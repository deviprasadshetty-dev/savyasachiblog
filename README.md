# Savyasachi Blog

A timeless single-page blog site and post reader in vanilla HTML, CSS, and JS. Drop UTF-8 `.txt` files into `/posts/`, push to a server with directory listing support, and it's live.

## Repo Structure
```
/
├── index.html      # Blog list view
├── post.html       # Individual post reader
├── css/
│   ├── main.css    # Shared & list styles
│   └── reader.css  # Reader-specific styles
├── js/
│   └── loader.js   # Post fetching & parsing
└── posts/          # Add your .txt posts here
    └── YYYY-MM-DD_url-safe-title.txt
```

## Adding Posts
1. Name files as `YYYY-MM-DD_url-safe-title.txt` (e.g., `2023-09-13_my-first-post.txt`).
2. Format:
   - Line 1: Title
   - Line 2: Subtitle (optional, leave blank if none)
   - Line 3: Comma-separated tags (e.g., `tech,js,blog`)
   - Line 4: Empty line
   - Line 5+: Markdown body (supports **bold**, *italic*, `code`, [link](url), paragraphs via double newlines; blockquotes with > )

Example:
```
My First Post
A subtitle here
tech,writing
 

This is the body. **Bold** and *italic* work.

> This is a blockquote.

Inline `code` and [links](https://example.com).
```

## Serving
- **Local development**: Run `python -m http.server` (or equivalent) from the root. Visit `http://localhost:8000`.
- **Production**: Deploy to any static host that enables directory listing for `/posts/` (e.g., Netlify, Vercel with config; GitHub Pages requires a workaround like generating an index.json).
- No build step—pure static. Theme persists via localStorage. Print-optimized reader.
- Lighthouse ≥95 on mobile (semantic HTML, preload, minimal JS).

Push your posts, done. Timeless.
## Static Site Deployment
For static hosts like GitHub Pages/Netlify (no directory listing):
- Use posts.json as the post index (update it when adding posts).
- Individual .txt files are fetched by name.
- Local dev still works with python -m http.server.