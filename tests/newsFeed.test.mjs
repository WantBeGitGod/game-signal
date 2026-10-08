import test from 'node:test'
import assert from 'node:assert/strict'
import { groupNews, homeNews, isFeatured, newsDay, newsStatus, newsTime, selectNews } from '../utils/newsFeed.ts'
const clock = Date.parse('2030-01-04T12:00:00Z')
const selectRecent = (items, filters = {}) => selectNews(items, { now: clock, ...filters })
const homeRecent = items => homeNews(items, 3, clock)
const event = (id, date, extra = {}) => ({ id, title: `Game ${id}`, summary: '一条消息', topics: ['Studio'], kind: 'announcement', created_at: date, updated_at: date, reported_at: date, sources: [], progress: [], ...extra })
test('release dates stay out of news and homepage even when featured; substantive DLC remains news', () => {
  const items = [event(1, '2030-01-04T00:00:00Z', { kind: 'release_schedule', prominence: 'featured', recommendation: 'Release date' }), event(2, '2030-01-02T00:00:00Z', { kind: 'review' }), event(3, '2030-01-03T00:00:00Z', { kind: 'dlc' })]
  assert.deepEqual(selectRecent(items).map(e => e.id), [3, 2])
  assert.deepEqual(homeRecent(items).map(e => e.id), [3, 2])
  assert.equal(items.length, 3)
})
test('homepage prioritizes actual featured events and excludes archive without inventing picks', () => {
  const items = [event(1, '2030-01-03T00:00:00Z'), event(2, '2030-01-01T00:00:00Z', { prominence: 'featured', recommendation: 'New gameplay' }), event(3, '2030-01-04T00:00:00Z', { prominence: 'archive' })]
  assert.deepEqual(homeRecent(items).map(e => e.id), [2, 1])
  assert.equal(isFeatured(items[0]), false)
  assert.equal(isFeatured({ ...items[0], prominence: 'featured' }), false)
})
test('filters combine, sort by substantive update and group using UTC+8', () => {
  const items = [event(1, '2030-01-03T00:00:00Z', { reported_at: '2030-01-01T16:30:00Z' }), event(2, '2030-01-02T01:00:00Z')]
  assert.deepEqual(selectRecent(items).map(e => e.id), [2, 1])
  assert.deepEqual(selectRecent(items, { search: ' GAME 1 ', topic: 'Studio' }).map(e => e.id), [1])
  assert.equal(newsDay('2030-01-01T16:30:00Z'), '2030-01-02')
  assert.equal(groupNews(selectRecent(items)).length, 1)
  assert.equal(selectRecent([...items, event(3, '2030-01-02T00:00:00Z', { prominence: 'archive' })]).length, 2)
})
test('reposts are not progress, corrections and updates have distinct labels', () => {
  const item = event(1, '2030-01-01T00:00:00Z', { progress: [{ action: 'attach_source', recorded_at: '2030-01-02T00:00:00Z' }] })
  assert.equal(newsStatus(item), '新收录')
  item.progress.push({ action: 'update_event', recorded_at: '2030-01-03T00:00:00Z' })
  assert.equal(newsStatus(item), '有新进展')
  item.corrections = [{ recorded_at: '2030-01-04T00:00:00Z', text: 'Correction' }]
  assert.equal(newsStatus(item), '内容更正')
})

test('recent feed expires old items and rejects undated/future items without falling back to import time', () => {
  const items = [event(1, '2030-01-04T00:00:00Z'), event(2, '2029-12-01T00:00:00Z', { updated_at: '2030-01-04T00:00:00Z', prominence: 'featured', recommendation: 'Old important news' }), event(3, '2030-01-04T00:00:00Z', { reported_at: null }), event(4, '2030-01-05T00:00:00Z')]
  assert.deepEqual(selectRecent(items).map(e => e.id), [1])
  assert.deepEqual(homeRecent(items).map(e => e.id), [1])
  assert.equal(selectNews(items, { now: clock + 8 * 86400000 }).length, 0)
})
test('a recent repost cannot freshen a legacy event; substantive progress can', () => {
  const item = event(1, '2030-01-04T00:00:00Z', { reported_at: undefined, progress: [{ action: 'create_event', source_published_at: '2029-12-01T00:00:00Z' }, { action: 'attach_source', source_published_at: '2030-01-03T00:00:00Z' }] })
  assert.equal(selectRecent([item]).length, 0)
  item.progress.push({ action: 'update_event', source_published_at: '2030-01-04T00:00:00Z' })
  assert.equal(newsTime(item), '2030-01-04T00:00:00Z')
  assert.equal(selectRecent([item]).length, 1)
})
