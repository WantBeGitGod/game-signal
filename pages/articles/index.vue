<template>
  <div class="page-shell case-index">
    <header class="page-intro case-intro">
      <p class="eyebrow">GAME SIGNAL ARTICLES</p>
      <h1>文章</h1>
      <p>每篇文章只对应一个游戏：先告诉玩家它是什么，再拆设计、数据、成功原因、竞品差异和发行下一步。</p>
    </header>
    <div class="article-filters">
      <button type="button" :aria-pressed="featuredOnly" data-article-feature-filter @click="featuredOnly = !featuredOnly">只看精选</button>
      <span aria-live="polite">{{ visibleArticles.length }} 篇文章</span>
    </div>
    <div v-if="visibleArticles.length" class="content-index">
      <NuxtLink v-for="item in visibleArticles" :key="item._path" :to="item._path" class="content-row">
        <div class="content-row-copy">
          <div class="content-row-meta">
            <span>{{ item.republished_at || item.published_at || item.created_at || "研究中" }}</span>
            <ArticleFeaturedBadge :featured="item.featured" />
            <span class="mini-access-badge" :data-access="item.access || 'free'">{{ accessLabel(item.access) }}</span>
          </div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </div>
        <CaseCover :src="item.cover_image_url" :title="item.title || '未命名文章'" :appid="item.game_appid" compact />
        <ArrowUpRight class="content-row-arrow" :size="22" />
      </NuxtLink>
    </div>
    <p v-else class="article-empty">{{ featuredOnly ? "暂无精选文章" : "暂无文章" }}</p>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"
import { filterArticles } from "~/utils/homeArticles"
useSeoMeta({ title: "文章" })
const { data: articles } = await useAsyncData("articles", () => queryContent("/articles").sort({ republished_at: -1, published_at: -1, created_at: -1 }).find())
const featuredOnly = ref(false)
const visibleArticles = computed(() => filterArticles(articles.value || [], featuredOnly.value))

function accessLabel(access?: string) {
  if (access === "members") return "会员提前看"
  if (access === "paid") return "深度档案"
  if (access === "embargo") return "延迟公开"
  return "免费"
}
</script>

<style scoped>
.article-filters { display: flex; align-items: center; gap: 14px; margin: 0 0 24px; }
.article-filters button { padding: 8px 14px; border: 1px solid var(--line); border-radius: 4px; background: transparent; color: var(--ink); font: inherit; cursor: pointer; }
.article-filters button[aria-pressed="true"] { border-color: var(--blue); background: var(--blue); color: white; }
.article-filters button:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px; }
.article-filters span, .article-empty { color: var(--muted); font-size: 13px; }
</style>
