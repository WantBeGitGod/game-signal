<template>
  <div class="page-shell">
    <header class="page-intro">
      <p class="eyebrow">PAST STARS</p>
      <h1>往日今日之星</h1>
      <p>每天只公开一个最值得追问的游戏。排序来自可解释规则，不来自模型直觉。</p>
    </header>
    <div class="issue-list">
      <NuxtLink v-for="issue in issues" :key="issue.date" :to="`/issues/${issue.date}`" class="issue-row">
        <span class="issue-date">{{ issue.date }}</span>
        <div>
          <SignalTag :type="starSignal(issue).type" :label="starSignal(issue).label" />
          <h2>{{ starSignal(issue).game.name }}</h2>
          <p>{{ starSignal(issue).fact_summary }}</p>
        </div>
        <ArrowUpRight :size="22" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"
import type { DailyIssue } from "~/types/public"

useSeoMeta({ title: "往日今日之星" })
const { data: manifest } = await useManifest()
const { data: issues } = await useAsyncData("issue-archive", async () => {
  return Promise.all((manifest.value?.issues || []).map(date => loadPublicJson<DailyIssue>(`/data/issues/${date}.json`)))
})
function starSignal(issue: DailyIssue) {
  return issue.star_signal || issue.main_signal
}
</script>
