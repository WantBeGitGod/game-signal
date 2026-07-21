<template>
  <div class="page-shell case-index">
    <header class="page-intro case-intro">
      <p class="eyebrow">COLLECTION BY GAME</p>
      <h1>游戏档案</h1>
      <p>这里不保存第二份正文。每个游戏只引用它唯一的 Article，以及曾经出现过的今日之星与周刊记录。</p>
    </header>
    <div v-if="cases?.length" class="game-archive-index">
      <NuxtLink v-for="entry in cases" :key="entry.game.slug" :to="`/games/${entry.game.slug}`" class="game-archive-card">
        <CaseCover
          :src="entry.game.cover_image_url"
          :title="displayGameName(entry.game)"
          :appid="entry.game.appid"
          label="GAME ARCHIVE"
        />
        <div class="game-archive-copy">
          <div class="game-archive-meta">
            <span>{{ entry.game.genres.slice(0, 2).join(" / ") || "待分类" }}</span>
            <span>收录 1 篇文章</span>
          </div>
          <h2>{{ displayGameName(entry.game) }}</h2>
          <p>{{ entry.game.description || entry.article.description }}</p>
          <div class="game-archive-footer">
            <span>{{ entry.game.developer || "开发团队待核验" }}</span>
            <span class="game-archive-action">打开游戏档案 <ArrowUpRight :size="18" /></span>
          </div>
        </div>
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
import type { PublicGame } from "~/types/public"

useSeoMeta({ title: "游戏档案" })
const { data: cases } = await useAsyncData("game-article-collection", async () => {
  const articles = await queryContent("/articles").sort({ published_at: -1, created_at: -1 }).find()
  const records: Array<{ article: (typeof articles)[number]; game: PublicGame }> = []

  for (const article of articles) {
    if (!article.slug) continue
    const game = await loadPublicJsonOrDefault<PublicGame | null>(`/data/games/${article.slug}.json`, null)
    if (game) records.push({ article, game })
  }

  return records
})
</script>
