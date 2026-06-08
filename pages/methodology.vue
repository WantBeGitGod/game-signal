<template>
  <div class="page-shell article-shell">
    <header class="page-intro">
      <p class="eyebrow">ANALYSIS METHOD</p>
      <h1 class="balanced-title">
        <span>什么才算一个</span>
        <span>值得追问的信号？</span>
      </h1>
      <p>Game Signal 不把在线人数等同于成功，也不让模型替代排序。今日之星来自一套可解释、可复现、可修改的规则。</p>
    </header>
    <section class="method-grid">
      <article v-for="item in methods" :key="item.code">
        <span>{{ item.code }}</span>
        <h2>{{ item.title }}</h2>
        <p>{{ item.text }}</p>
      </article>
    </section>
    <section class="method-note">
      <h2 class="balanced-title">
        <span>评分的作用</span>
        <span>是缩小问题，</span>
        <span>不是给出答案。</span>
      </h2>
      <p>评分的作用是缩小问题，不是给出答案。老游戏和昨日之星只折算在线人数贡献，增长、口碑背离和发行窗口仍保留编辑价值。</p>
    </section>
    <section v-if="scoring" class="scoring-sheet">
      <div>
        <p class="eyebrow">CURRENT WEIGHTS</p>
        <h2>当前评分权重</h2>
      </div>
      <dl>
        <div>
          <dt>新作窗口</dt>
          <dd>{{ scoring.new_release_window_days }} 天</dd>
        </div>
        <div>
          <dt>人数权重</dt>
          <dd>log10(人数) × {{ scoring.player_log_weight }}</dd>
        </div>
        <div>
          <dt>增长权重</dt>
          <dd>正增长 × {{ scoring.growth_weight }}，封顶 {{ scoring.growth_cap * 100 }}%</dd>
        </div>
        <div>
          <dt>出现天数</dt>
          <dd>每天 × {{ scoring.days_seen_weight }}，最多 {{ scoring.days_seen_cap }} 天</dd>
        </div>
        <div>
          <dt>老游戏人数折算</dt>
          <dd>{{ percent(scoring.old_game_player_discount) }}</dd>
        </div>
        <div>
          <dt>昨日之星人数折算</dt>
          <dd>{{ percent(scoring.yesterday_star_player_discount) }}</dd>
        </div>
        <div>
          <dt>三连触发</dt>
          <dd>{{ scoring.consecutive_star_case_threshold }} 天自动建私有案例</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "分析方法" })
const { data: scoring } = await useScoring()
const methods = [
  { code: "01", title: "突然爆发", text: "当前观测值相对上一观测日显著跃升，优先寻找外部事件与传播触发点。" },
  { code: "02", title: "新作起量", text: "发行窗口内快速进入可见区间，观察定位、素材和首批用户是否形成正循环。" },
  { code: "03", title: "老游戏回归", text: "沉寂后重新出现，重点核验版本、折扣、主播或社区事件。" },
  { code: "04", title: "口碑与热度背离", text: "热度与评价方向不一致，说明产品承诺、受众预期或争议值得继续研究。" },
  { code: "05", title: "持续增长", text: "连续多个观测点上升，优先判断增长是否来自可持续的发行机制。" }
]
function percent(value: number) {
  return `${Math.round(value * 100)}%`
}
</script>
