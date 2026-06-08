<template>
  <div class="page-shell">
    <header class="page-intro">
      <p class="eyebrow">MAKING SYSTEM</p>
      <h1>今日之星和周刊是怎样被做出来的</h1>
      <p>采集与排序自动运行；AI 帮助准备研究材料；公开判断始终经过来源核验与人工编辑。</p>
    </header>
    <section class="pipeline">
      <article v-for="(step, index) in steps" :key="step.title">
        <span>{{ String(index + 1).padStart(2, "0") }}</span>
        <component :is="step.icon" :size="24" />
        <h2>{{ step.title }}</h2>
        <p>{{ step.text }}</p>
      </article>
    </section>
    <StatusStrip :status="status" />
    <section class="system-rule">
      <h2>公开边界</h2>
      <p>网站公开评分方法、信号定义、整理后的趋势序列和来源。原始数据库、浏览器登录态、密钥、日志、AI 假设与未审核草稿始终留在私有生产系统。</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Database, Filter, SearchCheck, PenLine, Send } from "lucide-vue-next"
useSeoMeta({ title: "制作系统" })
const { data: status } = await useStatus()
const steps = [
  { icon: Database, title: "采集", text: "每天两次采集 Steam 趋势与商店公开信息，并记录数据完整度。" },
  { icon: Filter, title: "评分", text: "可解释规则每天选出一个今日之星，每周整理五个发行信号，AI 不参与排名。" },
  { icon: SearchCheck, title: "研究", text: "本地 Agent 准备官方优先的证据包与原因假设。" },
  { icon: PenLine, title: "审核", text: "深度案例、团队档案与主图经过人工核验和编辑。" },
  { icon: Send, title: "发布", text: "整理后的静态数据自动进入公开仓库，并由 GitHub Pages 部署。" }
]
</script>
