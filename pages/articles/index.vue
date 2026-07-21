<template>
  <div class="page-shell case-index">
    <header class="page-intro case-intro">
      <p class="eyebrow">GAME SIGNAL ARTICLES</p>
      <h1>文章</h1>
      <p>每篇文章只对应一个游戏：先告诉玩家它是什么，再拆设计、数据、成功原因、竞品差异和发行下一步。</p>
    </header>
    <div v-if="articles?.length" class="content-index">
      <NuxtLink v-for="item in articles" :key="item._path" :to="item._path" class="content-row">
        <div class="content-row-copy">
          <div class="content-row-meta">
            <span>{{ item.republished_at || item.published_at || item.created_at || "研究中" }}</span>
            <span class="mini-access-badge" :data-access="item.access || 'free'">{{ accessLabel(item.access) }}</span>
          </div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </div>
        <CaseCover :src="item.cover_image_url" :title="item.title || '未命名文章'" :appid="item.game_appid" compact />
        <ArrowUpRight class="content-row-arrow" :size="22" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"
useSeoMeta({ title: "文章" })
const { data: articles } = await useAsyncData("articles", () => queryContent("/articles").sort({ republished_at: -1, published_at: -1, created_at: -1 }).find())

function accessLabel(access?: string) {
  if (access === "members") return "会员提前看"
  if (access === "paid") return "深度档案"
  if (access === "embargo") return "延迟公开"
  return "免费"
}
</script>
