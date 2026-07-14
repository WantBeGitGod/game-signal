<template>
  <figure class="case-cover" :class="{ 'case-cover--compact': compact }">
    <div class="case-cover-media">
      <img
        v-if="resolvedSrc && !failed"
        :src="resolvedSrc"
        :alt="imageAlt"
        :loading="compact ? 'lazy' : 'eager'"
        decoding="async"
        @error="failed = true"
      />
      <div
        v-else
        class="case-cover-fallback"
        :role="compact ? undefined : 'img'"
        :aria-label="compact ? undefined : imageAlt"
        :aria-hidden="compact ? 'true' : undefined"
      >
        <span>GAME SIGNAL</span>
        <strong>{{ title }}</strong>
      </div>
    </div>
    <figcaption>
      <span>CASE VISUAL</span>
      <span v-if="appid">STEAM {{ appid }}</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src?: string | null
    title: string
    appid?: string | null
    compact?: boolean
  }>(),
  {
    src: null,
    appid: null,
    compact: false
  }
)

const failed = ref(false)
const resolvedSrc = computed(() => {
  if (!props.src) return null
  return props.src.startsWith("/") ? publicAsset(props.src) : props.src
})
const imageAlt = computed(() => (props.compact ? "" : `${props.title}的游戏预览图`))

watch(
  () => props.src,
  () => {
    failed.value = false
  }
)
</script>
