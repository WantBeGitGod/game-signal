<template>
  <div v-if="issue" class="page-shell home-page">
    <div class="home-dateline"><span><i /> 今日之星</span><span>{{ issue.date }} / DAILY SELECTION</span></div>
    <DailyCover :issue="issue" home />
    <section id="quick-take" class="home-reading">
      <DailyStarQuickTake v-if="starSignal?.quick_take" :brief="starSignal.quick_take" positioning-shown />
      <div v-else class="quick-take-unavailable"><h2>游戏速读整理中</h2><p>{{ starSignal?.game.description || starSignal?.fact_summary }}</p></div>
      <div class="reading-links">
        <NuxtLink :to="`/issues/${issue.date}#main-signal`" class="text-link">查看数据与来源 <ArrowUpRight :size="16" /></NuxtLink>
        <a v-if="starSignal?.game.steam_url" :href="starSignal.game.steam_url" target="_blank" rel="noopener noreferrer" class="text-link">前往 Steam <ArrowUpRight :size="16" /></a>
      </div>
    </section>
    <section class="home-archive">
      <div class="section-heading"><div><p class="eyebrow">THE STAR ARCHIVE</p><h2>还有这些，值得一看。</h2></div><NuxtLink to="/issues" class="archive-button">浏览全部往日之星 <ArrowRight :size="20" /></NuxtLink></div>
      <div class="home-star-grid">
        <NuxtLink v-for="past in recentIssues" :key="past.date" :to="`/issues/${past.date}`" class="home-star-card">
          <CaseCover :src="(past.star_signal || past.main_signal).game.cover_image_url" :title="displayGameName((past.star_signal || past.main_signal).game)" :appid="(past.star_signal || past.main_signal).game.appid" compact />
          <div class="home-star-copy"><span>{{ past.date }}</span><h3>{{ displayGameName((past.star_signal || past.main_signal).game) }}</h3><p>{{ (past.star_signal || past.main_signal).quick_take?.positioning || (past.star_signal || past.main_signal).fact_summary }}</p><ArrowUpRight :size="20" /></div>
        </NuxtLink>
      </div>
    </section>
    <section class="home-editorial">
      <div class="editorial-heading"><p class="eyebrow">FURTHER READING / 深入阅读</p><h2>从玩什么<br />到为什么</h2><NuxtLink to="/articles" class="archive-button">阅读全部文章 <ArrowUpRight :size="20" /></NuxtLink><NuxtLink to="/weekly" class="text-link">本周游戏信号 <ArrowRight :size="16" /></NuxtLink></div>
      <div class="home-article-list"><NuxtLink v-for="article in articles" :key="article._path" :to="article._path" class="home-article"><span>{{ article.republished_at || article.published_at || article.created_at }}</span><h3>{{ article.title }}</h3><p>{{ article.description }}</p><span class="article-read">阅读全文 <ArrowUpRight :size="18" /></span></NuxtLink><p v-if="!articles?.length">新的游戏文章正在整理中。</p></div>
    </section>
    <StatusStrip :status="status" />
  </div>
  <div v-else class="empty-page"><p class="eyebrow">WAITING FOR SIGNAL</p><h1>第一期正在生成。</h1></div>
</template>

<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from "lucide-vue-next"
import { distinctPastStars } from "~/utils/distinctPastStars"
import type { DailyIssue } from "~/types/public"
useSeoMeta({ title: "游戏信号", description: "两分钟读懂今日之星，发现值得玩的游戏，深入阅读背后的设计与发行。" })
const { data: manifest } = await useManifest()
const { data: status } = await useStatus()
const latest = manifest.value?.latest_issue
const issue = ref<DailyIssue | null>(null)
if (latest) issue.value = await loadPublicJson<DailyIssue>(`/data/issues/${latest}.json`)
const starSignal = computed(() => issue.value?.star_signal || issue.value?.main_signal)
const { data: recentIssues } = await useAsyncData("home-recent-stars", async () => {
  const past = await Promise.all((manifest.value?.issues || []).filter(date => date !== latest).map(date => loadPublicJson<DailyIssue>(`/data/issues/${date}.json`)))
  return distinctPastStars(past, issue.value, 3)
})
const { data: articles } = await useAsyncData("home-articles", () => queryContent("/articles").sort({ republished_at: -1, published_at: -1, created_at: -1 }).limit(2).find())
</script>
