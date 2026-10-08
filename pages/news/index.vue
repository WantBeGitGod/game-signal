<template>
  <div class="page-shell news-page">
    <header class="news-intro"><div><p class="eyebrow">THE GAMING DESK / 游戏资讯</p><h1>游戏世界，正在发生。</h1><p>近七天，值得关注的游戏口碑、厂商变化与展会消息。</p></div><span class="news-edition">GAME SIGNAL<br><strong>NEWSROOM</strong></span></header>
    <div class="news-layout"><div class="news-main">
      <nav class="news-tabs" aria-label="资讯范围"><button v-for="tab in tabs" :key="tab.value" :aria-pressed="view === tab.value" @click="view = tab.value">{{ tab.label }}<small>{{ counts[tab.value] }}</small></button></nav>
      <div class="news-filters"><label class="news-search"><Search :size="17" /><input v-model="search" type="search" placeholder="搜索游戏、厂商或事件" aria-label="搜索资讯"></label></div>
      <div v-if="topic || search" class="news-active"><span>{{ topic ? `${topic} · ` : '' }}找到 {{ filtered.length }} 件事</span><button @click="clearFilters">清除筛选 <X :size="13" /></button></div>
      <div v-if="groups.length"><section v-for="group in groups" :key="group.day" class="news-day"><div class="news-day-heading"><h2>{{ group.day.replaceAll('-', ' / ') }}</h2><span>{{ group.items.length }} 件事</span></div><NewsCard v-for="event in group.items" :key="event.id" :event="event" /></section></div>
      <div v-else class="news-empty"><Radio :size="30" /><h2>{{ view === 'featured' && !hasFilters ? '近期暂无精选' : '暂时没有匹配的资讯' }}</h2><p>{{ view === 'featured' && !hasFilters ? '有依据、有影响的消息才进入精选，不凑数量。' : '近七天没有匹配的消息，试试其他关键词。' }}</p><button @click="view = 'all'; clearFilters()">查看近期动态 <ArrowUpRight :size="15" /></button></div>
      <button v-if="visible.length < filtered.length" class="news-more" @click="limit += 20">继续阅读 <span>{{ filtered.length - visible.length }} 件</span></button>
      <p v-if="data?.generated_at" class="news-updated">页面资料整理于 {{ newsTimestamp(data.generated_at) }} · UTC+8</p>
    </div><aside class="news-sidebar"><section><p class="eyebrow">EXPLORE / 按主题阅读</p><h2>你关心的游戏与团队</h2><div class="news-topic-list"><button :aria-pressed="!topic" @click="topic = ''">全部主题</button><button v-for="name in topics" :key="name" :aria-pressed="topic === name" @click="topic = name">{{ name }}</button></div></section><section class="news-reading-note"><p class="eyebrow">ABOUT THIS DESK</p><h2>同一件事，放在一起读。</h2><p>这里展示近七天的消息，按原始报道或实质进展排序，转载不刷新时间。精选关注重要厂商变动、全球展会与发布会；更新公告和单家评分作为普通资讯。单纯游戏发售日期请看大作时间轴。</p></section><NuxtLink to="/articles" class="news-deeper">再读深一点 <ArrowUpRight :size="19" /><small>游戏设计与发行观察</small></NuxtLink></aside></div>
  </div>
