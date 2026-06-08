<template>
  <section class="access-notice" :data-access="resolvedAccess">
    <div>
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2>{{ copy.title }}</h2>
      <p>{{ copy.body }}</p>
    </div>
    <div class="access-token">
      <span>{{ copy.label }}</span>
      <small v-if="availableAt">解锁时间 {{ availableAt }}</small>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  access?: string
  availableAt?: string
}>()

const resolvedAccess = computed(() => props.access || "free")

const copy = computed(() => {
  switch (resolvedAccess.value) {
    case "members":
      return {
        eyebrow: "MEMBER EARLY ACCESS",
        title: "会员提前阅读",
        body: "这篇内容按会员提前阅读处理。当前站点只预留展示层，正式订阅接入前不要把未解锁全文放进公开仓库。",
        label: "会员",
      }
    case "paid":
      return {
        eyebrow: "PAID RESEARCH FILE",
        title: "深度档案预留",
        body: "这类内容适合未来按订阅或单篇买断提供，公开页只保留摘要、目录和购买入口。",
        label: "买断/订阅",
      }
    case "embargo":
      return {
        eyebrow: "EMBARGOED",
        title: "延迟公开",
        body: "内容可以用于会员提前看或编辑部预览。到达解锁时间后，再切换为免费或会员内容。",
        label: "提前看",
      }
    default:
      return {
        eyebrow: "FREE ISSUE",
        title: "免费公开",
        body: "这篇内容属于公开样张，用来建立发行判断的信任入口。详细数据层未来会单独拆分权限。",
        label: "免费",
      }
  }
})
</script>
