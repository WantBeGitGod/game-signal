<template>
  <span class="signal-tag" :data-type="type" :data-secondary="secondary || undefined">{{ label }}</span>
</template>

<script setup lang="ts">
defineProps<{ label: string; type: string; secondary?: boolean }>()
</script>

<style scoped>
.signal-tag[data-secondary="true"] {
  background: var(--blue);
  color: white;
}
</style>
