<template>
  <div class="page-shell">
    <header class="page-intro">
      <p class="eyebrow">TEAM FILES</p>
      <h1>团队档案</h1>
      <p>只有进入 Article 并经过来源核验的开发与发行团队，才会拥有公开档案。</p>
    </header>
    <div v-if="companies?.length" class="content-index">
      <NuxtLink v-for="item in companies" :key="item._path" :to="item._path" class="content-row">
        <div>
          <span>{{ item.role || "TEAM" }}</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </div>
        <ArrowUpRight :size="22" />
      </NuxtLink>
    </div>
    <div v-else class="empty-state">
      <p class="eyebrow">REVIEWED PROFILES ONLY</p>
      <h2>首个团队档案将随 TBH 文章发布。</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"
useSeoMeta({ title: "团队档案" })
const { data: companies } = await useAsyncData("companies", () => queryContent("/companies").find())
</script>
