<template>
  <article class="daily-quick-take">
    <header class="daily-quick-take-head">
      <div>
        <p class="eyebrow">1–2 MINUTE GAME FIT</p>
        <h2>两分钟看懂它适不适合你</h2>
      </div>
      <span>{{ brief.content_length }} 字</span>
    </header>

    <div class="daily-quick-intro" :class="{ 'intro-continued': positioningShown }">
      <p v-if="!positioningShown">{{ brief.positioning }}</p>
      <p>{{ brief.reference_frame }}</p>
    </div>

    <section class="daily-loop">
      <p class="daily-quick-label">你会反复做什么</p>
      <ol>
        <li v-for="(step, index) in brief.core_loop" :key="step">
          <span>{{ String(index + 1).padStart(2, "0") }}</span>
          <p>{{ step }}</p>
        </li>
      </ol>
    </section>

    <div class="daily-fit-grid">
      <section>
        <p class="daily-quick-label">适合谁</p>
        <p>{{ brief.for_players }}</p>
      </section>
      <section>
        <p class="daily-quick-label">可能不适合谁</p>
        <p>{{ brief.not_for_players }}</p>
      </section>
    </div>

    <footer class="daily-star-reason">
      <p class="daily-quick-label">为什么今天摘星</p>
      <div>
        <p>{{ brief.star_reason }}</p>
        <p v-if="selectionNote" class="selection-note">{{ selectionNote }}</p>
        <details v-if="selectionContext" class="selection-detail">
          <summary>查看原评分第一名</summary>
          <div class="selection-leader">
            <p><strong>{{ selectionContext.leader.name }}</strong><span>{{ selectionContext.leader.score.toFixed(2) }} 分</span></p>
            <p>{{ selectionContext.leader.reason }}</p>
            <a v-if="selectionContext.leader.url" :href="selectionContext.leader.url" target="_blank" rel="noopener noreferrer">查看游戏 ↗</a>
          </div>
        </details>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { DailyStarQuickTake, Signal } from "~/types/public"

defineProps<{ brief: DailyStarQuickTake; positioningShown?: boolean; selectionNote?: string; selectionContext?: Signal['selection_context'] }>()
</script>

<style scoped>
.daily-star-reason .selection-note {
  margin-top: 0.65rem;
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--muted, #686868);
  font-weight: 400;
}

.selection-detail { margin-top: 0.35rem; font-size: 0.8rem; color: var(--muted, #686868); }
.selection-detail summary { cursor: pointer; width: fit-content; text-decoration: underline; text-underline-offset: 3px; }
.selection-detail summary:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
.selection-leader { margin-top: 0.6rem; padding-left: 0.8rem; border-left: 2px solid currentColor; line-height: 1.7; }
.selection-leader p { margin: 0 0 0.25rem; }
.selection-leader strong { color: var(--ink, #242424); overflow-wrap: anywhere; }
.selection-leader span { display: inline-block; margin-left: 0.7rem; white-space: nowrap; }
.selection-leader a { text-underline-offset: 3px; }
</style>
