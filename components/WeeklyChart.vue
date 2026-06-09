<template>
  <div class="weekly-chart" :class="{ compact }" :aria-label="`${label} 观察窗口在线曲线`">
    <div class="weekly-chart-head">
      <div>
        <span>SteamDB players</span>
        <strong>{{ formatNumber(activePeak.players) }}</strong>
      </div>
      <p>{{ peakTime }}</p>
    </div>
    <svg viewBox="0 0 960 340" role="img" preserveAspectRatio="none">
      <g class="chart-grid">
        <line v-for="tick in yTicks" :key="tick.value" :x1="plot.left" :x2="plot.right" :y1="tick.y" :y2="tick.y" />
      </g>
      <path :d="areaPath" class="chart-area" />
      <polyline :points="linePoints" class="chart-line" fill="none" />
      <polyline v-if="averagePoints" :points="averagePoints" class="chart-average" fill="none" />
      <g v-if="peakPoint" class="chart-peak">
        <line :x1="peakPoint.x" :x2="peakPoint.x" :y1="peakPoint.y" :y2="plot.bottom" />
        <circle :cx="peakPoint.x" :cy="peakPoint.y" r="5" />
        <text :x="peakLabelX" :y="peakLabelY" text-anchor="middle">{{ formatNumber(peakPoint.players) }}</text>
        <text :x="peakLabelX" :y="peakLabelY + 16" text-anchor="middle">{{ peakPoint.datetime.slice(5, 16) }}</text>
      </g>
      <g class="chart-y-axis">
        <text v-for="tick in yTicks" :key="`label-${tick.value}`" :x="928" :y="tick.y + 4">{{ formatAxisNumber(tick.value) }}</text>
      </g>
    </svg>
    <div class="weekly-chart-legend">
      <span><i class="players-line"></i>Players</span>
      <span><i class="average-line"></i>Average Players</span>
      <span><i class="peak-dot"></i>Peak</span>
    </div>
    <div class="weekly-chart-axis">
      <span>{{ displayedPoints[0]?.datetime.slice(0, 10) }}</span>
      <span>{{ displayedPoints.at(-1)?.datetime.slice(0, 10) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartSeries } from "~/types/public"

const props = defineProps<{ chart: ChartSeries; label: string; compact?: boolean; windowStart?: string; windowEnd?: string }>()
const compact = computed(() => Boolean(props.compact))
const plot = { left: 26, right: 900, top: 46, bottom: 278 }

const displayedPoints = computed(() => {
  if (!props.windowStart || !props.windowEnd) return props.chart.points
  const points = props.chart.points.filter(point => {
    const day = point.datetime.slice(0, 10)
    return day >= props.windowStart! && day <= props.windowEnd!
  })
  return points.length ? points : props.chart.points
})
const activePeak = computed(() => {
  return displayedPoints.value.reduce(
    (best, point) => (point.players > best.players ? { players: point.players, datetime: point.datetime } : best),
    { players: 0, datetime: null as string | null }
  )
})
const maxPlayers = computed(() => Math.max(...displayedPoints.value.map(point => Math.max(point.players, point.average_players || 0)), 1))
const yMax = computed(() => niceCeil(maxPlayers.value))

const coordinates = computed(() => {
  return displayedPoints.value.map((point, index) => ({
    ...point,
    x: displayedPoints.value.length === 1 ? (plot.left + plot.right) / 2 : (index / (displayedPoints.value.length - 1)) * (plot.right - plot.left) + plot.left,
    y: plot.bottom - (point.players / yMax.value) * (plot.bottom - plot.top)
  }))
})

const linePoints = computed(() => coordinates.value.map(point => `${point.x},${point.y}`).join(" "))
const areaPath = computed(() => {
  if (!coordinates.value.length) return ""
  return `M${plot.left},${plot.bottom} L${linePoints.value} L${plot.right},${plot.bottom} Z`
})
const averagePoints = computed(() => {
  const values = displayedPoints.value.map(point => point.average_players).filter(value => typeof value === "number") as number[]
  if (!values.length) return ""
  return displayedPoints.value
    .map((point, index) => {
      if (typeof point.average_players !== "number") return ""
      const x = displayedPoints.value.length === 1 ? (plot.left + plot.right) / 2 : (index / (displayedPoints.value.length - 1)) * (plot.right - plot.left) + plot.left
      const y = plot.bottom - (point.average_players / yMax.value) * (plot.bottom - plot.top)
      return `${x},${y}`
    })
    .filter(Boolean)
    .join(" ")
})
const peakPoint = computed(() => {
  if (!coordinates.value.length) return null
  const peakTimeValue = activePeak.value.datetime
  return coordinates.value.find(point => point.datetime === peakTimeValue) || coordinates.value.reduce((best, point) => (point.players > best.players ? point : best), coordinates.value[0])
})
const peakLabelX = computed(() => {
  if (!peakPoint.value) return 0
  return Math.min(Math.max(peakPoint.value.x, 96), 820)
})
const peakLabelY = computed(() => Math.max((peakPoint.value?.y || 0) - 24, 24))
const yTicks = computed(() => [0, 0.25, 0.5, 0.75, 1].map(ratio => {
  const value = Math.round(yMax.value * ratio)
  return {
    value,
    y: plot.bottom - ratio * (plot.bottom - plot.top)
  }
}).reverse())
const peakTime = computed(() => activePeak.value.datetime || "峰值时间待核验")

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value || 0)
}

function formatAxisNumber(value: number) {
  if (value >= 1000000) return `${Math.round(value / 100000) / 10}m`
  if (value >= 1000) return `${Math.round(value / 1000)}k`
  return String(value)
}

function niceCeil(value: number) {
  const magnitude = 10 ** Math.floor(Math.log10(value || 1))
  const normalized = value / magnitude
  const nice = normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * magnitude
}
</script>
