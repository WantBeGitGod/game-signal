<template>
  <div class="page-shell article-shell case-article">
    <div v-if="doc" class="case-article-layout">
      <div class="case-article-access">
        <AccessNotice :access="doc.access" :available-at="doc.available_at" />
        <div v-if="doc.featured === true" class="article-selection">
          <ArticleFeaturedBadge :featured="doc.featured" />
          <p>{{ doc.featured_reason }}</p>
        </div>
      </div>
      <ContentRenderer :value="doc" class="prose case-prose" />
      <aside class="case-article-visual" aria-label="游戏预览图">
        <CaseCover :src="doc.cover_image_url" :title="doc.title || '未命名文章'" :appid="doc.game_appid" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: doc } = await useAsyncData(`article-${route.params.slug}`, () => queryContent(`/articles/${route.params.slug}`).findOne())
if (!doc.value) throw createError({ statusCode: 404, statusMessage: "Article not found" })
const socialImage = computed(() => {
  const source = doc.value?.cover_image_url
  if (!source) return undefined
  return source.startsWith("/") ? publicAsset(source) : source
})
useSeoMeta({ title: doc.value.title, description: doc.value.description, ogImage: socialImage })
</script>

<style scoped>
.article-selection { display: flex; align-items: flex-start; gap: 12px; margin: 20px 0 12px; color: var(--ink); }
.article-selection p { margin: 0; font-size: 14px; line-height: 1.7; }
.article-selection :deep(.article-featured-badge) { flex-shrink: 0; }
</style>
