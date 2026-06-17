<template>
  <div v-if="issue" class="page-shell weekly-page">
    <header class="weekly-hero">
      <p class="eyebrow">GAME SIGNAL WEEKLY</p>
      <h1>{{ issue.title }}</h1>
      <p class="weekly-issue-meta">第 {{ String(issue.issue_number).padStart(3, "0") }} 期 / 覆盖 {{ issue.week_start }} - {{ issue.week_end }}</p>
      <p>{{ issue.summary }}</p>
    </header>
    <section class="weekly-deep-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">DEEP SIGNALS</p>
          <h2>本周两个深度信号</h2>
        </div>
      </div>
      <article v-for="signal in deepSignals" :key="signal.rank" class="weekly-signal-block">
        <div class="weekly-signal-rank">#{{ signal.rank }}</div>
        <div class="weekly-signal-copy">
          <div class="weekly-signal-topline">
            <div class="weekly-signal-meta">
              <span>{{ signal.label }}</span>
              <span>{{ signal.score.toFixed(1) }} pts</span>
            </div>
            <NuxtLink v-if="hasPublishedCase(signal)" :to="`/cases/${signal.case_slug}`" class="weekly-case-cta">阅读深度案例</NuxtLink>
            <span v-else-if="signal.case_slug" class="weekly-case-cta is-disabled">案例筹备中</span>
          </div>
          <div class="weekly-signal-title-row">
            <div>
              <h2>{{ signal.game.name }}</h2>
              <p class="weekly-game-description">{{ signalDescription(signal) }}</p>
            </div>
          </div>
          <p>{{ signal.selection_reason }}</p>
          <WeeklyChart
            v-if="charts[signal.game.appid || '']"
            :chart="charts[signal.game.appid || '']"
            :label="signal.game.name"
            :window-start="issue.week_start"
            :window-end="issue.week_end"
          />
          <div v-else class="chart-missing">精确曲线尚未公开。</div>
        </div>
      </article>
    </section>
    <section class="weekly-watch-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">WATCH TABLE</p>
          <h2>本周候选观察表</h2>
        </div>
      </div>
      <div class="weekly-watch-grid">
        <article v-for="signal in watchSignals" :key="signal.rank" class="weekly-watch-card">
          <div class="weekly-signal-meta">
            <span>#{{ signal.rank }}</span>
            <span>{{ signal.label }}</span>
            <span>{{ signal.score.toFixed(1) }} pts</span>
          </div>
          <h3>{{ signal.game.name }}</h3>
          <p class="weekly-game-description">{{ signalDescription(signal) }}</p>
          <p>{{ signal.selection_reason }}</p>
          <small>本周进入前五，但未被选为本期深度案例；保留曲线和基础事实，等待后续复核。</small>
          <WeeklyChart
            v-if="charts[signal.game.appid || '']"
            :chart="charts[signal.game.appid || '']"
            :label="signal.game.name"
            :window-start="issue.week_start"
            :window-end="issue.week_end"
            compact
          />
          <div v-else class="chart-missing">精确曲线尚未公开。</div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ChartSeries, WeeklyIssue } from "~/types/public"

const route = useRoute()
const { data: issue } = await useWeeklyIssue(String(route.params.slug))
if (!issue.value) throw createError({ statusCode: 404, statusMessage: "Weekly issue not found" })
const { data: publishedCases } = await useAsyncData("weekly-published-case-slugs", () => queryContent("/cases").only(["_path"]).find())
const deepSignals = computed(() => (issue.value as WeeklyIssue).signals.filter(signal => signal.case_selected).slice(0, 2))
const watchSignals = computed(() => (issue.value as WeeklyIssue).signals.filter(signal => !deepSignals.value.includes(signal)))
const publishedCaseSlugs = computed(() => new Set((publishedCases.value || []).map(item => String(item._path || "").replace("/cases/", ""))))

const charts = reactive<Record<string, ChartSeries>>({})
for (const signal of (issue.value as WeeklyIssue).signals) {
  if (signal.chart_path && signal.game.appid) {
    charts[signal.game.appid] = await loadPublicJson<ChartSeries>(signal.chart_path)
  }
}

useSeoMeta({ title: issue.value.title, description: issue.value.summary })
function hasPublishedCase(signal: WeeklyIssue["signals"][number]) {
  return Boolean(signal.case_slug && publishedCaseSlugs.value.has(signal.case_slug))
}

function signalDescription(signal: WeeklyIssue["signals"][number]) {
  const text = signal.game.description?.replace(/\s+/g, " ").trim()
  if (text) {
    return text.length > 96 ? `${text.slice(0, 96)}...` : text
  }
  const studio = [signal.game.developer, signal.game.publisher].filter(Boolean).join(" / ")
  return studio ? `${studio} 的 ${signal.label} 信号，值得继续观察发行节奏。` : `${signal.label} 信号，值得继续观察发行节奏。`
}
</script>
