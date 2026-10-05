import test from 'node:test'
import assert from 'node:assert/strict'
import { groupNews, homeNews, isFeatured, newsDay, newsStatus, selectNews } from '../utils/newsFeed.ts'
const event = (id, date, extra = {}) => ({ id, title: `Game ${id}`, summary: '一条消息', topics: ['Studio'], kind: 'announcement', created_at: date, updated_at: date, sources: [], progress: [], ...extra })
test('release dates stay out of news and homepage even when featured; substantive DLC remains news', () => {
  const items = [event(1, '2030-01-04T00:00:00Z', { kind: 'release_schedule', prominence: 'featured', recommendation: 'Release date' }), event(2, '2030-01-02T00:00:00Z', { kind: 'review' }), event(3, '2030-01-03T00:00:00Z', { kind: 'dlc' })]
  assert.deepEqual(selectNews(items).map(e => e.id), [3, 2])
  assert.deepEqual(homeNews(items).map(e => e.id), [3, 2])
  assert.equal(items.length, 3)
})
test('homepage prioritizes actual featured events and excludes archive without inventing picks', () => {
  const items = [event(1, '2030-01-03T00:00:00Z'), event(2, '2030-01-01T00:00:00Z', { prominence: 'featured', recommendation: 'New gameplay' }), event(3, '2030-01-04T00:00:00Z', { prominence: 'archive' })]
  assert.deepEqual(homeNews(items).map(e => e.id), [2, 1])
  assert.equal(isFeatured(items[0]), false)
  assert.equal(isFeatured({ ...items[0], prominence: 'featured' }), false)
})
test('filters combine, sort by substantive update and group using UTC+8', () => {
  const items = [event(1, '2030-01-03T00:00:00Z', { content_updated_at: '2030-01-01T16:30:00Z' }), event(2, '2030-01-02T01:00:00Z')]
  assert.deepEqual(selectNews(items).map(e => e.id), [2, 1])
  assert.deepEqual(selectNews(items, { search: ' GAME 1 ', topic: 'Studio', kind: 'announcement', date: '2030-01-02' }).map(e => e.id), [1])
  assert.equal(newsDay('2030-01-01T16:30:00Z'), '2030-01-02')
  assert.equal(groupNews(selectNews(items)).length, 1)
  assert.equal(selectNews([...items, event(3, '2030-01-02T00:00:00Z', { prominence: 'archive' })]).length, 2)
})
test('reposts are not progress, corrections and updates have distinct labels', () => {
  const item = event(1, '2030-01-01T00:00:00Z', { progress: [{ action: 'attach_source', recorded_at: '2030-01-02T00:00:00Z' }] })
  assert.equal(newsStatus(item), '新收录')
  item.progress.push({ action: 'update_event', recorded_at: '2030-01-03T00:00:00Z' })
  assert.equal(newsStatus(item), '有新进展')
  item.corrections = [{ recorded_at: '2030-01-04T00:00:00Z', text: 'Correction' }]
  assert.equal(newsStatus(item), '内容更正')
})
