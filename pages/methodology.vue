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
          <dd>{{ scoring.release_event_scoring_effective_date || "2026-07-31" }}，只向前生效</dd>
        </div>
        <div>
          <dt>发行窗口</dt>
          <dd>新作、试玩与正式版 {{ scoring.new_release_window_days }} 天；重大更新 {{ scoring.major_update_window_days || 14 }} 天</dd>
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
          <dd>保留审计，固定 {{ scoring.days_seen_score_weight }} 分</dd>
        </div>
        <div>
          <dt>发行事件倍率</dt>
          <dd>{{ eventRule }}</dd>
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
const repeatRule = computed(() => {
  if (!scoring.value) return ""
  const multipliers = scoring.value.cumulative_star_score_multipliers.map(percent).join(" / ")
  const days = scoring.value.daily_star_repeat_window_days || 30
  const maxWins = scoring.value.daily_star_repeat_window_max_wins || 3
  return `${days} 天窗口：${multipliers}；${maxWins} 次后暂退`
})
const eventRule = computed(() => {
  if (!scoring.value) return ""
  const values = scoring.value.release_event_multipliers || {
    true_new: 1,
    trial: 1,
    formal_release: 0.85,
    pending: 0.85,
    major_update: 0.7
  }
  return `新作/试玩 ${percent(values.true_new)}；正式版/待核验 ${percent(values.formal_release)}；重大更新 ${percent(values.major_update)}`
})
const methods = [
  { code: "01", title: "新作起量", text: "首次进入市场的产品在 30 天窗口内快速进入可见区间；有官方 Advanced Access 时，从实际开放游玩的日期起算。" },
  { code: "02", title: "试玩起量", text: "Demo 或 Playtest 可以独立成为今日之星，但必须明确标注试玩身份，不能冒充正式首发。" },
  { code: "03", title: "正式版起量", text: "已经积累玩家与评论的 Early Access 产品转为 1.0 时按正式版节点判断；证据不足时使用中性的发行节点标签。" },
  { code: "04", title: "重大更新回流", text: "只有近 14 天内可核验的大型版本、资料片、实质赛季内容或系统重做可以让老游戏重新参选；补丁、折扣与普通回流不行。" }
]
function percent(value: number) {
  return `${Math.round(value * 100)}%`
}
</script>
