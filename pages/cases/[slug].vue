<template>
  <div class="page-shell article-shell case-article">
    <AccessNotice v-if="doc" :access="doc.access" :available-at="doc.available_at" />
    <ContentRenderer v-if="doc" :value="doc" class="prose case-prose" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: doc } = await useAsyncData(`case-${route.params.slug}`, () => queryContent(`/cases/${route.params.slug}`).findOne())
if (!doc.value) throw createError({ statusCode: 404, statusMessage: "Case not found" })
useSeoMeta({ title: doc.value.title, description: doc.value.description })
</script>
