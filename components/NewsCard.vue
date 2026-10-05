<template>
  <article :id="`event-${event.id}`" class="news-card" :class="{ 'is-featured': isFeatured(event) }">
    <div class="news-meta"><span class="news-category">{{ newsKinds[event.kind] || '游戏动态' }}</span><span v-if="isFeatured(event)" class="news-pick"><Star :size="12" /> 精选</span><span v-if="newsStatus(event) !== '新收录'" class="news-change">{{ newsStatus(event) }}</span><time :datetime="newsTime(event)">{{ newsStatus(event) === '新收录' ? '收录 ' : '更新 ' }}{{ newsTimestamp(newsTime(event)) }}</time></div>
    <h2><NuxtLink :to="`/news/${event.id}`">{{ event.title }}</NuxtLink></h2>
    <p class="news-summary">{{ event.summary }}</p>
    <p v-if="isFeatured(event)" class="news-recommendation"><span>为什么看</span>{{ event.recommendation }}</p>
    <div class="news-footer"><div class="news-topics"><NuxtLink v-for="topic in event.topics" :key="topic" :to="{ path: '/news', query: { topic } }">{{ topic }}</NuxtLink></div><NuxtLink class="news-read" :to="`/news/${event.id}`">{{ event.sources.length }} 篇来源 · 阅读事件 <ArrowUpRight :size="16" /></NuxtLink></div>
    <details class="news-evidence"><summary>快速查看来源 <ChevronDown :size="14" /></summary><a v-for="source in event.sources" :key="source.url" :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.title }} <ArrowUpRight :size="13" /></a></details>
  </article>
</template>
<script setup lang="ts">
import { ArrowUpRight, ChevronDown, Star } from 'lucide-vue-next'
import type { NewsEvent } from '~/types/news'
import { isFeatured, newsKinds, newsStatus, newsTime, newsTimestamp } from '~/utils/newsFeed'
defineProps<{ event: NewsEvent; featured?: boolean }>()
</script>
<style scoped>
.news-card{padding:30px 0;border-bottom:1px solid var(--line);scroll-margin-top:95px}.news-meta{display:flex;align-items:center;flex-wrap:wrap;gap:12px;font-size:11px;color:var(--muted)}.news-category{font-weight:700;color:var(--blue)}.news-pick{display:inline-flex;align-items:center;gap:4px;background:var(--acid);padding:2px 7px;color:var(--ink)}.news-change{color:var(--blue)}.news-meta time{margin-left:auto;font-family:var(--mono);font-size:10px}.news-card h2{font:700 clamp(20px,2.3vw,27px)/1.6 var(--serif);margin:13px 0 12px}.news-card h2 a:hover{color:var(--blue)}.news-summary{font-size:14px;line-height:1.95;color:var(--muted);margin:0}.news-recommendation{border-left:2px solid var(--blue);padding-left:13px;font-size:13px;line-height:1.9;margin:18px 0}.news-recommendation>span{color:var(--blue);font-weight:700;margin-right:12px}.news-footer{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:20px}.news-topics{display:flex;flex-wrap:wrap;gap:7px}.news-topics a{font-size:11px;background:#eae7fa;color:var(--blue);padding:3px 8px}.news-read{display:flex;align-items:center;gap:5px;white-space:nowrap;font-size:11px;color:var(--blue)}.news-evidence{font-size:11px;color:var(--muted);margin-top:14px}.news-evidence summary{cursor:pointer;display:flex;align-items:center;gap:5px;width:fit-content}.news-evidence a{display:block;padding-top:9px;overflow-wrap:anywhere}.news-evidence a:hover{text-decoration:underline}a:focus-visible,summary:focus-visible{outline:2px solid var(--blue);outline-offset:5px}@media(max-width:600px){.news-card{padding:25px 0}.news-meta time{margin-left:0;flex-basis:100%}.news-footer{align-items:start;flex-direction:column}}
</style>
