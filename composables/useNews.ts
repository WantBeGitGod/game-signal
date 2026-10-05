import type { NewsFeed } from '~/types/news'

export function useNews() {
  return useAsyncData<NewsFeed>('game-news', () => loadPublicJsonOrDefault<NewsFeed>('/data/news.json', {
    schema_version: '1.0', generated_at: '', events: [], timeline: []
  }))
}

export function newsDate(value: string) {
  return value ? new Date(value).toLocaleDateString('zh-CN', { timeZone: 'Asia/Hong_Kong', month: 'long', day: 'numeric' }) : ''
}

export function timelineDate(value: string) {
  if (/^\d{4}$/.test(value)) return `${value} 年 · 月份待定`
  if (/^\d{4}-Q[1-4]$/.test(value)) return `${value.slice(0, 4)} 年 第 ${value.slice(-1)} 季度`
  if (/^\d{4}-\d{2}$/.test(value)) return `${value.slice(0, 4)} 年 ${Number(value.slice(5))} 月`
  const [year, month, day] = value.split('-')
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`
}
