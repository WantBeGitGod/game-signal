import type { DailyIssue, GameArchiveManifest, Manifest, PublicGame, PublicStatus, ScoringSnapshot, WeeklyIssue, WeeklyManifest } from "~/types/public"

export function publicAsset(path: string) {
  const base = useRuntimeConfig().app.baseURL || "/"
  return `${base}${path.replace(/^\/+/, "")}`.replace(/\/{2,}/g, "/")
}

export async function loadPublicJson<T>(path: string): Promise<T> {
  if (import.meta.server) {
    const { readFile } = await import("node:fs/promises")
    const { resolve } = await import("node:path")
    const source = resolve(process.cwd(), "public", path.replace(/^\/+/, ""))
    return JSON.parse(await readFile(source, "utf-8")) as T
  }
  return $fetch<T>(publicAsset(path))
}

export async function loadPublicJsonOrDefault<T>(path: string, fallback: T): Promise<T> {
  try {
    return await loadPublicJson<T>(path)
  } catch {
    return fallback
  }
}

export function useManifest() {
  return useAsyncData<Manifest>("manifest", () => loadPublicJson("/data/manifest.json"))
}

export function useWeeklyManifest() {
  return useAsyncData<WeeklyManifest>("weekly-manifest", () =>
    loadPublicJsonOrDefault<WeeklyManifest>("/data/weekly/manifest.json", {
      schema_version: "1.0.0",
      generated_at: "",
      issues: [],
      preview: true
    })
  )
}

export function useGameArchive() {
  return useAsyncData<GameArchiveManifest>("game-archive", () =>
    loadPublicJsonOrDefault<GameArchiveManifest>("/data/game-archive.json", {
      schema_version: "1.0.0",
      generated_at: "",
      games: []
    })
  )
}

export function useStatus() {
  return useAsyncData<PublicStatus>("status", () => loadPublicJson("/data/status.json"))
}

export function useScoring() {
  return useAsyncData<ScoringSnapshot>("scoring", () =>
    loadPublicJsonOrDefault<ScoringSnapshot>("/data/scoring.json", {
      schema_version: "2.0.0",
      release_event_scoring_effective_date: "2026-07-31",
      new_release_window_days: 30,
      product_family_repeat_window_max_wins: 4,
      product_family_trial_window_max_wins: 3,
      release_review_verification_threshold: 5000,
      major_update_window_days: 14,
      peak_score_weight: 35,
      peak_score_cap: 100000,
      record_growth_weight: 35,
      record_growth_cap: 1,
      days_seen_score_weight: 0,
      signal_type_score_weight: 0,
      yesterday_star_score_multiplier: 0.8,
      cumulative_star_score_multipliers: [0.8, 0.7, 0.6, 0.5],
      discount_comeback_score_multiplier: 0.75,
      comeback_event_lookback_days: 14,
      player_log_weight: 12,
      growth_weight: 10,
      growth_cap: 5,
      days_seen_weight: 1.5,
      days_seen_cap: 7,
      old_game_player_discount: 0.7,
      yesterday_star_player_discount: 0.7,
      consecutive_star_case_threshold: 3,
      daily_signal_type_scores: {
        new_release_rise: 0,
        trial_release_rise: 0,
        formal_release_rise: 0,
        release_event_rise: 0,
        content_update_comeback: 0,
        review_heat_gap: 0,
        sustained_growth: 0,
        discount_comeback: 0,
        comeback: 0
      },
      release_event_multipliers: {
        true_new: 1,
        trial: 1,
        formal_release: 0.85,
        pending: 0.85,
        major_update: 0.7
      },
      signal_bonuses: {
        sudden_breakout: 35,
        new_release_rise: 30,
        comeback: 32,
        review_heat_gap: 25,
        sustained_growth: 28
      }
    })
  )
}

export function useIssue(date: MaybeRefOrGetter<string>) {
  const value = toValue(date)
  return useAsyncData<DailyIssue>(`issue-${value}`, () => loadPublicJson(`/data/issues/${value}.json`))
}

export function useGame(slug: MaybeRefOrGetter<string>) {
  const value = toValue(slug)
  return useAsyncData<PublicGame>(`game-${value}`, () => loadPublicJson(`/data/games/${value}.json`))
}

export function useLatestGameQuickTake(game: PublicGame, starDates: string[], memberAppids: string[] = []) {
  const dates = [...starDates].sort().reverse()

  return useAsyncData(`game-quick-take-${game.slug}`, async () => {
    for (const date of dates) {
      const issue = await loadPublicJsonOrDefault<DailyIssue | null>(`/data/issues/${date}.json`, null)
      if (!issue) continue

      const signals = [issue.star_signal, issue.main_signal, ...(issue.secondary_signals || [])]
      const matchingSignal = signals.find(signal =>
        signal?.quick_take
        && (
          signal.game.slug === game.slug
          || (game.appid && signal.game.appid === game.appid)
          || Boolean(signal.game.appid && memberAppids.includes(signal.game.appid))
          || (
            game.product_family_identity
            && signal.game.product_family_identity === game.product_family_identity
          )
        )
      )

      if (matchingSignal?.quick_take) {
        return {
          issue_date: date,
          brief: matchingSignal.quick_take
        }
      }
    }

    return {
      issue_date: null,
      brief: null
    }
  })
}

export function useWeeklyIssue(slug: MaybeRefOrGetter<string>) {
  const value = toValue(slug)
  return useAsyncData<WeeklyIssue>(`weekly-${value}`, () => loadPublicJson(`/data/weekly/${value}.json`))
}
