---
name: engineering-blog-summary
description: Scheduled job "Engineering blog summary". Summarize the strongest recent engineering post from top AI labs and tech companies into ai-digest. Run only when invoked by name or by a scheduled task.
---

# Engineering blog summary

Before starting, read `/Users/dlcc/.codex/automations/engineering-blog-summary/memory.md` if present. When done, append a dated entry with what was picked or produced, the output path, and the commit hash or failure reason.

Use [$publication-article-summary-note-writer](/Users/dlcc/github/ai-digest/.agents/skills/publication-article-summary-note-writer/SKILL.md) as the note-writing workflow to create one summary note from the most interesting latest engineering or research-engineering blog post from top AI labs and large technology companies. For this run: repo root is `/Users/dlcc/github/ai-digest`; output directory is `content/tech/`; tag is `engineering-blog`; title and filename format is `<source> YYYYMMDD Article Title Summary`, where `YYYYMMDD` is the post date when available, otherwise today's date.

Inspect recent official posts from these source families, prioritizing posts with concrete technical substance over marketing announcements: OpenAI research and product engineering posts; Anthropic research and engineering posts; Google DeepMind blog; Google Research blog; Meta AI blog; Meta Engineering; Microsoft Research and Microsoft engineering blogs; Apple Machine Learning Research; NVIDIA technical and research blogs; Netflix TechBlog; Uber Engineering; Cloudflare Blog engineering posts; AWS Architecture, Compute, and Machine Learning blogs; GitHub Engineering; Stripe Engineering; and Databricks engineering or research posts.

Pick the single strongest post overall rather than forcing rotation across sources. Favor posts about model systems, evals, inference, training infrastructure, reliability, developer tooling, distributed systems, data infrastructure, security engineering, or production lessons. Avoid posts that are mainly product marketing, customer stories, hiring announcements, event recaps, policy commentary, or lightweight launch notes unless they include substantial implementation detail.

Before selecting a post, read the automation memory file if present. Prefer the newest technically strong post; if the newest candidate is weak or promotional, choose an older but stronger post from the recent window.

Use the official post URL as the primary source. Early in the note body, explicitly state which official engineering or research blog published the post and link to the original URL in Markdown. Focus on the core idea, the mechanism or architecture, why the implementation choices matter, and the broader engineering takeaway; do not merely list features.

Git publish: yes.
