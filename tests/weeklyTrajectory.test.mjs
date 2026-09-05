import test from "node:test"
import assert from "node:assert/strict"
import { weeklyTrajectory } from "../utils/weeklyTrajectory.ts"

test("absent from top five differs from a missing published day", () => {
  const result = weeklyTrajectory("2026-08-24", "2026-08-30", ["2026-08-24", "2026-08-25"], [{ date: "2026-08-24", rank: 2 }])
  assert.equal(result.length, 7)
  assert.deepEqual(result.map(day => day.status), ["ranked", "outside", "unknown", "unknown", "unknown", "unknown", "unknown"])
})
test("an actual star outside the top five retains its model rank", () => {
  const [day] = weeklyTrajectory("2026-08-19", "2026-08-19", ["2026-08-19"], [{ date: "2026-08-19", rank: 6, actual_star: true }])
  assert.equal(day.rank, 6)
  assert.equal(day.star, true)
})
test("old archives never infer complete coverage from another game's absence", () => {
  const result = weeklyTrajectory("2026-06-01", "2026-06-02", undefined, [{ date: "2026-06-01", rank: 1 }])
  assert.equal(result[1].status, "unknown")
})
