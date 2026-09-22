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
        系统先判断当天是否存在合格发行事件，再比较峰值规模和是否突破历史高点；连续出现只保留为审计材料，不额外得分。
        同一 App ID 在过去 30 天重复摘星时会承担自己的分数折算；已确认的试玩版与正式版共享公开曝光次数，但不互相传递分数债务。
        2026 年 9 月起，低于 60% 的可靠好评率会折算并标记“评分背离”。9 月 5 日起，高于 90% 的奖励要求同一评价快照至少 100 条评论。
      </p>
    </section>
    <section v-if="scoring" class="scoring-sheet">
      <div>
        <p class="eyebrow">CURRENT WEIGHTS</p>
        <h2>当前评分权重</h2>
      </div>
      <dl>
        <div>
          <dt>规则生效日</dt>
          <dd>2026-09-21；历史刊期按明确更正范围重排</dd>
        </div>
        <div>
          <dt>发行窗口</dt>
          <dd>每轮发行后的 180 天可正常参评，前 30 天享受新游 ×1.25。EA 到正式版相隔 ≤180 天继承原有窗口与全部计分历史；相隔 >180 天，正式版独立起算。重大更新／DLC 证据窗口 14 天。</dd>
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
          <dt>老游戏回归</dt>
          <dd>正常参评窗口结束后，仅限当前发行周期两年内，须有官方重大更新／DLC，且峰值严格超过该周期此前历史纪录 30%；不设绝对人数下限，缺少历史证据暂不入选。满三年排除采集与选星；原作日期不覆盖独立发行版本日期。</dd>
        </div>
        <div>
          <dt>出现天数</dt>
          <dd>保留审计，固定 {{ scoring.days_seen_score_weight }} 分</dd>
        </div>
        <div>
          <dt>发行事件倍率</dt>
          <dd>{{ eventRule }}</dd>
        </div>
        <div>
          <dt>好评率折算</dt>
          <dd>{{ scoring.review_ratio_scoring_v2_effective_date || "2026-09-01" }} 起：{{ reviewRatioRule }}</dd>
        </div>
        <div>
          <dt>固定类型加分</dt>
          <dd>全部取消；标签只解释发行节点</dd>
        </div>
        <div>
          <dt>30 天重复摘星折算</dt>
          <dd>{{ repeatRule }}</dd>
        </div>
        <div>
          <dt>产品家族曝光</dt>
          <dd>30 天最多 {{ scoring.product_family_repeat_window_max_wins || 4 }} 次，试玩最多占前 {{ scoring.product_family_trial_window_max_wins || 3 }} 次</dd>
        </div>
        <div>
          <dt>评论核验阈值</dt>
          <dd>首次可靠观察超过 {{ (scoring.release_review_verification_threshold || 5000).toLocaleString() }} 条只触发核验，不直接定案</dd>
        </div>
        <div>
          <dt>连续摘星上限</dt>
          <dd>最多连续两天，两连庄后冷却完整 7 天；此后每次摘星再冷却 7 天。30 天累计最多三次，重复摘星折扣保留。独立正式版周期重新起算。</dd>
        </div>
        <div>
          <dt>冷却后的复选</dt>
          <dd>2026-09-23 起，复选以冷却节奏控制，不再强制比上次摘星峰值增长 30%；冷却结束按当日分数竞争。递补入选注明原评分排名，并可展开查看原榜首及未入选原因。</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "分析方法" })
const { data: scoring } = await useScoring()
const repeatRule = computed(() => {
  if (!scoring.value) return ""
  const multipliers = scoring.value.cumulative_star_score_multipliers.map(percent).join(" / ")
  const days = scoring.value.daily_star_repeat_window_days || 30
  const maxWins = scoring.value.daily_star_repeat_window_max_wins || 3
  return `${days} 天窗口：${multipliers}；${maxWins} 次后暂退`
})
const eventRule = computed(() => {
  if (!scoring.value) return ""
  return "已确认新作及独立正式版周期的前 30 天 ×1.25；EA 转正间隔超过 180 天才重新起算。试玩、测试与重大更新不享受新游加分。"
})
const reviewRatioRule = computed(() => {
  if (!scoring.value) return ""
  const values = scoring.value.review_ratio_multipliers_v2 || {
    below_30: .75, below_50: .85, below_60: .90, above_90: 1.10, otherwise: 1
  }
  return `低于 30% × ${values.below_30}；30%–低于 50% × ${values.below_50}；50%–低于 60% × ${values.below_60}；60%–90% 或未知 × ${values.otherwise}；高于 90% 且评论至少 ${scoring.value.review_reward_minimum_total || 100} 条 × ${values.above_90}。奖励门槛从 ${scoring.value.review_reward_minimum_effective_date || "2026-09-05"} 起生效；历史刊期保留当时规则。`

})
const methods = [
  { code: "01", title: "新作起量", text: "首次进入市场的产品在 30 天窗口内快速进入可见区间；有官方 Advanced Access 时，从实际开放游玩的日期起算。" },
  { code: "05", title: "老游起量", text: "当前发行周期已超过 30 天的普通发行候选，不再标为新作；标签不额外加分，仍需满足参评与摘星条件。" },
  { code: "02", title: "试玩起量", text: "Demo 或 Playtest 可以独立成为今日之星，但必须明确标注试玩身份，不能冒充正式首发。" },
  { code: "03", title: "正式版起量", text: "EA 转正间隔 ≤180 天继承全部历史，>180 天独立计算加分、峰值、摘星惩罚、冷却与观测门槛。公开摘星档案保留全部记录；EA 日期未知时不擅自重置。" },
  { code: "04", title: "重大更新回流", text: "只有近 14 天内可核验的大型版本、资料片、实质赛季内容或系统重做可以让老游戏重新参选；补丁、折扣与普通回流不行。" }
]
function percent(value: number) {
  return `${Math.round(value * 100)}%`
}
</script>
