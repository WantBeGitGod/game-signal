<template>
  <div v-if="issue" class="page-shell weekly-page">
    <header class="weekly-hero">
      <p class="eyebrow">GAME SIGNAL WEEKLY</p>
      <h1>{{ issue.title }}</h1>
      <p class="weekly-issue-meta">第 {{ String(issue.issue_number).padStart(3, "0") }} 期 / 覆盖 {{ issue.week_start }} - {{ issue.week_end }}</p>
      <p>{{ issue.summary }}</p>
      <p v-if="coverageNote" class="weekly-coverage-note">{{ coverageNote }}</p>
    </header>

    <section class="weekly-watch-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">WEEK IN REVIEW</p>
          <h2>这一周，谁一直留在牌桌上</h2>
        </div>
      </div>
      <div v-if="starTimeline.length" class="weekly-star-timeline" aria-label="今日之星时间线">
        <div v-for="day in starTimeline" :key="day.date" class="weekly-star-day">
          <span>{{ shortDate(day.date) }}</span>
          <strong>{{ day.game }}</strong>
          <small>今日之星</small>
        </div>
      </div>
      <div class="weekly-ranking-table" role="table" aria-label="本周复选前五">
        <div class="weekly-ranking-row is-head" role="row">
          <span>排名</span><span>游戏</span><span>摘星</span><span>前二</span><span>前五</span><span>平均名次</span><span>复选分</span>
        </div>
        <div v-for="signal in issue.signals" :key="signal.rank" class="weekly-ranking-row" role="row">
          <strong>#{{ signal.rank }}</strong>
          <span>{{ signal.game.name }}</span>
          <span>{{ metric(signal, "actual_star_count") }}</span>
          <span>{{ metric(signal, "top_two_days") }} 天</span>
          <span>{{ metric(signal, "top_five_days") }} 天</span>
          <span>{{ metric(signal, "average_rank") }}</span>
          <strong>{{ metric(signal, "weekly_score") }}</strong>
        </div>
      </div>
    </section>

    <section class="weekly-deep-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">TWO ARTICLES</p>
          <h2>本期两篇文章</h2>
        </div>
        <p>次序只服务版面，不代表质量高低。</p>
      </div>
      <article v-for="(signal, index) in articleSignals" :key="signal.rank" class="weekly-signal-block">
        <div class="weekly-signal-rank">{{ index === 0 ? "A" : "B" }}</div>
        <div class="weekly-signal-copy">
          <div class="weekly-signal-topline">
            <div class="weekly-signal-meta">
              <span>{{ signal.label }}</span>
              <span>周复选 #{{ signal.rank }}</span>
            </div>
            <NuxtLink v-if="hasArticle(signal)" :to="`/articles/${signal.article_slug}`" class="weekly-case-cta">阅读全文</NuxtLink>
            <span v-else class="weekly-case-cta is-disabled">文章编辑中</span>
          </div>
          <h2>{{ signal.game.name }}</h2>
          <p class="weekly-game-description">{{ signalDescription(signal) }}</p>
          <p>{{ signal.selection_reason }}</p>
          <WeeklyChart
            v-if="charts[signal.game.appid || '']"
            :chart="charts[signal.game.appid || '']"
            :label="signal.game.name"
            :window-start="issue.week_start"
            :window-end="issue.week_end"
          />
          <div v-else class="chart-missing">一个月趋势数据尚未补齐，本期保持草稿状态。</div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ChartSeries, WeeklyIssue, WeeklySignal } from "~/types/public"

const route = useRoute()
const { data: issue } = await useWeeklyIssue(String(route.params.slug))
if (!issue.value) throw createError({ statusCode: 404, statusMessage: "Weekly issue not found" })
const { data: publishedArticles } = await useAsyncData("weekly-article-slugs", () => queryContent("/articles").only(["slug"]).find())
const articleSignals = computed(() => (issue.value as WeeklyIssue).signals.filter(signal => signal.article_selected).slice(0, 2))
const articleSlugs = computed(() => new Set((publishedArticles.value || []).map(item => String(item.slug || ""))))

const charts = reactive<Record<string, ChartSeries>>({})
for (const signal of articleSignals.value) {
  if (signal.chart_path && signal.game.appid) charts[signal.game.appid] = await loadPublicJson<ChartSeries>(signal.chart_path)
}

const starTimeline = computed(() => {
  const days: Array<{ date: string; game: string }> = []
  for (const signal of (issue.value as WeeklyIssue).signals) {
    const dailyRanks = Array.isArray(signal.metrics.daily_ranks) ? signal.metrics.daily_ranks : []
    for (const item of dailyRanks as Array<{ date: string; actual_star?: boolean }>) {
      if (item.actual_star) days.push({ date: item.date, game: signal.game.name })
    }
  }
  return days.sort((a, b) => a.date.localeCompare(b.date))
})

const coverageNote = computed(() => {
  const first = (issue.value as WeeklyIssue).signals[0]
  const covered = Number(first?.metrics.coverage_days || 0)
  const total = Number(first?.metrics.coverage_total_days || 0)
  if (!covered || !total || covered === total) return ""
  return `历史数据仅保留 ${covered}/${total} 天；排名按现有记录复原，不补造缺失日期。`
})

useSeoMeta({ title: issue.value.title, description: issue.value.summary })

function metric(signal: WeeklySignal, key: string) {
  return signal.metrics[key] ?? "—"
}

function hasArticle(signal: WeeklySignal) {
  return Boolean(signal.article_slug && articleSlugs.value.has(signal.article_slug))
}

function shortDate(value: string) {
  return value.slice(5).replace("-", "/")
}

function signalDescription(signal: WeeklySignal) {
  const text = signal.game.description?.replace(/\s+/g, " ").trim()
  if (text) return text.length > 112 ? `${text.slice(0, 112)}…` : text
  return `${signal.label}信号，值得从玩家体验与发行节奏两层继续追问。`
}
</script>
