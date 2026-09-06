import test from "node:test"
import assert from "node:assert/strict"
import { distinctPastStars } from "../utils/distinctPastStars.ts"
const issue = (date, appid, legacy = false) => ({ date, [legacy ? "main_signal" : "star_signal"]: { game: { appid, slug: `game-${appid}` } } })
test("homepage excludes today's game, keeps the latest unique games and fills three slots", () => {
  const result = distinctPastStars([issue("2026-09-01", "2"), issue("2026-09-03", "1"), issue("2026-09-02", "2"), issue("2026-08-31", "3", true), issue("2026-08-30", "4")], issue("2026-09-04", "1"))
  assert.deepEqual(result.map(row => row.date), ["2026-09-02", "2026-08-31", "2026-08-30"])
})
test("short history never fills empty slots with duplicate games", () => {
  assert.equal(distinctPastStars([issue("2026-09-03", "1")], issue("2026-09-04", "1")).length, 0)
})
