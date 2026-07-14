<template>
  <div class="page-shell case-index">
    <header class="page-intro case-intro">
      <p class="eyebrow">WHY NOW?</p>
      <h1>深度案例</h1>
      <p>从趋势信号出发，核验它为什么在此时爆发，并把复盘转化为可迁移的发行判断。</p>
    </header>
    <div v-if="cases?.length" class="content-index">
      <NuxtLink v-for="item in cases" :key="item._path" :to="item._path" class="content-row">
        <div class="content-row-copy">
          <div class="content-row-meta">
            <span>{{ item.published_at || "研究中" }}</span>
            <span class="mini-access-badge" :data-access="item.access || 'free'">{{ accessLabel(item.access) }}</span>
          </div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </div>
        <CaseCover
          :src="item.cover_image_url"
          :title="item.title || '未命名案例'"
          :appid="item.game_appid"
          compact
        />
        <ArrowUpRight class="content-row-arrow" :size="22" />
      </NuxtLink>
    </div>
    <div v-else class="empty-state">
      <p class="eyebrow">FIRST CASE IN PROGRESS</p>
      <h2>塔斯克巴英雄-重铸桌面放置游戏荣光！</h2>
      <p>旗舰案例正在进行来源核验与人工编辑。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next"
useSeoMeta({ title: "深度案例" })
const { data: cases } = await useAsyncData("cases", () => queryContent("/cases").sort({ published_at: -1 }).find())

function accessLabel(access?: string) {
  if (access === "members") return "会员提前看"
  if (access === "paid") return "深度档案"
  if (access === "embargo") return "延迟公开"
  return "免费"
}
</script>
