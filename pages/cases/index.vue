<template>
  <div class="page-shell case-index">
    <header class="page-intro case-intro">
      <p class="eyebrow">COLLECTION BY GAME</p>
      <h1>游戏档案</h1>
      <p>这里不保存第二份正文。每个游戏只引用它唯一的 Article，以及曾经出现过的今日之星与周刊记录。</p>
    </header>
    <div v-if="cases?.length" class="content-index">
      <NuxtLink v-for="item in cases" :key="item._path" :to="`/articles/${item.slug}`" class="content-row">
        <div class="content-row-copy">
          <div class="content-row-meta">
            <span>{{ item.published_at || "研究中" }}</span>
            <span class="mini-access-badge" :data-access="item.access || 'free'">{{ accessLabel(item.access) }}</span>
          </div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </div>
        <CaseCover
          :src="item.cover_image_url"
          :title="item.title || '未命名文章'"
          :appid="item.game_appid"
          compact
        />
        <ArrowUpRight class="content-row-arrow" :size="22" />
      </NuxtLink>
    </div>
    <div v-else class="empty-state">
      <p class="eyebrow">FIRST ARTICLE IN PROGRESS</p>
      <h2>第一篇文章正在进行来源核验与人工编辑。</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"
useSeoMeta({ title: "游戏档案" })
const { data: cases } = await useAsyncData("game-article-collection", () => queryContent("/articles").sort({ published_at: -1, created_at: -1 }).find())

function accessLabel(access?: string) {
  if (access === "members") return "会员提前看"
  if (access === "paid") return "深度档案"
  if (access === "embargo") return "延迟公开"
  return "免费"
}
</script>
