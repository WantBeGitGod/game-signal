<template>
  <div class="sparkline" :aria-label="`${label}趋势`">
    <svg viewBox="0 0 240 96" role="img">
      <polyline :points="points" fill="none" stroke="currentColor" stroke-width="4" vector-effect="non-scaling-stroke" />
      <g v-for="point in plottedPoints" :key="point.date">
        <circle :cx="point.x" :cy="point.y" r="4" fill="currentColor" />
        <text :x="point.x" :y="point.labelY" :text-anchor="point.anchor">{{ point.label }}</text>
      </g>
    </svg>
    <div class="sparkline-axis">
      <span>{{ trend[0]?.date.slice(5) }}</span>
      <span>{{ trend.at(-1)?.date.slice(5) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrendPoint } from "~/types/public"

const props = defineProps<{ trend: TrendPoint[]; label: string }>()
const coordinates = computed(() => {
  const values = props.trend.map(point => point.peak)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  return props.trend.map((point, index) => ({
    date: point.date,
    peak: point.peak,
    x: props.trend.length === 1 ? 120 : (index / (props.trend.length - 1)) * 232 + 4,
    y: 76 - ((point.peak - min) / Math.max(max - min, 1)) * 52
  }))
})
const points = computed(() => coordinates.value.map(point => `${point.x},${point.y}`).join(" "))
const plottedPoints = computed(() => coordinates.value.map((point, index) => ({
  ...point,
  anchor: index === 0 ? "start" : index === coordinates.value.length - 1 ? "end" : "middle",
  label: formatNumber(point.peak),
  labelY: Math.max(point.y - 9, 12)
})))

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value || 0)
}
</script>
