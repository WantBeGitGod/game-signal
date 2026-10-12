<template>
  <span v-if="featured === true" class="article-featured-badge"><Star :size="12" aria-hidden="true" /> 精选</span>
</template>

<script setup lang="ts">
import { Star } from "lucide-vue-next"
defineProps<{ featured?: boolean }>()
</script>

<style scoped>
.article-featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border: 1px solid currentColor;
  border-radius: 3px;
  font: 600 11px/1.4 var(--sans);
  color: inherit;
  white-space: nowrap;
}
</style>
