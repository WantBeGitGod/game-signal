<template>
  <div v-if="issue" class="page-shell weekly-page">
    <header class="weekly-hero">
      <p class="eyebrow">GAME SIGNAL WEEKLY / 第 {{ String(issue.issue_number).padStart(3, "0") }} 期</p>
      <h1>{{ issue.title }}</h1>
      <p class="weekly-issue-meta">{{ issue.week_start }} — {{ issue.week_end }}</p>
      <p>{{ issue.summary }}</p>
      <p v-if="coverageNote" class="weekly-coverage-note">{{ coverageNote }}</p>
    </header>

    <section class="weekly-deep-section">
      <div class="section-heading">
        <div><p class="eyebrow">THE TWO TO TALK ABOUT</p><h2>这周，聊这两款</h2></div>
        <p>从玩法钩子到一周表现</p>
      </div>
      <article v-for="signal in protagonists" :key="signal.rank" class="weekly-feature">
        <div class="feature-visual">
          <img v-if="signal.game.cover_image_url" :src="signal.game.cover_image_url" :alt="signal.game.name" loading="lazy" />
          <span class="feature-number">{{ String(signal.rank).padStart(2, "0") }}</span>
          <p>{{ signal.game.name }}</p>
        </div>
        <div class="feature-copy">
          <p class="eyebrow">综合 #{{ signal.rank }} · {{ signal.label }}</p>
          <h2>{{ feature(signal)?.heading || signal.game.name }}</h2>
          <div class="feature-stats">
            <span><strong>{{ rankCount(signal, 1) }}</strong> 次第一</span>
            <span><strong>{{ rankCount(signal, 2) }}</strong> 次第二</span>
            <span><strong>{{ metric(signal, "actual_star_count") }}</strong> 次摘星</span>
          </div>
          <template v-if="feature(signal)">
            <p v-for="paragraph in feature(signal)?.paragraphs" :key="paragraph" class="feature-paragraph">{{ paragraph }}</p>
          </template>
          <template v-else><p class="feature-paragraph">{{ signal.game.description }}</p><p class="feature-paragraph">{{ signal.selection_reason }}</p></template>
          <WeeklyTrajectory :issue="issue" :signal="signal" :label="signal.game.name" />
          <div class="feature-links">
            <NuxtLink v-if="articleFor(signal)" :to="`/articles/${articleFor(signal)}`">继续读这款游戏的文章 ↗</NuxtLink>
            <a v-if="signal.game.steam_url" :href="signal.game.steam_url" target="_blank" rel="noopener noreferrer">Steam 游戏介绍 ↗</a>
          </div>
          <details v-if="charts[signal.game.appid || '']" class="observation-detail">
            <summary>展开本期实际在线观测</summary>
            <WeeklyChart :chart="charts[signal.game.appid || '']" :label="signal.game.name" :window-start="issue.week_start" :window-end="issue.week_end" />
          </details>
        </div>
      </article>
      <p class="trajectory-key">日期格记录每日模型名次；★ 单独标记实际今日之星。— 表示当日未进前五，? 表示无已发布日榜记录。名次变化不等于在线人数变化。</p>
    </section>

    <section class="weekly-watch-section">
      <div class="section-heading">
        <div><p class="eyebrow">THE WEEK IN NUMBERS</p><h2>一周表现，放在一起看</h2></div>
      </div>
      <div class="weekly-ranking-table" role="table" aria-label="本周综合前五">
        <div class="weekly-ranking-row is-head" role="row">
          <span>综合</span><span>游戏</span><span>第一</span><span>第二</span><span>摘星</span><span>上榜天数</span><span>周积分</span>
        </div>
        <div v-for="signal in issue.signals" :key="signal.rank" class="weekly-ranking-row" role="row">
          <strong>#{{ signal.rank }}</strong><span>{{ signal.game.name }}</span>
          <span>{{ rankCount(signal, 1) }} 次</span><span>{{ rankCount(signal, 2) }} 次</span>
          <span>{{ metric(signal, "actual_star_count") }} 次</span><span>{{ metric(signal, "top_five_days") }} 天</span>
          <strong>{{ metric(signal, "weekly_score") }}</strong>
        </div>
      </div>
      <p class="trajectory-key">周积分 = 日榜第一至第五各计 5、4、3、2、1 分，每次摘星另加 3 分。第一、第二指模型名次；实际摘星单独统计。</p>
    </section>

    <section v-if="otherGames.length" class="weekly-deep-section">
      <div class="section-heading"><div><p class="eyebrow">ALSO ON OUR RADAR</p><h2>另外三款，也留一眼</h2></div></div>
      <div class="weekly-notes">
        <article v-for="signal in otherGames" :key="signal.rank" class="weekly-note">
          <img v-if="signal.game.cover_image_url" :src="signal.game.cover_image_url" :alt="signal.game.name" loading="lazy" />
          <p class="eyebrow">综合 #{{ signal.rank }}</p>
          <h3>{{ signal.game.name }}</h3>
          <p>{{ issue.editorial?.notes[signal.game.appid || ''] || signal.selection_reason }}</p>
          <WeeklyTrajectory :issue="issue" :signal="signal" :label="signal.game.name" />
          <NuxtLink v-if="articleFor(signal)" :to="`/articles/${articleFor(signal)}`">阅读全文 ↗</NuxtLink>
          <details v-if="charts[signal.game.appid || '']" class="observation-detail">
            <summary>实际在线观测</summary>
            <WeeklyChart :chart="charts[signal.game.appid || '']" :label="signal.game.name" :window-start="issue.week_start" :window-end="issue.week_end" />
          </details>
        </article>
      </div>
    </section>
    <section v-if="issue.editorial?.next_watch.length" class="weekly-next">
      <p class="eyebrow">TO BE CONTINUED</p><h2>下一周，要验证什么</h2>
      <ol><li v-for="question in issue.editorial.next_watch" :key="question">{{ question }}</li></ol>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ChartSeries, WeeklyIssue, WeeklySignal } from "~/types/public"
