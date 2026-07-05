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
      <p>
        峰值规模和是否突破历史高点是主轴；连续出现只作为低权重稳定性信号。
        同一游戏在同一自然月重复摘星时，会按本月此前获胜次数折算最终总分。
      </p>
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
          <dd>最高 {{ scoring.peak_score_weight }} 分，{{ scoring.peak_score_cap.toLocaleString() }} 封顶</dd>
        </div>
        <div>
          <dt>增长权重</dt>
          <dd>超越过往最高峰值，最高 {{ scoring.record_growth_weight }} 分</dd>
        </div>
        <div>
          <dt>出现天数</dt>
          <dd>最高 {{ scoring.days_seen_score_weight }} 分，最多 {{ scoring.days_seen_cap }} 天</dd>
        </div>
        <div>
          <dt>信号类型</dt>
          <dd>最高 {{ scoring.signal_type_score_weight }} 分</dd>
        </div>
        <div>
          <dt>本月重复摘星折算</dt>
          <dd>{{ repeatMultipliers }}</dd>
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
const repeatMultipliers = computed(() => scoring.value?.cumulative_star_score_multipliers.map(percent).join(" / ") || "")
const methods = [
  { code: "01", title: "新作起量", text: "发行窗口内快速进入可见区间，观察定位、素材和首批用户是否形成正循环。" },
  { code: "02", title: "口碑与热度背离", text: "热度与评价方向不一致，说明产品承诺、受众预期或争议值得继续研究。" },
  { code: "03", title: "持续增长", text: "今日峰值继续突破过往最高点，优先判断增长是否来自可持续的发行机制。" },
  { code: "04", title: "老游戏回归", text: "沉寂后重新出现，重点核验版本、折扣、主播或社区事件。" }
]
function percent(value: number) {
  return `${Math.round(value * 100)}%`
}
</script>
