<template>
  <div v-if="issue" class="page-shell">
    <DailyCover :issue="issue" />
    <StatusStrip :status="status" />

    <section class="section-band">
      <div class="section-heading">
        <div>
          <p class="eyebrow">TODAY'S STAR</p>
          <h2>今天只把注意力交给一个游戏</h2>
        </div>
        <NuxtLink to="/issues" class="text-link">
          浏览往日之星
          <ArrowRight :size="16" />
        </NuxtLink>
      </div>
      <p class="star-note">
        今日之星来自发行事件评分：新作、试玩、正式版和重大更新先按各自节点进入比较，再依据峰值、历史新高与同 App ID 的重复曝光折算排序。
        如果同一游戏连续三天胜出，系统会自动锁定一个周刊 Article 名额。
      </p>
    </section>

    <section class="editorial-bridge">
      <div>
        <p class="eyebrow">FROM SIGNAL TO CASE</p>
        <h2 class="editorial-bridge-title">
          <span>榜单告诉你</span>
          <span>发生了什么。</span>
          <span>文章继续追问，</span>
          <span>为什么偏偏是现在。</span>
        </h2>
      </div>
      <p>
        Game Signal 每天只公开一个最值得追问的游戏；每周再把连续排名收束成两篇完整文章。
        周刊负责解释共同点、差异点和可迁移的发行判断。
      </p>
      <NuxtLink to="/articles" class="command-link dark">
        阅读文章
        <ArrowUpRight :size="18" />
      </NuxtLink>
    </section>
  </div>
  <div v-else class="empty-page">
    <p class="eyebrow">WAITING FOR SIGNAL</p>
    <h1>第一期正在生成。</h1>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from "lucide-vue-next"
import type { DailyIssue } from "~/types/public"

useSeoMeta({
  title: "游戏信号",
  description: "从 Steam 异动中寻找值得发行人继续追问的游戏信号。"
})

const { data: manifest } = await useManifest()
const { data: status } = await useStatus()
const latest = manifest.value?.latest_issue
const issue = ref<DailyIssue | null>(null)
if (latest) {
  issue.value = await loadPublicJson<DailyIssue>(`/data/issues/${latest}.json`)
}
</script>
