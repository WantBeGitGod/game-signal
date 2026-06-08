<template>
  <div class="page-shell">
    <header class="page-intro case-intro">
      <p class="eyebrow">WEEKLY ISSUES</p>
      <h1>发行人的电子周刊</h1>
      <p>每周从 Steam 趋势里筛出 5 个发行信号，用完整曲线、案例和团队档案追问：为什么是现在。</p>
    </header>
    <div v-if="manifest?.issues.length" class="weekly-shelf">
      <NuxtLink v-for="issue in manifest.issues" :key="issue.slug" :to="`/weekly/${issue.slug}`" class="weekly-cover-card">
        <span>第 {{ String(issue.issue_number).padStart(3, "0") }} 期</span>
        <h2>{{ issue.week_start }} / {{ issue.week_end }}</h2>
        <p>{{ issue.summary }}</p>
        <strong>{{ issue.published_at || "编辑中" }}</strong>
      </NuxtLink>
    </div>
    <div v-else class="empty-state">
      <p class="eyebrow">FIRST WEEKLY IN PROGRESS</p>
      <h2>第一期周刊编辑包正在准备。</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "周刊" })
const { data: manifest } = await useWeeklyManifest()
</script>
