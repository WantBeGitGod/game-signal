import test from "node:test"
import assert from "node:assert/strict"
import { chartCoordinates, chartSegments, windowPoints } from "../utils/chartGeometry.ts"
const points = ["00:00:00", "00:10:00", "06:10:00"].map(datetime => ({datetime: `2026-09-04 ${datetime}`, players: 10}))
test("actual time determines x spacing", () => {
  const result = chartCoordinates(points, 0, 370, 0, 100, 20)
  assert.equal(result[1].x, 10)
  assert.equal(result[2].x, 370)
})
test("offline gaps split segments without filling zero", () => {
  assert.deepEqual(chartSegments(points).map(segment => segment.length), [2, 1])
  assert.equal(chartSegments(points).flat().length, 3)
})
test("empty historical window never falls back to future observations", () => {
  assert.deepEqual(windowPoints(points, "2026-08-01", "2026-08-31"), [])
})
test("single observation stays finite", () => {
  assert.equal(chartCoordinates(points.slice(0, 1), 0, 100, 0, 100, 20)[0].x, 50)
})
