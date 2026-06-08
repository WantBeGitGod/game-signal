<template>
  <div v-if="issue" class="page-shell">
    <DailyCover :issue="issue" />
    <section id="main-signal" class="issue-body">
      <div class="section-heading">
        <div>
          <p class="eyebrow">TODAY'S STAR</p>
          <h2>今日之星</h2>
        </div>
        <span class="data-note">规则评分 {{ starSignal.score.toFixed(1) }}</span>
      </div>
      <SignalCard :signal="starSignal" />
    </section>
    <aside class="source-note">
      <Database :size="20" />
      <p>公开日更只保留一个今日之星。候选池进入私有编辑包和周刊筛选，经过人工核验后才会成为深度案例。</p>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { Database } from "lucide-vue-next"

const route = useRoute()
const { data: issue } = await useIssue(String(route.params.date))
if (!issue.value) throw createError({ statusCode: 404, statusMessage: "Issue not found" })
useSeoMeta({ title: issue.value.title, description: issue.value.summary })
const starSignal = computed(() => issue.value!.star_signal || issue.value!.main_signal)
</script>