</template>
<script setup lang="ts">
import { ArrowUpRight, Radio, Search, X } from 'lucide-vue-next'
import { groupNews, newsTimestamp, selectNews } from '~/utils/newsFeed'
useSeoMeta({ title: '游戏资讯', description: '按事件阅读游戏新闻、重点精选、后续进展与原始来源。' })
const { data } = await useNews()
const route = useRoute(), router = useRouter()
const scalar = (key: string) => typeof route.query[key] === 'string' ? route.query[key] as string : ''
const view = ref(scalar('view') || 'all'), search = ref(scalar('q')), topic = ref(scalar('topic')), limit = ref(20)
const tabs = [{ value: 'all', label: '近期动态' }, { value: 'featured', label: '精选' }]
const newsNow = useNewsNow()
const allEvents = computed(() => selectNews(data.value?.events || [], { now: newsNow.value }))
const counts = computed(() => Object.fromEntries(tabs.map(t => [t.value, selectNews(allEvents.value, { view: t.value, now: newsNow.value }).length])))
const topics = computed(() => [...new Set(allEvents.value.flatMap(e => e.topics))].sort())
const hasFilters = computed(() => Boolean(search.value || topic.value))
const filtered = computed(() => selectNews(allEvents.value, { view: view.value, search: search.value, topic: topic.value, now: newsNow.value }))
const visible = computed(() => filtered.value.slice(0, limit.value))
const groups = computed(() => groupNews(visible.value))
function clearFilters() { search.value = ''; topic.value = '' }
watch([view, search, topic], () => {
  limit.value = 20
  const query: Record<string, string> = {}
  for (const [key, value] of Object.entries({ view: view.value === 'all' ? '' : view.value, q: search.value, topic: topic.value })) if (value) query[key] = value
  void router.replace({ query })
})
watch(() => route.query, () => {
  view.value = scalar('view') || 'all'; search.value = scalar('q'); topic.value = scalar('topic')
})
</script>
<style scoped>
.news-page{padding:45px clamp(22px,4.5vw,64px) 70px}.news-intro{display:flex;align-items:center;justify-content:space-between;gap:25px;border-bottom:2px solid var(--ink);padding-bottom:32px;margin-bottom:32px}.news-intro h1{font:900 clamp(30px,4vw,50px)/1.5 var(--serif);margin:13px 0}.news-intro p:not(.eyebrow){color:var(--muted);font-size:14px}.news-edition{font:10px/2 var(--mono);letter-spacing:.18em;text-align:right;color:var(--blue)}.news-edition strong{font-size:16px}.news-layout{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:55px}.news-tabs{display:flex;gap:26px;border-bottom:1px solid var(--line)}button,input{font:inherit;color:inherit}.news-tabs button{border:0;border-bottom:3px solid transparent;background:none;padding:0 0 15px;font-weight:700;cursor:pointer;color:var(--muted)}.news-tabs button[aria-pressed=true]{border-color:var(--blue);color:var(--blue)}.news-tabs small{font:10px var(--mono);margin-left:8px}.news-filters{display:flex;flex-wrap:wrap;gap:10px;padding:20px 0;font-size:12px}.news-search{display:flex;align-items:center;gap:8px;flex:1;min-width:180px}.news-search input{background:transparent;border:0;min-width:0;width:100%;padding:8px 0}.news-active{display:flex;justify-content:space-between;gap:15px;font-size:12px;color:var(--blue);padding:10px 0}.news-active button{background:none;border:0;display:flex;gap:5px;align-items:center;cursor:pointer}.news-day-heading{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--ink);margin-top:25px;padding-bottom:10px}.news-day-heading h2{font:12px var(--mono);letter-spacing:.12em;margin:0}.news-day-heading span{font-size:11px;color:var(--muted)}.news-sidebar>section{padding-bottom:25px;border-bottom:1px solid var(--line);margin-bottom:28px}.news-sidebar h2{font:700 18px/1.6 var(--serif);margin:12px 0 18px}.news-topic-list{display:flex;flex-wrap:wrap;gap:8px}.news-topic-list button{border:1px solid var(--line);background:transparent;padding:5px 9px;font-size:11px;text-align:left;cursor:pointer}.news-topic-list button[aria-pressed=true]{background:var(--blue);border-color:var(--blue);color:white}.news-reading-note p:last-child{font-size:12px;line-height:1.95;color:var(--muted)}.news-deeper{display:grid;grid-template-columns:1fr auto;font-size:16px;font-weight:700;gap:8px}.news-deeper small{font-size:11px;color:var(--muted);font-weight:400}.news-empty{text-align:center;padding:65px 15px}.news-empty>svg{color:var(--blue);margin:auto}.news-empty h2{font:700 23px var(--serif);margin:20px 0}.news-empty p{font-size:13px;color:var(--muted)}.news-empty button{display:inline-flex;align-items:center;gap:8px;background:none;border:0;color:var(--blue);cursor:pointer;margin-top:15px}.news-more{display:block;border:1px solid var(--line);background:var(--paper-bright);margin:30px auto;padding:12px 30px;cursor:pointer}.news-more span{font-size:11px;margin-left:10px;color:var(--muted)}.news-updated{font-size:10px;color:var(--muted);margin-top:30px}button:focus-visible,input:focus-visible{outline:2px solid var(--blue);outline-offset:4px}@media(max-width:900px){.news-layout{grid-template-columns:1fr;gap:35px}.news-sidebar{border-top:2px solid var(--ink);padding-top:25px}.news-edition{display:none}}@media(max-width:500px){.news-search{flex-basis:100%}.news-intro{padding-bottom:22px}.news-tabs{gap:20px}.news-tabs button{font-size:14px}}
</style>
