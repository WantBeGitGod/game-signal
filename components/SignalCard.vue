<template>
  <article class="signal-card">
    <div class="signal-card-index">{{ String(signal.rank).padStart(2, "0") }}</div>
    <div class="signal-card-media">
      <img v-if="signal.game.cover_image_url" :src="signal.game.cover_image_url" :alt="signal.game.name" />
      <div v-else class="media-placeholder">{{ signal.game.name.slice(0, 2) }}</div>
    </div>
    <div class="signal-card-copy">
      <div class="signal-card-meta">
        <SignalTag :type="signal.type" :label="signal.label" />
        <span>{{ signal.score.toFixed(1) }} pts</span>
      </div>
      <h3>{{ signal.game.name }}</h3>
      <p>{{ signal.fact_summary }}</p>
      <TrendSparkline :trend="signal.game.trend" :label="signal.game.name" />
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

defineProps<{ signal: Signal }>()
</script>
