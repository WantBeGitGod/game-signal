<template>
  <div v-if="game" class="page-shell">
    <header class="game-profile">
      <div class="game-profile-art">
        <img v-if="game.cover_image_url" :src="game.cover_image_url" :alt="displayGameName(game)" />
        <span class="source-credit">IMAGE: STEAM CDN</span>
      </div>
      <div class="game-profile-copy">
        <p class="eyebrow">SELECTED GAME SIGNAL</p>
        <h1>{{ displayGameName(game) }}</h1>
        <p class="game-description">{{ game.description || "暂无公开简介。" }}</p>
        <div class="tag-row">
          <span v-for="genre in game.genres" :key="genre" class="plain-tag">{{ genre }}</span>
        </div>
        <dl class="fact-list">
          <div><dt>开发团队</dt><dd>{{ game.developer || "待核验" }}</dd></div>
          <div><dt>发行团队</dt><dd>{{ game.publisher || "待核验" }}</dd></div>
          <div><dt>发行日期</dt><dd>{{ game.release_date || "待核验" }}</dd></div>
          <div><dt>玩家评价</dt><dd>{{ game.review_ratio ? `${game.review_ratio}% · ${game.review_total.toLocaleString()} 条` : "待核验" }}</dd></div>
        </dl>
        <div class="game-profile-actions">
        <a v-if="game.steam_url" :href="game.steam_url" target="_blank" rel="noreferrer" class="command-link">
          查看 Steam 页面
          <ExternalLink :size="17" />
        </a>
        <NuxtLink v-if="publishedCase" :to="publishedCase._path" class="command-link case-link">
          查看文章
          <BookOpenText :size="17" />
        </NuxtLink>
        </div>
      </div>
    </header>
    <section class="trend-panel">
      <div>
        <p class="eyebrow">OBSERVED TREND</p>
        <h2>公开趋势序列</h2>
        <p>图中只展示进入今日之星或周刊时使用的整理后趋势数据。</p>
      </div>
      <TrendSparkline :trend="game.trend" :label="displayGameName(game)" />
    </section>
    <DailyStarQuickTake
      v-if="latestQuickTake?.brief"
      class="game-profile-quick-take"
      :brief="latestQuickTake.brief"
    />
  </div>
</template>

<script setup lang="ts">
import { BookOpenText, ExternalLink } from "lucide-vue-next"

const route = useRoute()
const { data: game } = await useGame(String(route.params.slug))
if (!game.value) throw createError({ statusCode: 404, statusMessage: "Game not found" })
const resolvedGame = game.value
const { data: archive } = await useGameArchive()
const archiveEntry = archive.value?.games.find(entry =>
  entry.game.slug === resolvedGame.slug
  || (resolvedGame.appid && entry.game.appid === resolvedGame.appid)
  || Boolean(resolvedGame.appid && (entry.member_appids || []).includes(resolvedGame.appid))
  || (
    resolvedGame.product_family_identity
    && entry.game.product_family_identity === resolvedGame.product_family_identity
  )
)
const { data: latestQuickTake } = await useLatestGameQuickTake(
  resolvedGame,
  archiveEntry?.star_dates || [],
  archiveEntry?.member_appids || []
)
const { data: publishedCases } = await useAsyncData("published-game-cases", () =>
  queryContent("/articles").where({ status: "published" }).find()
)
const publishedCase = computed(() =>
  publishedCases.value?.find(item =>
    item.game_appid === resolvedGame.appid
    || archiveEntry?.article_slugs.includes(String(item.slug || ""))
  )
)
useSeoMeta({ title: displayGameName(resolvedGame), description: resolvedGame.description })
</script>
