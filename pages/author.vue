<template>
  <div class="page-shell author-page">
    <div class="author-monogram">GS</div>
    <div>
      <p class="eyebrow">ABOUT THE EDITOR</p>
      <h1>懂发行，也会把判断做成能持续运行的工具。</h1>
      <p>Game Signal 是一个个人发行研究项目。我负责数据采集、信号方法、AI 研究工作流、案例写作与网站制作。</p>
      <p class="muted-copy">联系方式与简历链接将在正式发布前补充。</p>
      <NuxtLink to="/system" class="command-link">
        查看制作系统
        <ArrowUpRight :size="18" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"
useSeoMeta({ title: "作者" })
</script>
