<template>
  <div class="page-shell case-index">
    <header class="page-intro case-intro">
      <p class="eyebrow">COLLECTION BY GAME</p>
      <h1>游戏档案</h1>
      <p>每次今日之星和文章发布都会在这里留下一个游戏身份。档案汇总封面、摘星记录与文章入口，但不复制正文。</p>
    </header>
    <div v-if="archive?.games.length" class="game-archive-index">
      <NuxtLink v-for="entry in archive?.games" :key="entry.game.slug" :to="`/games/${entry.game.slug}`" class="game-archive-card">
        <CaseCover
          :src="entry.game.cover_image_url"
          :title="displayGameName(entry.game)"
          :appid="entry.game.appid"
          label="GAME ARCHIVE"
        />
        <div class="game-archive-copy">
          <div class="game-archive-meta">
            <span>{{ entry.game.genres.slice(0, 2).join(" / ") || "待分类" }}</span>
            <span>{{ entry.star_dates.length ? `摘星 ${entry.star_dates.length} 次` : `收录 ${entry.article_count} 篇文章` }}</span>
          </div>
          <h2>{{ displayGameName(entry.game) }}</h2>
          <p>{{ entry.game.description || "暂无公开简介。" }}</p>
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

useSeoMeta({ title: "游戏档案" })
const { data: archive } = await useGameArchive()
</script>
