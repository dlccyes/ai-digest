---
name: tech-short-summary
description: Scheduled job "Tech short summary". Summarize the most interesting recent Techmeme, Pragmatic Engineer or TBPN piece into ai-digest. Run only when invoked by name or by a scheduled task.
---

# Tech short summary

Before starting, read `/Users/dlcc/.codex/automations/tech-short-summary/memory.md` if present. When done, append a dated entry with what was picked or produced, the output path, and the commit hash or failure reason.

Use [$publication-article-summary-note-writer](/Users/dlcc/github/ai-digest/.agents/skills/publication-article-summary-note-writer/SKILL.md) as the note-writing workflow to create one summary note from the most interesting recent piece across these sources: Techmeme, The Pragmatic Engineer, and TBPN. For this run: repo root is `/Users/dlcc/github/ai-digest`; output directory is `content/tech/`; title and filename format is `<source> YYYYMMDD Article Title Summary`, where `YYYYMMDD` is the piece date when available, otherwise today's date. Inspect the latest material from all three sources and pick the single most interesting piece overall rather than forcing one source per run. Use a source-specific tag instead of the generic `tech` tag: `techmeme` for Techmeme, `the-pragmatic-engineer` for The Pragmatic Engineer, and `tbpn` for TBPN. The note's only tag should be the matching source tag. Prefer a concrete linked article, post, or episode page over a roundup page when possible. Early in the note body, explicitly state which source surfaced the piece and link to the original URL in Markdown. Git publish: yes.
