<template>
  <header class="site-header">
    <NuxtLink to="/" class="brand" aria-label="Game Signal 首页">
      <svg class="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
        <rect width="44" height="44" rx="12" fill="#5144ce" />
        <path d="M10 26h6l4-13 5 20 4-13h5" fill="none" stroke="#faf8f2" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
      </svg>
      <span>
        <strong>游戏信号</strong>
        <small>GAME SIGNAL</small>
      </span>
    </NuxtLink>
    <nav aria-label="主导航">
      <NuxtLink to="/weekly">周刊</NuxtLink>
      <NuxtLink to="/issues">往日之星</NuxtLink>
      <NuxtLink to="/articles">文章</NuxtLink>
      <NuxtLink to="/cases">游戏档案</NuxtLink>
      <NuxtLink to="/companies">团队</NuxtLink>
    </nav>
    <NuxtLink to="/author" class="icon-link" title="作者">
      <UserRound :size="18" />
      <span class="sr-only">作者</span>
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
import { UserRound } from "lucide-vue-next"
</script>
