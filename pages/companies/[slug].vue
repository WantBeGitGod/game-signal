<template>
  <div class="page-shell article-shell">
    <AccessNotice v-if="doc" :access="doc.access" :available-at="doc.available_at" />
    <ContentRenderer v-if="doc" :value="doc" class="prose" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: doc } = await useAsyncData(`company-${route.params.slug}`, () => queryContent(`/companies/${route.params.slug}`).findOne())
if (!doc.value) throw createError({ statusCode: 404, statusMessage: "Company not found" })
useSeoMeta({ title: doc.value.title, description: doc.value.description })
</script>
