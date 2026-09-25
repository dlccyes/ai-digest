---
name: leetcode-medium-hard-summary
description: Scheduled job "LeetCode medium-hard summary". Write an ai-digest note on the highest-frequency Google medium/hard LeetCode problem. Run only when invoked by name or by a scheduled task.
---

# LeetCode medium-hard summary

Before starting, read `/Users/dlcc/.codex/automations/leetcode-medium-hard-summary/memory.md` if present. When done, append a dated entry with what was picked or produced, the output path, and the commit hash or failure reason.

Use [$publication-article-summary-note-writer](/Users/dlcc/github/ai-digest/.agents/skills/publication-article-summary-note-writer/SKILL.md) as the note-writing workflow to create one summary note from `/Users/dlcc/github/leetcode/leetcode_google_past_6_mos_20260419.json`. For this run: repo root is `/Users/dlcc/github/ai-digest`; output directory is `content/career/`; tag is `leetcode`; title and filename format is `LeetCode <difficulty> <questionFrontendId> <title> Summary`. Inspect the questions in the JSON file, filter to `difficulty` in `MEDIUM` or `HARD`, sort by `frequency` descending, and choose the single highest-frequency problem overall. At the very start of the note body, immediately after the YAML frontmatter and any generated-by line required by the note-writing workflow, include this exact quick-facts section before any other headings or prose:

## Quick facts

- Difficulty: `<difficulty>`
- Problem: [<title>](https://leetcode.com/problems/<titleSlug>/)
- Topics: `<topicTags[0].name>`, `<topicTags[1].name>`, ...

Use the selected problem's `difficulty`, `title`, `titleSlug`, and `topicTags[].name` values from the JSON. Format each topic as its own backticked value, separated by commas. Do not use the labels `Problem link` or `Main tags`. In the note body, focus on the high level: explain the gist of the problem statement, the optimal solution or solutions, and how to derive them in a very easy-to-understand way. Put the `## Python solution` section before the `## Interview follow-ups` section. Under `## Python solution`, include the full production-level Python code directly in that section, using descriptive naming, modular design, and comments. Do not add a second Python/code/code-solution section later in the note. In `## Interview follow-ups`, do not use condensed bullet points; use `###` headers for each realistic follow-up question an interviewer may ask, and under each header explain the expected solution approach, why it works, and any important complexity tradeoffs. Do not include the source frequency in the note. Git publish: yes.
