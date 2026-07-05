<template>
  <article class="signal-card">
    <div class="signal-card-index">{{ String(signal.rank).padStart(2, "0") }}</div>
    <div class="signal-card-media">
      <img v-if="signal.game.cover_image_url" :src="signal.game.cover_image_url" :alt="displayGameName(signal.game)" />
      <div v-else class="media-placeholder">{{ displayGameName(signal.game).slice(0, 2) }}</div>
    </div>
    <div class="signal-card-copy">
      <div class="signal-card-meta">
        <SignalTag :type="signal.type" :label="signal.label" />
        <span>{{ appearanceLabel }} / {{ signal.score.toFixed(1) }} pts</span>
      </div>
      <h3>{{ displayGameName(signal.game) }}</h3>
      <p>{{ signal.fact_summary }}</p>
      <TrendSparkline :trend="signal.game.trend" :label="displayGameName(signal.game)" />
      <NuxtLink :to="`/games/${signal.game.slug}`" class="text-link">
        查看游戏信号
        <ArrowRight :size="16" />
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next"
import type { Signal } from "~/types/public"

const props = defineProps<{ signal: Signal }>()
const appearanceCount = computed(() => {
  const explicit = props.signal.star_appearance?.count
  const fallback = Number(props.signal.metrics.star_appearance_count || props.signal.metrics.total_star_count || 1)
  return Math.max(1, Number(explicit || fallback || 1))
})
const appearanceLabel = computed(() => `第 ${appearanceCount.value} 次摘星`)
</script>
