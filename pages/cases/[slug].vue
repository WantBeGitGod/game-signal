<template>
  <div class="page-shell article-shell case-article">
    <div v-if="doc" class="case-article-layout">
      <AccessNotice class="case-article-access" :access="doc.access" :available-at="doc.available_at" />
      <ContentRenderer :value="doc" class="prose case-prose" />
      <aside class="case-article-visual" aria-label="游戏预览图">
        <CaseCover :src="doc.cover_image_url" :title="doc.title || '未命名案例'" :appid="doc.game_appid" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: doc } = await useAsyncData(`case-${route.params.slug}`, () => queryContent(`/cases/${route.params.slug}`).findOne())
if (!doc.value) throw createError({ statusCode: 404, statusMessage: "Case not found" })
const socialImage = computed(() => {
  const source = doc.value?.cover_image_url
  if (!source) return undefined
  return source.startsWith("/") ? publicAsset(source) : source
})
useSeoMeta({
  title: doc.value.title,
  description: doc.value.description,
  ogImage: socialImage
})
</script>
