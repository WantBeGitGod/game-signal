<template>
  <section class="daily-cover" :class="{ 'has-image': Boolean(issue.hero_image) }">
    <div v-if="issue.hero_image" class="daily-cover-image" :style="{ backgroundImage: `url(${publicAsset(issue.hero_image)})` }" />
    <div v-else class="data-cover-feature" aria-hidden="true">
      <div class="feature-game-art">
        <span class="feature-game-fallback">{{ displayGameName(starSignal.game) }}</span>
        <img
          v-if="starSignal.game.cover_image_url && !mainCoverFailed"
          :src="starSignal.game.cover_image_url"
          alt=""
          loading="eager"
          decoding="async"
          referrerpolicy="no-referrer"
          @error="mainCoverFailed = true"
        />
        <span class="feature-game-credit">TODAY'S STAR / STEAM STORE ART</span>
      </div>
    </div>
    <div class="daily-cover-copy">
      <div class="cover-kicker">
        <span>{{ formatDate(issue.date) }}</span>
        <SignalTag :type="starSignal.type" :label="starSignal.label" />
        <SignalTag
          v-for="label in starSignal.secondary_labels || []"
          :key="label"
          :type="starSignal.type"
          :label="label"
          secondary
        />
      </div>
      <p class="cover-edition">TODAY'S STAR / ISSUE {{ issue.date.replaceAll("-", "") }}</p>
      <h1>{{ displayGameName(starSignal.game) }}</h1>
      <p class="cover-deck">{{ starSignal.fact_summary }}</p>
      <div class="cover-metrics">
        <div>
          <span>{{ peakMetricLabel }}</span>
          <strong>{{ formatNumber(Number(starSignal.metrics.current_peak)) }}</strong>
        </div>
        <div>
          <span>规则评分</span>
          <strong>{{ starSignal.score.toFixed(1) }}</strong>
        </div>
        <div>
          <span>摘星次数</span>
          <strong>{{ starAppearanceLabel }}</strong>
        </div>
      </div>
      <NuxtLink :to="`/issues/${issue.date}#main-signal`" class="command-link">
        阅读今日之星
        <ArrowUpRight :size="18" />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"
import type { DailyIssue } from "~/types/public"

const props = defineProps<{ issue: DailyIssue }>()
const mainCoverFailed = ref(false)
const starSignal = computed(() => props.issue.star_signal || props.issue.main_signal)
const peakMetricLabel = computed(() => {
  const observationKind = starSignal.value.metrics.recovery_observation_kind
  if (observationKind === "players_now") return "归档时点在线"
  if (observationKind === "players_now_and_peak_24h") return "归档 24h 峰值"
  return "观察峰值"
})
const starAppearanceCount = computed(() => {
  const explicit = starSignal.value.star_appearance?.count
  const fallback = Number(starSignal.value.metrics.star_appearance_count || starSignal.value.metrics.total_star_count || 1)
  return Math.max(1, Number(explicit || fallback || 1))
})
const starAppearanceLabel = computed(() => `第 ${starAppearanceCount.value} 次摘星`)

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value || 0)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date(`${value}T12:00:00`))
}
</script>
