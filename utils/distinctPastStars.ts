import type { DailyIssue } from "../types/public"

// Archive history remains intact; only homepage discovery cards are deduplicated.
export function distinctPastStars(issues: DailyIssue[], current: DailyIssue | null, limit = 3): DailyIssue[] {
  const identity = (issue: DailyIssue) => {
    const game = (issue.star_signal || issue.main_signal).game
    return game.appid ? `appid:${game.appid}` : `slug:${game.slug}`
  }
  const seen = new Set(current ? [identity(current)] : [])
  return [...issues].sort((a, b) => b.date.localeCompare(a.date)).filter(issue => {
    const key = identity(issue)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, limit)
}
