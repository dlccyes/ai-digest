---
name: economist-short-summary
description: Scheduled job "Economist short summary". Summarize the best recent Economist article into ai-digest. Run only when invoked by name or by a scheduled task.
---

# Economist short summary

Before starting, read `/Users/dlcc/.codex/automations/economist-short-summary/memory.md` if present. When done, append a dated entry with what was picked or produced, the output path, and the commit hash or failure reason.

Use [$publication-article-summary-note-writer](/Users/dlcc/github/ai-digest/.agents/skills/publication-article-summary-note-writer/SKILL.md) to create one summary note from `/Users/dlcc/Library/CloudStorage/GoogleDrive-derricken968@gmail.com/My Drive/📖 Books/The Economist`. For this run: repo root is `/Users/dlcc/github/ai-digest`; output directory is `content/economics/`; tag is `the-economist`; title and filename format is `The Economist YYYYMMDD Article Title Summary`; choose the best article with preference order economy first, then politics, then society, then other topics. Git publish: yes.
