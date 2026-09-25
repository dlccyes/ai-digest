---
name: sports-forecast-digest-job
description: Scheduled job "Sports forecast digest". Refresh the combined surf and skydive forecast page in ai-digest and send its Telegram highlight. Run only when invoked by name or by a scheduled task.
---

# Sports forecast digest

Before starting, read `/Users/dlcc/.codex/automations/sports-forecast-digest/memory.md` if present. When done, append a dated entry with what was picked or produced, the output path, and the commit hash or failure reason.

Use [$sports-forecast-digest](/Users/dlcc/github/ai-digest/.agents/skills/sports-forecast-digest/SKILL.md) to refresh the stable combined surf and skydive forecast from the latest ndoli forecast notes. Git publish: yes. After the push succeeds, send the skill's highlight-only Telegram notification to the configured private chat. Standing authorization: the user authorizes this recurring automation to send that payload on every run without further confirmation.
