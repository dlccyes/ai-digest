# My AI Digest

## Deployment

The public site at https://ai-digest.derricklin.net/ is hosted on **Cloudflare Pages Free** from this repository.

- Pages project: `derricklin-ai-digest` (`https://derricklin-ai-digest.pages.dev/`).
- Git integration: `dlccyes/ai-digest`; pushes to `main` automatically build and deploy production. Other branches use preview deployments.
- Build root: repository root; command: `hugo --minify`; output directory: `public`.
- Build variable in both Production and Preview: `HUGO_VERSION=0.150.0` (Hugo Extended).
- Keep `baseURL` in `config.toml` set to `https://ai-digest.derricklin.net`; do not replace it with a Pages deployment URL. This preserves absolute links, canonical metadata, and feeds.
- The customized `themes/fujify` theme is tracked in this repository.
- The custom domain is attached in the Pages project's Custom domains settings. Its proxied DNS record is `CNAME ai-digest -> derricklin-ai-digest.pages.dev`; the site has no Cloudflare Access requirement.

GitHub Pages publishing was retired on 2026-11-09. Its deploy workflow had been failing and the live site was stale. The workflow and the GitHub-specific `CNAME` file are removed; the `gh-pages` branch is retained as historical build output and is no longer deployed.
