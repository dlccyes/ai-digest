---
name: sports-forecast-digest
description: Build and publish the combined Capitola/Cowell surf and Skydive California forecast page from ndoli forecast notes, with an optional highlight-only Telegram notification. Use for the recurring ai-digest sports forecast or when refreshing its stable forecast page.
---

# Sports Forecast Digest

## Fixed Locations

- Repository: `/Users/dlcc/github/ai-digest`
- Surf and skydive source notes: `/Users/dlcc/github/ndoli/ai-summary/`
- Published Markdown page: `/Users/dlcc/github/ai-digest/content/sports/weekend-forecast.md`
- Public URL: `https://ai-digest.derricklin.net/forecast/`

The caller decides whether to git-publish and whether to send Telegram. Never infer Telegram authorization merely because this is an unattended or recurring run.

## Select Source Notes

Select the newest `Capitola Cowell Surf * Summary.md` and newest `Skydive California * Summary.md`. Determine recency from the forecast date range in each filename, not filesystem modification time.

Treat a missing source or one more than eight days old as unavailable. Continue building the page, use unknown calendar verdicts for that sport, and state the missing or stale condition immediately after the calendar. Never silently substitute an older forecast.

## Build The Stable Page

Overwrite the existing target page; never create a dated variant. Preserve this frontmatter shape, setting `date` to the run date:

```yaml
---
title: Weekend Forecast
url: /forecast/
date: YYYY-MM-DD
tags: [forecast, surfing, skydiving]
---
```

The `url` value is an invariant used by the site sidebar and provides the stable public URL.

Write the body in this order:

1. A short opening highlight naming the single best surf window and single best jump window.
2. `## Summary Calendar`.
3. `## Surfing`, containing the surf note's Bottom Line and Daily Tables.
4. `## Skydiving`, containing the skydive note's Bottom Line and Daily Tables.
5. `## Safety`, containing the surf note's Safety material.
6. Source note filenames and their generation dates.

Preserve forecast verdict emoji, direction arrows, and `▲`/`▼` markers exactly. Convert Obsidian wikilinks to ordinary display text.

## Summary Calendar

Use one column for every forecast date and exactly two rows: `Morning` and `Afternoon`. Morning contains samples before noon; Afternoon contains samples at or after noon. Every data cell contains only the compact pair `🏄<surf-verdict> ✈️<skydive-verdict>`, where each verdict is one of `✅`, `⚠️`, `❌`, or `❓`.

For surf, use the highest standalone or alone score across Capitola and Cowell in the period:

- `✅` for 7 or higher.
- `⚠️` for 4 through 6.5.
- `❌` below 4, or when every sample is `N/A`.
- `❓` when the surf source is missing or stale.

For skydiving, use the best `Flyable` verdict in the period, ordered `✅` over `⚠️` over `❌`. Use `❓` when the skydive source is missing or stale.

## Publish

When git publishing is requested, commit and push only the refreshed forecast page. Confirm the push succeeds before sending a Telegram message so the public link resolves to the new forecast.

## Telegram Highlight

Only when the caller explicitly requests and authorizes delivery, use [$telegram-notifier](/Users/dlcc/github/ndoli/.agents/skills/telegram-notifier/SKILL.md). The notifier lives in `ndoli`, not this repository, so always use that absolute skill path.

Compose a concise Markdown message containing only:

1. The opening highlight naming the best surf and jump windows.
2. The complete Summary Calendar table and any immediately following missing or stale-source note.
3. `[View the full forecast](https://ai-digest.derricklin.net/forecast/)`.

Do not include frontmatter, detailed Surfing or Skydiving sections, Safety, sources, or any other part of the page. Pass only this concise message to the notifier in Markdown format with the title `Weekend Sports Forecast`. Dry-run the exact message before sending it.

Keep Telegram credentials secret. Do not claim delivery unless every chunk is confirmed sent. If delivery fails, preserve the published page and report the run as failed.

## Checks

- Confirm the page uses the fixed path, frontmatter, section order, and public URL.
- Confirm the calendar has only Morning and Afternoon rows and follows both scoring mappings.
- Confirm the Telegram message contains the opening highlight, Summary Calendar, and link—and none of the detailed Surfing, Skydiving, Safety, or source sections.
- If requested, confirm both git push and Telegram delivery succeeded.
