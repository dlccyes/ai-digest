---
name: backcountry-ski-summary
description: Scheduled job "Backcountry ski summary". Summarize the most interesting recent Backcountry Magazine (or WildSnow) article into ai-digest. Run only when invoked by name or by a scheduled task.
---

# Backcountry ski summary

Before starting, read `/Users/dlcc/.codex/automations/backcountry-ski-summary/memory.md` if present. When done, append a dated entry with what was picked or produced, the output path, and the commit hash or failure reason.

Use [$publication-article-summary-note-writer](/Users/dlcc/github/ai-digest/.agents/skills/publication-article-summary-note-writer/SKILL.md) to create one summary note from `/Users/dlcc/Library/CloudStorage/GoogleDrive-derricken968@gmail.com/My Drive/📖 Books/Backcountry Magazine`. For this run: repo root is `/Users/dlcc/github/ai-digest`; output directory is `content/sports/`; tag is `skiing`; title and filename format is `Backcountry IssueXXX Article Title Summary`; choose the single most interesting article from the latest 2 issues, with preference order interesting stories first, then knowledge and how-to, then other topics. If neither of the latest 2 issues has a suitable candidate, then choose one reasonably recent piece from [WildSnow All Posts Listed](https://wildsnow.com/resources/all-ski-touring-blog-posts/), not necessarily the newest but not too old, with the same preference order and a bias against thin gear blurbs; when using WildSnow, use title and filename format `WildSnow YYYYMMDD Article Title Summary`. Git publish: yes.
