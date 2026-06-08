<template>
  <div class="empty-page">
    <p class="eyebrow">SIGNAL LOST</p>
    <h1>{{ error?.statusCode || 404 }} / 页面暂时不可用</h1>
    <NuxtLink to="/" class="command-link">返回首页</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error?: { statusCode?: number } }>()
</script>
