<template>
  <span class="signal-tag" :data-type="type">{{ label }}</span>
</template>

<script setup lang="ts">
defineProps<{ label: string; type: string }>()
</script>
