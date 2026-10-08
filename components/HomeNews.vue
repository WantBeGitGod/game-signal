<template>
  <section v-if="picks.length" class="home-news">
    <div class="home-news-heading"><div><p class="eyebrow">THE NEWS DESK / 资讯</p><h2>{{ hasFeatured ? '这些消息，值得先看。' : '游戏世界，正在发生。' }}</h2></div><NuxtLink to="/news">近期动态 <ArrowUpRight :size="18" /></NuxtLink></div>
    <div class="home-news-grid"><NewsCard v-for="event in picks" :key="event.id" :event="event" /></div>
  </section>
</template>
<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { homeNews, isFeatured } from '~/utils/newsFeed'
const { data } = await useNews()
const newsNow = useNewsNow()
const picks = computed(() => homeNews(data.value?.events || [], 3, newsNow.value))
const hasFeatured = computed(() => picks.value.some(isFeatured))
</script>
<style scoped>
.home-news{padding-inline:clamp(22px,4.5vw,64px);margin:40px 0 55px}.home-news-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;border-bottom:2px solid var(--ink);padding-bottom:20px}.home-news-heading h2{font:700 clamp(24px,3vw,33px)/1.5 var(--serif);margin:10px 0 0}.home-news-heading>a{display:inline-flex;gap:7px;align-items:center;white-space:nowrap;color:var(--blue);font-size:13px}.home-news-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:30px}.home-news-grid :deep(.news-footer){align-items:start;flex-direction:column}.home-news-grid :deep(.news-meta time){flex-basis:100%;margin:0}.home-news-grid :deep(h2){font-size:21px}@media(max-width:950px){.home-news-grid{grid-template-columns:1fr}.home-news-grid :deep(.news-footer){flex-direction:row}.home-news-heading{align-items:start;flex-direction:column;gap:10px}}
</style>
