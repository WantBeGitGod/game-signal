<template>
  <section v-if="attention.platforms.length" class="platform-attention" :class="{ compact }" aria-label="平台关注概况">
    <div class="attention-head">
      <div><span class="attention-overline">PLATFORM WATCH / {{ attention.basis }}</span><h2>平台关注概况</h2></div>
      <span class="attention-time">采样 {{ formattedTime }}</span>
    </div>
    <p class="attention-note">近 {{ attention.window_days }} 天的搜索结果抽样；仅展示核对到本游戏的内容，不代表平台总量。</p>
    <div class="attention-platforms">
      <div v-for="platform in attention.platforms" :key="platform.id" class="attention-platform">
        <a :href="platform.search_url" target="_blank" rel="noopener noreferrer" class="attention-name">{{ names[platform.id] }} <ArrowUpRight :size="15" /></a>
        <div class="attention-measure"><strong>{{ platform.sampled_count }}</strong><span>条近期内容</span></div>
        <p v-if="platform.top_views !== null">样本最高播放约 {{ formatNumber(platform.top_views) }}</p>
        <p v-else>已查看 {{ platform.inspected_count }} 条搜索结果</p>
      </div>
    </div>
    <template v-if="!compact">
      <div v-for="platform in attention.platforms.filter(item => item.sources.length)" :key="`${platform.id}-sources`" class="attention-sources">
        <h3>{{ names[platform.id] }} · 内容链接</h3>
        <a v-for="source in platform.sources" :key="source.url" :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.title }} <span>{{ source.published_on }} ↗</span></a>
      </div>
      <div v-for="controversy in attention.controversies" :key="controversy.theme" class="attention-controversy">
        <h3>部分样本讨论：{{ controversy.theme }}</h3><p>{{ controversy.summary }}</p>
        <a v-for="source in controversy.sources" :key="source.url" :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.title }} ↗</a>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"
import type { PlatformAttention } from "~/types/public"

const props = defineProps<{ attention: PlatformAttention; compact?: boolean }>()
const names: Record<PlatformAttention["platforms"][number]["id"], string> = { youtube: "YouTube", bilibili: "B 站" }
const formattedTime = computed(() => new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Singapore", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(props.attention.sampled_at)))
const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN", { notation: "compact", maximumFractionDigits: 1 }).format(value)
</script>

<style scoped>
.platform-attention { border: 1px solid var(--ink); background: #fffdf8; padding: clamp(18px, 2.4vw, 30px); color: var(--ink); }
.attention-head { display: flex; justify-content: space-between; gap: 16px; align-items: end; }
.attention-overline { color: var(--blue); font: 700 10px var(--mono); letter-spacing: .12em; }
.attention-head h2 { margin: 5px 0 0; font: 700 clamp(20px, 2vw, 26px) var(--sans); }
.attention-time { color: var(--muted); font: 11px var(--mono); white-space: nowrap; }
.attention-note { margin: 12px 0 18px; color: var(--muted); font-size: 12px; line-height: 1.6; }
.attention-platforms { display: grid; grid-template-columns: repeat(auto-fit, minmax(155px, 1fr)); gap: 10px; }
.attention-platform { border-top: 2px solid var(--blue); background: #f2eefb; padding: 12px 14px; }
.attention-name { display: inline-flex; gap: 3px; align-items: center; color: var(--blue); font-size: 12px; font-weight: 700; text-decoration: none; }
.attention-name:hover, .attention-sources a:hover, .attention-controversy a:hover { text-decoration: underline; text-underline-offset: 3px; }
.attention-measure { display: flex; align-items: baseline; gap: 6px; margin: 10px 0 2px; }
.attention-measure strong { font: 700 25px var(--sans); line-height: 1; }
.attention-measure span, .attention-platform p { color: var(--muted); font-size: 11px; }
.attention-platform p { margin: 4px 0 0; }
.attention-sources { margin-top: 24px; }
.attention-sources h3, .attention-controversy h3 { margin: 0 0 8px; font-size: 13px; }
.attention-sources a { display: flex; justify-content: space-between; gap: 18px; padding: 9px 0; border-top: 1px solid var(--line); color: var(--ink); font-size: 12px; line-height: 1.5; text-decoration: none; }
.attention-sources a span { color: var(--muted); white-space: nowrap; }
.attention-controversy { margin-top: 22px; padding: 16px; border-left: 3px solid var(--blue); background: #f2eefb; font-size: 12px; }
.attention-controversy a { display: block; margin-top: 8px; color: var(--blue); }
.compact { margin-top: 18px; padding: 15px; background: rgb(255 255 255 / .7); }
.compact .attention-head h2 { font-size: 17px; }
.compact .attention-note { margin: 6px 0 10px; }
.compact .attention-platforms { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.compact .attention-platform { padding: 8px 10px; }
.compact .attention-measure { margin-top: 5px; }
.compact .attention-measure strong { font-size: 20px; }
@media (max-width: 580px) { .attention-head { align-items: start; flex-direction: column; gap: 5px; } .compact .attention-platforms { grid-template-columns: 1fr; } .attention-sources a { display: block; } .attention-sources a span { display: block; margin-top: 3px; } }
</style>
