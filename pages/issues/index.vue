<template>
  <div class="page-shell issue-archive">
    <header class="page-intro">
      <p class="eyebrow">PAST STARS</p>
      <h1>往日之星</h1>
      <p>每天只公开一个最值得追问的游戏。排序来自可解释规则，不来自模型直觉。</p>
    </header>
    <div class="issue-list">
      <NuxtLink v-for="issue in issues" :key="issue.date" :to="`/issues/${issue.date}`" class="issue-row">
        <span class="issue-date">{{ issue.date }}</span>
        <div class="issue-row-copy">
          <div class="issue-row-topline">
            <div class="issue-row-heading">
              <SignalTag :type="starSignal(issue).type" :label="starSignal(issue).label" />
              <h2>{{ displayGameName(starSignal(issue).game) }}</h2>
            </div>
            <div v-if="observedPeak(issue)" class="issue-row-peak">
              <span class="issue-row-peak-label">今日观测峰值</span>
              <strong>{{ observedPeak(issue) }}</strong>
              <span class="issue-row-peak-unit">人在线</span>
            </div>
          </div>
          <p class="issue-row-summary">{{ starSignal(issue).fact_summary }}</p>
        </div>
        <CaseCover
          :src="starSignal(issue).game.cover_image_url"
          :title="displayGameName(starSignal(issue).game)"
          :appid="starSignal(issue).game.appid"
          label="DAILY STAR"
          compact
        />
        <ArrowUpRight class="issue-row-arrow" :size="22" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"
import type { DailyIssue } from "~/types/public"

useSeoMeta({ title: "往日之星" })
const { data: manifest } = await useManifest()
const { data: issues } = await useAsyncData("issue-archive", async () => {
  return Promise.all((manifest.value?.issues || []).map(date => loadPublicJson<DailyIssue>(`/data/issues/${date}.json`)))
})
function starSignal(issue: DailyIssue) {
  return issue.star_signal || issue.main_signal
}

const peakFormatter = new Intl.NumberFormat("zh-CN")

function observedPeak(issue: DailyIssue) {
  const value = starSignal(issue).metrics.current_peak
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null
  return peakFormatter.format(value)
}
</script>
