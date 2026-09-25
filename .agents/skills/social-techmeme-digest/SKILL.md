---
name: social-techmeme-digest
description: Scheduled job "Social techmeme digest". Write the tech and general social briefings from Reddit and Blind into ai-digest. Run only when invoked by name or by a scheduled task.
---

# Social techmeme digest

Before starting, read `/Users/dlcc/.codex/automations/social-techmeme-digest/memory.md` if present. When done, append a dated entry with what was picked or produced, the output path, and the commit hash or failure reason.

Use [$publication-article-summary-note-writer](/Users/dlcc/github/ai-digest/.agents/skills/publication-article-summary-note-writer/SKILL.md) to create two summary notes in Techmeme newsletter style briefing format during each run. Both notes must have only the `social` tag.

Techmeme newsletter style refers only to the briefing format and density, not to the subject matter.

Create both notes in the same run:

1. Tech social note
- Output directory: `content/tech/`
- Title stem: `YYYY-MM-DD Social Tech Briefing Summary`
- Focus: tech, AI, startups, workplace, developer tools, internet platforms, and other tech-industry social discussion
- Allowed sources: Reddit and Blind only
- Blind means the public global/English Blind site under `https://www.teamblind.com/`, not the Korean locale under `/kr/` or `kr.teamblind.com`.
- Prefer strong public Reddit tech threads and strong public global Blind discussions.
- Search public global Blind pages first and exclude localized `/kr/` URLs.
- If plain `curl` gets HTTP 403 for a public global Blind post, fetch its HTML with Python `urllib` and a `Googlebot` User-Agent; verify the returned page exposes the public `<h1>` and comment groups.
- Extract the exact Blind post title from the public page `<h1>`.
- Extract only top-level Blind comments from the public HTML comment groups: for each `div id="comment-group-<id>"`, only the first `div id="comment-<id>"` inside that same group counts as top-level. Copy its exact text from `p.whitespace-pre-wrap`; do not use indented replies or nested reply containers.
- When a public top-level Blind comment header exposes a company label on that same top-level comment, include it in the displayed username as `username (Company)`. If no public company label is exposed on that top-level comment, use just `username`.
- When a Blind top-level comment has a visible `comment-<id>` anchor on the public page, use `post_url#comment-<id>` as the direct comment URL.
- Include at least 3 Blind posts in every tech note.
- Search Blind first and keep looking until you have at least 2 suitable public Blind discussions with exact title extraction and exact top-level comment extraction.
- If fewer than 2 suitable public global Blind discussions are publicly verifiable that day, do not substitute extra Reddit posts for the missing Blind slots.

2. General social note
- Output directory: `content/news/`
- Title stem: `YYYY-MM-DD Social General Briefing Summary`
- Focus: general-interest social discussion that is not primarily tech-focused
- Allowed sources: Reddit only
- Use general-interest Reddit communities and non-tech threads. This can be news or non-news, including communities like `r/AskReddit`, as long as the discussion quality is strong
- Include at least 2 news-focused Reddit posts in every general note. The remaining posts can be news or non-news.
- Avoid tech-specific subreddits and avoid AI/startup/workplace-tech threads in this note

Before selecting posts, read the automation memory file if present. Inspect the most recent prior tech social note in `content/tech/` and the most recent prior general social note in `content/news/`. Do not reuse any post URL or post title that appeared in the immediately previous run for that note stream. Also do not let the two notes in the same run share any post URL or post title.

Use only publicly verifiable posts and comments available on the day of the run. Select 5 to 8 top posts for each note based on signal and discussion quality, not just raw volume.

For each post, format the heading exactly as `## [post title](post url) (source)` with a space before `(source)`. If on Reddit, display the subreddit as the source. If on Blind, display `Blind` as the source.

Use the exact source post title and exact source comment text. Do not summarize, paraphrase, clean up, normalize punctuation, shorten, or add filler labels like `top level`. Preserve casing, punctuation, emoji, spelling, and quoting exactly as shown in the source.

Use only top-level comments from the source post. Do not use replies, nested comments, or Blind recomments. Each post must include at least 3 top-level comments in the summary.

When there is a direct comment or reply URL, format each bullet exactly as `- username: [exact comment text](comment url)`.

When there is no direct comment URL, format each bullet exactly as `- username: exact comment text` and do not link it.

If a post title or comment cannot be extracted exactly and publicly verified, skip that post or bullet. If one allowed source for a note is inaccessible that day, use the other allowed source for that note rather than inventing content. Do not borrow posts from the other note's source pool just to fill space. No commentary.

Git publish: yes, for both newly created notes.
