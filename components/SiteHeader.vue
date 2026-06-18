<template>
  <header class="site-header">
    <NuxtLink to="/" class="brand" aria-label="Game Signal 首页">
      <svg class="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
        <rect width="44" height="44" fill="#e55272" />
        <rect x="9" y="9" width="18" height="18" fill="#fffdf6" stroke="#171713" stroke-width="2" />
        <path d="M12 23 16 18l5 3 5-8" fill="none" stroke="#171713" stroke-width="2.5" />
        <circle cx="22" cy="22" r="12" fill="none" stroke="#fffdf6" stroke-width="3" />
        <circle cx="26" cy="13" r="2.5" fill="#3f68ff" />
        <path d="M31 31 39 39" stroke="#171713" stroke-width="4" />
      </svg>
      <span>
        <strong>游戏信号</strong>
        <small>GAME SIGNAL</small>
      </span>
    </NuxtLink>
    <nav aria-label="主导航">
      <NuxtLink to="/weekly">周刊</NuxtLink>
      <NuxtLink to="/issues">往日之星</NuxtLink>
      <NuxtLink to="/cases">案例</NuxtLink>
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
