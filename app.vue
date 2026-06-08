<template>
  <div>
    <SiteHeader />
    <main>
      <NuxtPage />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const preview = computed(() => Boolean(config.public.preview))

useHead(() => ({
  meta: preview.value ? [{ name: "robots", content: "noindex,nofollow" }] : []
}))
</script>