const route = useRoute()
const { data: issue } = await useWeeklyIssue(String(route.params.slug))
if (!issue.value) throw createError({ statusCode: 404, statusMessage: "Weekly issue not found" })
const { data: publishedArticles } = await useAsyncData("weekly-article-slugs", () => queryContent("/articles").only(["slug", "game_appid"]).find())
const protagonists = computed(() => issue.value!.signals.slice(0, 2))
const otherGames = computed(() => issue.value!.signals.slice(2))
const charts = reactive<Record<string, ChartSeries>>({})
for (const signal of issue.value.signals) {
  if (signal.chart_path && signal.game.appid) charts[signal.game.appid] = await loadPublicJson<ChartSeries>(signal.chart_path)
}
const coverageNote = computed(() => {
  const first = (issue.value as WeeklyIssue).signals[0]
  const covered = Number(first?.metrics.coverage_days || 0)
  const total = Number(first?.metrics.coverage_total_days || 0)
  return covered && total && covered !== total ? `历史日榜保留 ${covered}/${total} 天；缺失日期不补造。` : ""
})
useSeoMeta({ title: issue.value.title, description: issue.value.summary })
function feature(signal: WeeklySignal) { return issue.value?.editorial?.features[signal.game.appid || ""] }
function metric(signal: WeeklySignal, key: string) { return signal.metrics[key] ?? "—" }
function rankCount(signal: WeeklySignal, rank: number) {
  const key = rank === 1 ? "first_place_days" : "second_place_days"
  if (typeof signal.metrics[key] === "number") return signal.metrics[key]
  if (!Array.isArray(signal.metrics.daily_ranks)) return "—"
  return (signal.metrics.daily_ranks as Array<{ rank: number }>).filter(day => day.rank === rank).length
}
function articleFor(signal: WeeklySignal) {
  const articles = publishedArticles.value || []
  return articles.find(item => signal.article_slug && item.slug === signal.article_slug)?.slug
    || articles.find(item => signal.game.appid && String(item.game_appid) === signal.game.appid)?.slug
}
</script>

<style scoped>
.weekly-feature { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.4fr); gap: clamp(24px, 4vw, 58px); padding: 36px 0 48px; border-top: 2px solid var(--line); }
.feature-visual { position: relative; align-self: start; }
.feature-visual img { width: 100%; aspect-ratio: 460 / 215; object-fit: cover; display: block; border: 2px solid var(--line); }
.feature-number { display: inline-block; background: var(--coral); padding: 8px 18px; font: 900 38px var(--mono); border: 2px solid var(--line); margin-top: -2px; }
.feature-visual p { font-family: var(--serif); font-size: 26px; line-height: 1.2; overflow-wrap: anywhere; }
.feature-copy { min-width: 0; }
.feature-copy h2 { font-family: var(--serif); font-size: clamp(27px, 3vw, 44px); line-height: 1.2; margin: 12px 0 22px; }
.feature-stats { display: flex; flex-wrap: wrap; gap: 24px; border-block: 1px solid var(--line); padding: 12px 0; margin-bottom: 24px; font-size: 12px; }
.feature-stats strong { font: 900 26px var(--mono); margin-right: 3px; }
.feature-paragraph { font-size: 16px; line-height: 1.95; margin: 0 0 18px; }
.feature-links { display: flex; flex-wrap: wrap; gap: 16px; font-weight: 800; font-size: 13px; }
.feature-links a, .weekly-note > a { text-decoration: underline; text-underline-offset: 5px; }
.trajectory-key { font-size: 12px; line-height: 1.8; max-width: 900px; margin: 20px 0 0; }
.observation-detail { margin-top: 24px; border-top: 1px solid var(--line); padding-top: 12px; }
.observation-detail summary { cursor: pointer; font-size: 13px; font-weight: 700; margin-bottom: 12px; }
.weekly-notes { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 26px; }
.weekly-note { min-width: 0; border-top: 2px solid var(--line); padding-top: 18px; }
.weekly-note > img { display: block; width: 100%; aspect-ratio: 460 / 215; object-fit: cover; margin-bottom: 18px; }
.weekly-note h3 { font-family: var(--serif); font-size: 26px; line-height: 1.2; overflow-wrap: anywhere; }
.weekly-note > p:not(.eyebrow) { font-size: 14px; line-height: 1.9; }
.weekly-next { background: var(--acid); padding: clamp(30px, 5vw, 70px); border-bottom: 2px solid var(--line); }
.weekly-next h2 { font-family: var(--serif); font-size: 34px; margin: 12px 0 24px; }
.weekly-next ol { max-width: 850px; padding-left: 22px; }
.weekly-next li { padding: 0 0 16px 10px; line-height: 1.9; }
@media (max-width: 1000px) { .weekly-notes { grid-template-columns: 1fr; } .weekly-note > img { max-width: 400px; } }
@media (max-width: 760px) { .weekly-hero h1 { font-size: clamp(26px, 8vw, 58px); } .weekly-feature { grid-template-columns: 1fr; gap: 16px; } .feature-visual p { font-size: 22px; } .feature-copy h2 { font-size: 29px; } }
</style>

