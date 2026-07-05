export type TrendPoint = {
  date: string
  peak: number
}

export type PublicGame = {
  slug: string
  appid?: string
  name: string
  name_cn?: string
  description?: string
  release_date?: string
  genres: string[]
  tags: string[]
  review_score?: string
  review_ratio?: number
  review_total: number
  developer?: string
  publisher?: string
  cover_image_url?: string
  steam_url?: string
  trend: TrendPoint[]
}

export type Signal = {
  rank: number
  type: string
  label: string
  score: number
  fact_summary: string
  metrics: Record<string, unknown>
  star_appearance?: {
    count: number
    prior_count: number
    month_prior_count: number
  }
  sources: Array<{ title: string; url: string }>
  game: PublicGame
}

export type DailyIssue = {
  schema_version: string
  date: string
  title: string
  summary: string
  status: string
  hero_image?: string | null
  hero_state: "approved" | "data-cover"
  star_signal?: Signal
  main_signal: Signal
  secondary_signals: Signal[]
  candidate_signals?: Signal[]
}

export type ScoringSnapshot = {
  schema_version: string
  new_release_window_days: number
  peak_score_weight: number
  peak_score_cap: number
  record_growth_weight: number
  record_growth_cap: number
  days_seen_score_weight: number
  signal_type_score_weight: number
  yesterday_star_score_multiplier: number
  cumulative_star_score_multipliers: number[]
  discount_comeback_score_multiplier: number
  comeback_event_lookback_days: number
  player_log_weight: number
  growth_weight: number
  growth_cap: number
  days_seen_weight: number
  days_seen_cap: number
  old_game_player_discount: number
  yesterday_star_player_discount: number
  consecutive_star_case_threshold: number
  daily_signal_type_scores: Record<string, number>
  signal_bonuses: Record<string, number>
}

export type Manifest = {
  schema_version: string
  generated_at: string
  latest_issue: string
  issues: string[]
  preview: boolean
}

export type PublicStatus = {
  generated_at: string
  data_state: string
  latest_collection_at?: string | null
  latest_live_collection_at?: string | null
  latest_issue_date?: string | null
  latest_publish_at?: string | null
  latest_publish_status?: string | null
  continuous_live_days: number
  is_delayed: boolean
}

export type ChartPoint = {
  datetime: string
  players: number
  average_players?: number
}

export type ChartSeries = {
  appid: string
  source: string
  source_url: string
  points: ChartPoint[]
  daily_peaks: Array<{ date: string; peak: number; peak_time: string }>
  all_time_or_window_peak: { players: number; datetime?: string | null }
  imported_at: string
}

export type WeeklySignal = {
  rank: number
  signal_type: string
  label: string
  score: number
  selection_reason: string
  metrics: Record<string, number | string | boolean | null | TrendPoint[]>
  chart_status: string
  case_selected: boolean
  case_slug?: string | null
  chart_path?: string | null
  game: {
    slug: string
    appid?: string
    name: string
    description?: string
    developer?: string
    publisher?: string
    release_date?: string
    review_ratio?: number
    review_total: number
    cover_image_url?: string
    steam_url?: string
  }
}

export type WeeklyIssue = {
  schema_version: string
  slug: string
  issue_number: number
  week_start: string
  week_end: string
  title: string
  summary: string
  status: string
  published_at?: string | null
  signals: WeeklySignal[]
}

export type WeeklyManifest = {
  schema_version: string
  generated_at: string
  latest_weekly?: string
  issues: Array<{
    slug: string
    issue_number: number
    week_start: string
    week_end: string
    title: string
    summary: string
    status: string
    published_at?: string | null
  }>
  preview: boolean
}
