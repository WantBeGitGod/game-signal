<template>
  <section v-if="data?.notes.length" id="community-notes" ref="section" class="community-notes">
    <header class="community-heading">
      <div><p class="eyebrow">FROM THE PLAYERS / 社区补充</p><h2>玩家补充的几件事</h2></div>
      <span class="community-experiment">本地实验版</span>
    </header>
    <p class="community-intro">从具体体验里，补上游戏介绍没说完的部分。以下是作者观点，不代表全体玩家。</p>
    <p v-if="data.report_issue_date && data.report_issue_date !== issueDate" class="community-intro">沿用 <NuxtLink :to="`/issues/${data.report_issue_date}#community-notes`">{{ data.report_issue_date }} 首篇报道</NuxtLink>，采样时间与材料保持原样。</p>
    <div class="community-stories">
      <article v-for="(note, index) in data.notes" :key="note.title" class="community-story">
        <span class="community-number">0{{ index + 1 }}</span>
        <div><h3>{{ note.title }}</h3><p>{{ note.text }}</p>
          <div class="community-sources"><a v-for="source in note.sources" :key="source.url" :href="source.url" target="_blank" rel="noopener noreferrer" :title="source.title">{{ source.platform }} · 阅读来源 ↗</a></div>
        </div>
      </article>
    </div>
    <div v-if="data.tags.length" class="community-topics"><span>样本中反复提到</span><span v-for="tag in data.tags" :key="tag.name" class="community-tag">{{ tag.name }} <small>{{ tag.count }} 篇</small></span></div>
    <details class="community-method"><summary>查看采样范围与来源口径</summary><p>{{ data.sampled_at.slice(0, 16).replace('T', ' ') }} UTC 采样，共 {{ data.sample_count }} 条去重材料（含评价、新闻及视频文字）。沿用本游戏首篇社区报道，不是刊发当天的舆情复原；旧材料只补充玩法认识，标签只统计该次采样前七天内的图文提及。</p><ul><li v-for="platform in data.platforms" :key="platform.name">{{ platform.name }}：{{ platform.count }} 条搜索样本</li></ul><p>详细评价优先的选择性样本，不代表全站热度、负面比例或玩家画像。不同平台不相加比较。视频仅使用可读取的文字，未分析画面与音轨。</p></details>
  </section>
</template>

<script setup lang="ts">
type Source = { title: string; platform: string; url: string }
type Preview = { issue_date: string; report_issue_date?: string; appid: string; sampled_at: string; sample_count: number; notes: { title: string; text: string; sources: Source[] }[]; tags: { name: string; count: number }[]; platforms: { name: string; count: number }[] }
const props = defineProps<{ issueDate: string; appid?: string }>()
const data = ref<Preview | null>(null)
const section = ref<HTMLElement | null>(null)
// This experiment never requests private runtime data from a production build.
if (import.meta.dev) {
  onMounted(() => watch(() => [props.issueDate, props.appid], async () => {
    data.value = null
    const date = props.issueDate, appid = props.appid
    if (!appid) return
    try {
      const result = await $fetch<Preview | null>(`http://127.0.0.1:3212/preview/${date}`, { timeout: 3000 })
      if (props.issueDate === date && props.appid === appid && result?.issue_date === date && result.appid === appid) {
        data.value = result
        await nextTick()
        if (window.location.hash === "#community-notes") section.value?.scrollIntoView({ block: "start" })
      }
    } catch { /* Optional research must never prevent an issue from rendering. */ }
  }, { immediate: true }))
}
</script>

<style scoped>
.community-notes{margin:40px 0 16px;padding:34px;background:var(--paper-bright);border:1px solid var(--line);border-top:3px solid var(--blue);border-radius:4px}.community-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.community-heading h2{font-family:var(--serif);font-size:clamp(23px,3vw,32px);line-height:1.5;margin:8px 0}.community-experiment{white-space:nowrap;font-size:11px;color:var(--blue);background:#eeebfc;padding:5px 10px;border-radius:20px}.community-intro{font-size:14px;color:var(--muted);line-height:1.8;margin:6px 0 26px}.community-stories{display:grid;gap:24px}.community-story{display:grid;grid-template-columns:32px 1fr;gap:16px;border-top:1px solid var(--line);padding-top:24px}.community-number{font:500 16px var(--mono);color:var(--blue);padding-top:4px}.community-story h3{font-family:var(--serif);font-size:21px;line-height:1.6;margin:0 0 8px}.community-story p{font-size:15px;line-height:1.95;margin:0;color:var(--ink);max-width:76ch}.community-sources{display:flex;flex-wrap:wrap;gap:16px;margin-top:12px}.community-sources a{font-size:12px;color:var(--blue);text-decoration:none}.community-sources a:hover{text-decoration:underline}.community-topics{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:30px;font-size:12px;color:var(--muted)}.community-tag{border:1px solid var(--line);border-radius:3px;padding:4px 9px;color:var(--ink)}.community-tag small{color:var(--muted);margin-left:5px}.community-method{border-top:1px solid var(--line);margin-top:24px;padding-top:16px;font-size:12px;color:var(--muted);line-height:1.8}.community-method summary{cursor:pointer}.community-method ul{padding-left:20px}.community-method p{margin:12px 0}@media(max-width:600px){.community-notes{padding:22px 18px;margin-top:24px}.community-heading{display:block}.community-experiment{display:inline-block;margin:6px 0}.community-story{grid-template-columns:24px 1fr;gap:9px}.community-story h3{font-size:19px}.community-story p{font-size:14px}}
</style>
