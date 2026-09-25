---
name: sciam-short-summary
description: Scheduled job "SciAm short summary". Summarize the best unsummarized Scientific American article into ai-digest. Run only when invoked by name or by a scheduled task.
---

# SciAm short summary

Before starting, read `/Users/dlcc/.codex/automations/sciam-short-summary/memory.md` if present. When done, append a dated entry with what was picked or produced, the output path, and the commit hash or failure reason.

Use [$publication-article-summary-note-writer](/Users/dlcc/github/ai-digest/.agents/skills/publication-article-summary-note-writer/SKILL.md) to create one summary note from the issues in `/Users/dlcc/Library/CloudStorage/GoogleDrive-derricken968@gmail.com/My Drive/📖 Books/Scientific American`. Fetch from all issues, not just the latest. For this run: repo root is `/Users/dlcc/github/ai-digest`; output directory is `content/science/`; tag is `scientific-american`; title and filename format is `Scientific American YYYYMM Article Title Summary`; choose the best article with preference order human consciousness first, then astronomy or quantum physics, then other physics, then math, then other topics, with biology last. If multiple articles are equally strong, choose the most recent. Git publish: yes.
