export interface NewsSource { url: string; title: string; published_at: string | null }
export interface NewsProgress {
  id: number; text: string; evidence_kind: string; source_url: string
  action?: 'create_event' | 'update_event' | 'attach_source'; recorded_at?: string; source_published_at?: string | null
}
export interface NewsEvent {
  id: number; title: string; summary: string; topics: string[]; kind: string
  created_at: string; updated_at: string; sources: NewsSource[]; progress: NewsProgress[]
  reported_at?: string | null; content_updated_at?: string; prominence?: 'featured' | 'normal' | 'archive'; recommendation?: string
  corrections?: { text: string; recorded_at: string }[]
}
export interface TimelineNode {
  id: number; event_id: number; game_name: string; label: string; kind: string
  date_value: string; date_precision: string; platform: string; region: string | null
  source_url: string; updated_at: string
}
export interface WatchedGame {
  name: string; aliases: string[]; developers: string[]; publishers: string[]
  selection_reason: string; official_url: string | null
}
export interface NewsFeed { schema_version: string; generated_at: string; events: NewsEvent[]; timeline: TimelineNode[]; watched_games?: WatchedGame[] }
