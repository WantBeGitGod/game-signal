<template>
  <article class="daily-quick-take">
    <header class="daily-quick-take-head">
      <div>
        <p class="eyebrow">1–2 MINUTE GAME FIT</p>
        <h2>两分钟看懂它适不适合你</h2>
      </div>
      <span>{{ brief.content_length }} 字</span>
    </header>

    <div class="daily-quick-intro">
      <p>{{ brief.positioning }}</p>
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
      <p>{{ brief.star_reason }}</p>
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { DailyStarQuickTake } from "~/types/public"

defineProps<{ brief: DailyStarQuickTake }>()
</script>
