<template>
  <div class="trajectory" :aria-label="`${label} 每日名次`">
    <div v-for="day in days" :key="day.date" class="trajectory-day" :class="[day.status, { winner: day.rank === 1 }]">
      <time :datetime="day.date">{{ day.date.slice(5).replace('-', '/') }}</time>
      <strong>{{ day.rank ? `#${day.rank}` : day.status === 'outside' ? '—' : '?' }}</strong>
      <small>{{ day.star ? '★ 今日之星' : day.status === 'outside' ? '未进前五' : day.status === 'unknown' ? '无日榜记录' : '模型名次' }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeeklyIssue, WeeklySignal } from '~/types/public'
import { weeklyTrajectory } from '~/utils/weeklyTrajectory'
const props = defineProps<{ issue: WeeklyIssue; signal: WeeklySignal; label: string }>()
const days = computed(() => weeklyTrajectory(props.issue.week_start, props.issue.week_end, props.issue.published_days,
  (Array.isArray(props.signal.metrics.daily_ranks) ? props.signal.metrics.daily_ranks : []) as Array<{ date: string; rank: number; actual_star?: boolean }>))
</script>

<style scoped>
.trajectory { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; margin: 24px 0; }
.trajectory-day { display: flex; flex-direction: column; gap: 9px; padding: 12px 3px; border: 1px solid var(--line); text-align: center; background: var(--paper); }
.trajectory-day time { font-family: var(--mono); font-size: 11px; }
.trajectory-day strong { font-family: var(--serif); font-size: 27px; line-height: 1; }
.trajectory-day small { font-size: 10px; line-height: 1.4; }
.trajectory-day.winner { background: var(--acid); }
.trajectory-day.unknown { border-style: dashed; }
.trajectory-day.outside { opacity: .7; }
@media (max-width: 600px) { .trajectory { gap: 3px; } .trajectory-day { padding: 10px 1px; } .trajectory-day strong { font-size: 21px; } .trajectory-day small { font-size: 9px; } }
</style>
