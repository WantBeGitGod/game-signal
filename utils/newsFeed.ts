import type { NewsEvent } from '../types/news'

export const newsKinds: Record<string, string> = {
  announcement: '新作与宣发', release_schedule: '发售安排', dlc: '扩展内容',
  major_update: '体验与更新', business: '厂商与行业', development: '游戏体验技术', review: '口碑与评测', industry_event: '展会与发布会'
}
export const evidenceNames: Record<string, string> = {
  official_statement: '官方陈述', original_reporting: '媒体原创报道',
  syndication: '媒体转述', review: '实测与评价', unconfirmed_rumor: '未确认爆料'
}
export function newsTime(event: NewsEvent) {
  if (event.reported_at !== undefined) return event.reported_at || ''
  const initial = event.progress.filter(p => p.action === 'create_event').map(p => p.source_published_at || '').filter(Boolean).sort()
  const updates = event.progress.filter(p => p.action === 'update_event').map(p => p.source_published_at || '').filter(Boolean)
  return [initial[0] || '', ...updates].sort().at(-1) || ''
}
export function isFeatured(event: NewsEvent) {
  return event.prominence === 'featured' && Boolean(event.recommendation?.trim())
}
export function newsDay(value: string) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Hong_Kong', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value))
}
export function newsTimestamp(value: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return '时间待核验'
  return new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Hong_Kong', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value))
}
export function newsStatus(event: NewsEvent) {
  const update = event.progress.filter(p => p.action === 'update_event').map(p => p.recorded_at || '').sort().at(-1) || ''
  const correction = (event.corrections || []).map(p => p.recorded_at).sort().at(-1) || ''
  if (correction && correction >= update) return '内容更正'
  return update ? '有新进展' : '新收录'
}
export function selectNews(events: NewsEvent[], filters: { view?: string; search?: string; topic?: string; now?: number } = {}) {
  const query = (filters.search || '').trim().toLocaleLowerCase()
  const clock = filters.now ?? Date.now()
  return events.filter(e => {
    // Date evidence remains available to the timeline and its source detail pages.
    if (e.prominence === 'archive' || e.kind === 'release_schedule') return false
    const stamp = Date.parse(newsTime(e))
    if (!Number.isFinite(stamp) || stamp > clock || clock - stamp > 7 * 86_400_000) return false
    if (filters.view === 'featured' && !isFeatured(e)) return false
    if (filters.topic && !e.topics.includes(filters.topic)) return false
    return !query || `${e.title} ${e.summary} ${e.topics.join(' ')}`.toLocaleLowerCase().includes(query)
  }).sort((a, b) => Date.parse(newsTime(b)) - Date.parse(newsTime(a)) || b.id - a.id)
}
export function homeNews(events: NewsEvent[], limit = 3, now = Date.now()) {
  const all = selectNews(events, { now })
  return [...all.filter(isFeatured), ...all.filter(e => !isFeatured(e))].slice(0, limit)
}
export function groupNews(events: NewsEvent[]) {
  const groups = new Map<string, NewsEvent[]>()
  for (const event of events) {
    const day = newsDay(newsTime(event))
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(event)
  }
  return [...groups].map(([day, items]) => ({ day, items }))
}
