<template>
  <figure class="sparkline" :aria-label="`${label}在线人数趋势`">
    <template v-if="activePoint">
      <div class="trend-readout">
        <div><span>{{ activePoint.date }}</span><strong>{{ formatNumber(activePoint.peak) }} <small>人</small></strong></div>
        <span class="trend-hint">{{ coordinates.length > 1 ? '移动或点按曲线查看每日数值' : '当前只有一次观测' }}</span>
      </div>
      <div class="trend-chart">
        <div class="trend-scale" aria-hidden="true"><span>{{ formatNumber(ceiling) }}</span><span>{{ formatNumber(ceiling / 2) }}</span><span>0</span></div>
        <div class="trend-plot" @pointermove="selectNearest" @pointerdown="selectNearest">
          <svg viewBox="0 0 1000 180" preserveAspectRatio="none" role="img" :aria-label="`${label}：${coordinates[0]?.date} 至 ${coordinates.at(-1)?.date}的观测峰值`">
            <line v-for="y in [12, 90, 168]" :key="y" x1="0" x2="1000" :y1="y" :y2="y" class="trend-grid" />
            <polyline :points="points" fill="none" stroke="currentColor" stroke-width="2.5" vector-effect="non-scaling-stroke" />
            <line :x1="activePoint.x" :x2="activePoint.x" y1="0" y2="180" class="trend-cursor" />
          </svg>
          <span class="trend-dot" :style="{ left: `${activePoint.x / 10}%`, top: `${activePoint.y / 1.8}%` }" aria-hidden="true" />
        </div>
      </div>
      <div class="trend-dates" aria-hidden="true"><span>{{ coordinates[0]?.date.slice(5) }}</span><span v-if="coordinates.length > 1">{{ coordinates.at(-1)?.date.slice(5) }}</span></div>
      <input v-if="coordinates.length > 1" class="trend-scrubber" type="range" min="0" :max="coordinates.length - 1" :value="activeIndex" :aria-label="`${label}：选择观测日期`" :aria-valuetext="`${activePoint.date}，${formatNumber(activePoint.peak)} 人`" @input="selectedIndex = Number(($event.target as HTMLInputElement).value)" />
    </template>
    <p v-else class="trend-empty">暂无在线人数观测数据</p>
  </figure>
</template>

<script setup lang="ts">
import type { TrendPoint } from "~/types/public"

const props = defineProps<{ trend: TrendPoint[]; label: string }>()
const selectedIndex = ref<number | null>(null)
const ordered = computed(() => [...props.trend].sort((a, b) => a.date.localeCompare(b.date)))
const ceiling = computed(() => {
  const peak = Math.max(...ordered.value.map(point => point.peak), 1)
  const step = 10 ** Math.floor(Math.log10(peak))
  return Math.ceil(peak / step) * step
})
const coordinates = computed(() => {
  const days = ordered.value.map(point => Date.parse(point.date.slice(0, 10)))
  const start = days[0] || 0
  const span = (days.at(-1) || start) - start
  return ordered.value.map((point, index) => ({
    ...point,
    x: span ? (days[index]! - start) / span * 1000 : 500,
    y: 168 - point.peak / ceiling.value * 156
  }))
})
const activeIndex = computed(() => Math.min(selectedIndex.value ?? coordinates.value.length - 1, coordinates.value.length - 1))
const activePoint = computed(() => coordinates.value[activeIndex.value])
const points = computed(() => coordinates.value.map(point => `${point.x},${point.y}`).join(' '))
watch(() => props.trend, () => { selectedIndex.value = null })

function selectNearest(event: PointerEvent) {
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = Math.max(0, Math.min(1000, (event.clientX - bounds.left) / bounds.width * 1000))
  selectedIndex.value = coordinates.value.reduce((nearest, point, index, all) =>
    Math.abs(point.x - x) < Math.abs(all[nearest]!.x - x) ? index : nearest, 0)
}
function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value)
}
</script>

<style scoped>
.sparkline { min-width: 0; margin: 24px 0; }
.trend-readout { display: flex; justify-content: space-between; align-items: end; gap: 12px; margin-bottom: 12px; }
.trend-readout > div { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px 16px; }
.trend-readout span { font: 12px var(--mono); color: var(--muted); }
.trend-readout strong { font: 600 22px var(--mono); font-variant-numeric: tabular-nums; }
.trend-readout small { font: 12px var(--sans); }
.trend-readout .trend-hint { font: 12px var(--sans); text-align: right; }
.trend-chart { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 10px; }
.trend-scale { height: 180px; display: flex; flex-direction: column; justify-content: space-between; padding: 5px 0; text-align: right; font: 11px/14px var(--mono); color: var(--muted); }
.trend-plot { position: relative; min-width: 0; cursor: crosshair; }
.trend-plot svg { width: 100%; height: 180px; overflow: visible; border: 0; }
.trend-grid { stroke: var(--line); stroke-width: 1; vector-effect: non-scaling-stroke; }
.trend-cursor { stroke: currentColor; opacity: 0.3; stroke-dasharray: 3 4; vector-effect: non-scaling-stroke; }
.trend-dot { position: absolute; width: 9px; height: 9px; border: 2px solid var(--paper-bright, white); background: currentColor; border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; }
.trend-dates { display: flex; justify-content: space-between; margin: 5px 0 0 74px; font: 11px var(--mono); color: var(--muted); }
.trend-scrubber { display: block; width: calc(100% - 74px); margin: 10px 0 0 74px; height: 22px; accent-color: var(--blue); cursor: pointer; }
.trend-scrubber:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px; }
.trend-empty { font-size: 14px; color: var(--muted); }
@media (max-width: 600px) {
  .trend-readout { align-items: start; flex-direction: column; gap: 5px; }
  .trend-readout strong { font-size: 20px; }
  .trend-readout .trend-hint { text-align: left; }
}
</style>
