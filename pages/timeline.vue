<template>
  <div ref="pageRoot" class="chronicle" :style="{ '--header-offset': `${headerOffset}px` }" :class="{ 'motion-ready': motionReady }">
    <header class="chronicle-hero">
      <div class="hero-grid" aria-hidden="true" />
      <div class="hero-orbit" aria-hidden="true"><span /><span /><span /></div>
      <div class="hero-copy">
        <p class="chronicle-kicker"><span /> GAME SIGNAL / THE RELEASE CHRONICLE</p>
        <h1>有些时刻，<br>值得<span class="hero-emphasis">等待。</span></h1>
        <p class="hero-description">从第一次亮相，到踏入那个世界。<br>沿着时间，遇见下一场大作。</p>
        <a class="hero-enter" href="#chronicle-events">沿时间线探索 <ArrowDown :size="17" /></a>
      </div>
      <div class="hero-stage" aria-hidden="true">
        <img v-if="heroArtwork?.image_url" :src="heroArtwork.image_url" alt="" class="hero-image" fetchpriority="high" @error="hideFailedImage">
        <div class="hero-stage-shade" />
        <span class="hero-year">{{ heroNode?.date_value.slice(0, 4) || activeYear || 'NEXT' }}</span>
        <div v-if="heroNode" class="hero-caption"><span>{{ isFuture(heroNode) ? 'NEXT ON THE HORIZON' : 'IN THE CHRONICLE' }}</span><strong>{{ heroNode.game_name }}</strong><small>{{ timelineDate(heroNode.date_value) }}</small></div>
        <span class="hero-coordinate">{{ nodes.length.toString().padStart(2, '0') }} SELECTED MOMENTS · OFFICIAL SOURCES</span>
      </div>
      <div class="hero-foot"><span>大作时间轴</span><span>宣发 / 本体 / DLC</span><span>日期有据，期待有序 <MoveDown :size="14" /></span></div>
    </header>

    <section id="chronicle-events" class="chronicle-body">
      <details v-if="watchedGames.length" class="coverage-panel">
        <summary><span>持续扩充的关注名单</span><strong>{{ watchedGames.length }} 款重点关注 · {{ datedGames.size }} 款已有官方节点</strong><span>查看名单 <Plus :size="14" /></span></summary>
        <p>用户指定、知名系列新作与厂商重点项目优先关注，奖项和发布会持续补充候选。不要求 Steam 页面；尚未核验的日期保留空缺。</p>
        <div class="coverage-grid">
          <div v-for="game in watchedGames" :key="game.name" class="coverage-game">
            <button v-if="datedGames.has(game.name)" @click="jumpToGame(game.name)">{{ game.name }} <ArrowUpRight :size="14" /></button>
            <strong v-else>{{ game.name }}</strong>
            <small>开发：{{ game.developers.join(' / ') || '待核验' }}</small>
            <small v-if="game.publishers.length">发行：{{ game.publishers.join(' / ') }}</small>
            <span>{{ game.selection_reason }}</span>
            <em>{{ datedGames.has(game.name) ? '已核验官方节点' : '已关注 · 日期待核验' }}</em>
            <a v-if="!datedGames.has(game.name) && game.official_url" :href="game.official_url" target="_blank" rel="noopener noreferrer">查看官方信息 <ArrowUpRight :size="12" /></a>
          </div>
        </div>
      </details>
      <div class="chronicle-controls">
        <div class="year-select"><span>CHAPTER</span><select v-model="year" aria-label="选择年份"><option value="">全部年份</option><option v-for="item in years" :key="item">{{ item }}</option></select></div>
        <div class="kind-select" aria-label="节点类型"><button v-for="item in filters" :key="item.id" :class="{ chosen: kind === item.id }" :aria-pressed="kind === item.id" @click="kind = item.id">{{ item.name }}</button></div>
        <span class="moment-count">{{ nodes.length.toString().padStart(2, '0') }} 个时刻</span>
      </div>
      <div v-if="nodes.length" class="chronicle-track">
        <div class="time-spine" aria-hidden="true"><div :style="{ height: `${progress * 100}%` }" /><span /></div>
        <section v-for="group in groups" :key="group.year" class="chapter">
          <header class="chapter-heading"><span>THE CHAPTER</span><h2>{{ group.year }}</h2><p>在这一年，新的世界陆续打开。</p></header>
          <article v-for="(node, index) in group.nodes" :id="`moment-${node.id}`" :key="node.id" class="moment" :class="{ alternate: index % 2 === 1, future: isFuture(node), visible: visibleIds.has(node.id) }" :data-moment="node.id">
            <div class="moment-axis" aria-hidden="true"><span class="axis-halo" /><span class="axis-dot" /><span class="axis-tick" /></div>
            <div class="moment-date"><span class="date-chapter">{{ isFuture(node) ? 'ON THE HORIZON' : 'IN THE CHRONICLE' }}</span><time :datetime="dateTime(node)">{{ shortDate(node) }}</time><small>{{ kinds[node.kind] || '官方安排' }}<span> / {{ node.date_precision !== 'day' ? '官宣窗口' : isFuture(node) ? '即将到来' : '回望这一刻' }}</span></small></div>
            <div class="moment-work">
              <button class="work-card" :aria-label="`查看${node.game_name}：${timelineDate(node.date_value)}`" @click="openMoment(node)" @pointermove="moveCard" @pointerleave="resetCard">
                <div class="work-image"><img v-if="artFor(node)?.image_url" :src="artFor(node)?.image_url" :style="{ objectPosition: artFor(node)?.image_position, objectFit: artFor(node)?.card_fit, transformOrigin: artFor(node)?.image_position }" alt="" loading="lazy" decoding="async" @error="hideFailedImage"><span v-else class="art-placeholder">{{ node.game_name }}</span></div>
                <div class="work-shade" /><div class="work-grid" aria-hidden="true" />
                <div class="work-topline"><span>{{ artFor(node)?.studio || node.platform }}</span><span class="work-number">{{ String(index + 1).padStart(2, '0') }}</span></div>
                <div class="work-copy"><span class="work-english">{{ artFor(node)?.english_name || 'THE NEXT WORLD' }}</span><h3>{{ node.game_name }}</h3><div class="work-bottom"><span>{{ node.label }}</span><span class="work-open"><ArrowUpRight :size="20" /></span></div></div>
              </button>
              <div class="moment-meta"><span><BadgeCheck :size="13" /> 官方日期</span><span>{{ node.platform }}{{ node.region ? ` · ${node.region}` : '' }}</span><button @click="openMoment(node)">展开节点 <Plus :size="13" /></button></div>
            </div>
          </article>
        </section>
        <div class="chronicle-end"><span class="end-dot" /><p>下一个世界，正在路上。</p><small>更多官宣，会在这里留下新的刻度。</small><NuxtLink to="/news">去看看正在发生的消息 <ArrowUpRight :size="15" /></NuxtLink></div>
      </div>
      <div v-else class="chronicle-empty"><span class="empty-orbit" aria-hidden="true" /><CalendarDays :size="28" /><h2>{{ kind ? '这个章节，尚未留下节点。' : '等待下一次官宣。' }}</h2><p>只让有官方依据的日期进入这条时间线。</p><button v-if="kind || year" @click="kind = ''; year = ''">查看全部时刻 <ArrowUpRight :size="15" /></button><NuxtLink v-else to="/news">先看看最新消息 <ArrowUpRight :size="15" /></NuxtLink></div>
    </section>
    <nav v-if="nodes.length" class="chapter-navigation" aria-label="跳转时间节点"><span>{{ activeYear }}</span><a v-for="node in nodes" :key="node.id" :href="`#moment-${node.id}`" :aria-label="`${node.game_name}，${timelineDate(node.date_value)}`" :title="`${shortDate(node)} · ${node.game_name}`"><span />{{ shortDate(node) }}</a><a href="#chronicle-events" class="return-start" aria-label="返回时间轴起点"><ArrowUp :size="15" /></a></nav>

    <dialog ref="detailDialog" class="moment-dialog" aria-label="游戏时间节点详情" @click="closeOnBackdrop" @close="selected = null">
      <template v-if="selected"><button class="dialog-close" aria-label="关闭节点详情" @click="detailDialog?.close()"><X :size="20" /></button><div class="dialog-art"><img v-if="artFor(selected)?.image_url" :src="artFor(selected)?.image_url" :style="{ objectPosition: artFor(selected)?.image_position, objectFit: artFor(selected)?.dialog_fit }" alt="" @error="hideFailedImage"><span>{{ artFor(selected)?.english_name }}</span></div><div class="dialog-copy"><p class="chronicle-kicker">{{ kinds[selected.kind] || '官方安排' }} / {{ timelineDate(selected.date_value) }}</p><h2>{{ selected.game_name }}</h2><p>{{ selected.label }}</p><div class="dialog-platform"><span>{{ selected.platform }}</span><span v-if="selected.region">{{ selected.region }}</span></div><dl v-if="selectedIdentity" class="dialog-credits"><div><dt>开发</dt><dd>{{ selectedIdentity.developers.join(' / ') || '待核验' }}</dd></div><div v-if="selectedIdentity.publishers.length"><dt>发行</dt><dd>{{ selectedIdentity.publishers.join(' / ') }}</dd></div><div><dt>关注依据</dt><dd>{{ selectedIdentity.selection_reason }}</dd></div></dl><p v-if="relatedEvent" class="dialog-summary">{{ relatedEvent.summary }}</p><div class="dialog-links"><a :href="selected.source_url" target="_blank" rel="noopener noreferrer">核对官方依据 <ArrowUpRight :size="15" /></a><NuxtLink :to="`/news#event-${selected.event_id}`" @click="detailDialog?.close()">消息与更新记录 <ArrowUpRight :size="15" /></NuxtLink></div><small>按官宣精度展示；发售安排变更后，节点会随核验结果更新。</small></div></template>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp, ArrowUpRight, BadgeCheck, CalendarDays, MoveDown, Plus, X } from 'lucide-vue-next'
import type { TimelineNode } from '~/types/news'
import type { TimelineArtwork } from '~/types/timeline'
useSeoMeta({ title: '大作时间轴', description: '沿时间线探索游戏大作的官方宣发、发售与 DLC 节点。' })
const { data } = await useNews()
const { data: artwork } = await useAsyncData('timeline-artwork', () => loadPublicJsonOrDefault<Record<string, TimelineArtwork>>('/data/timeline-artwork.json', {}))
const year = ref(''), kind = ref(''), pageRoot = ref<HTMLElement>(), detailDialog = ref<HTMLDialogElement>(), selected = ref<TimelineNode | null>(null)
const visibleIds = ref(new Set<number>()), progress = ref(0), motionReady = ref(false)
const today = ref(''), headerOffset = ref(88)
const kinds: Record<string, string> = { announcement: '宣发节点', release: '游戏发售', dlc: 'DLC 发售' }
const filters = [{ id: '', name: '全部时刻' }, { id: 'release', name: '游戏发售' }, { id: 'dlc', name: 'DLC' }, { id: 'announcement', name: '宣发' }]
// Period anchors only order the nodes; the displayed date keeps its original precision.
function periodOrder(node: TimelineNode) {
  const [y, m, d] = node.date_value.split('-')
  const month = m?.startsWith('Q') ? (Number(m.slice(1)) - 1) * 3 + 1 : Number(m || 0)
  return Number(y) * 10000 + month * 100 + Number(d || 0)
}
const sorted = computed(() => [...(data.value?.timeline || [])].sort((a,b) => periodOrder(a)-periodOrder(b) || a.id-b.id))
const years = computed(() => [...new Set(sorted.value.map(n => n.date_value.slice(0,4)))])
const nodes = computed(() => sorted.value.filter(n => (!year.value || n.date_value.startsWith(year.value)) && (!kind.value || n.kind === kind.value)))
const groups = computed(() => [...new Set(nodes.value.map(n => n.date_value.slice(0,4)))].map(value => ({ year:value, nodes:nodes.value.filter(n => n.date_value.startsWith(value)) })))
const activeYear = computed(() => year.value || years.value[0] || '')
const heroNode = computed(() => sorted.value.find(n => isFuture(n)) || sorted.value.at(-1))
const heroArtwork = computed(() => heroNode.value ? artFor(heroNode.value) : undefined)
const relatedEvent = computed(() => data.value?.events.find(e => e.id === selected.value?.event_id))
const watchedGames = computed(() => data.value?.watched_games || [])
const datedGames = computed(() => new Set(sorted.value.map(node => node.game_name)))
const selectedIdentity = computed(() => watchedGames.value.find(game => game.name === selected.value?.game_name))
async function jumpToGame(name: string) {
  year.value = ''; kind.value = ''
  await nextTick()
  const node = sorted.value.find(item => item.game_name === name)
  if (node) document.getElementById(`moment-${node.id}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' })
}
function artFor(node: TimelineNode) { return artwork.value?.[node.game_name] }
function isFuture(node: TimelineNode) { return node.date_precision === 'day' && Boolean(today.value) && node.date_value >= today.value }
function shortDate(node: TimelineNode) {
  if(node.date_precision === 'year') return node.date_value
  if(node.date_precision === 'quarter') return node.date_value.slice(5)
  if(node.date_precision === 'month') return `${node.date_value.slice(5)} 月`
  return node.date_value.slice(5).replace('-', ' / ')
}
function dateTime(node: TimelineNode) { return node.date_precision === 'quarter' ? undefined : node.date_value }
async function openMoment(node: TimelineNode) { selected.value=node; await nextTick(); detailDialog.value?.showModal() }
function closeOnBackdrop(event: MouseEvent) { if(event.target === detailDialog.value) { const r=detailDialog.value.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) detailDialog.value.close() } }
function moveCard(event: PointerEvent) {
  if(event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const card=event.currentTarget as HTMLElement, r=card.getBoundingClientRect()
  card.style.setProperty('--rx', `${((event.clientY-r.top)/r.height-.5)*-3}deg`)
  card.style.setProperty('--ry', `${((event.clientX-r.left)/r.width-.5)*4}deg`)
}
function resetCard(event: PointerEvent) { const card=event.currentTarget as HTMLElement; card.style.removeProperty('--rx');card.style.removeProperty('--ry') }
function hideFailedImage(event: Event) { (event.target as HTMLImageElement).style.opacity='0' }
let observer: IntersectionObserver | undefined, frame=0
function handleResize() {
  const header=document.querySelector<HTMLElement>('.site-header')
  headerOffset.value=header && getComputedStyle(header).position === 'sticky' ? header.getBoundingClientRect().height : 0
  updateProgress()
}
function updateProgress() {
  if(frame) return
  frame=requestAnimationFrame(() => { const track=pageRoot.value?.querySelector('.chronicle-track');if(track){const r=track.getBoundingClientRect();progress.value=Math.min(1,Math.max(0,(innerHeight*.55-r.top)/r.height))}frame=0 })
}
async function observeMoments() {
  observer?.disconnect(); await nextTick()
  const moments=pageRoot.value?.querySelectorAll<HTMLElement>('[data-moment]')
  if(!moments) return
  if(!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches){visibleIds.value=new Set(nodes.value.map(n=>n.id));return}
  observer=new IntersectionObserver(entries=>{const ids=new Set(visibleIds.value);entries.forEach(entry=>{if(entry.isIntersecting){ids.add(Number((entry.target as HTMLElement).dataset.moment));observer?.unobserve(entry.target)}});visibleIds.value=ids},{threshold:.12})
  moments.forEach(element=>observer?.observe(element));motionReady.value=true;updateProgress()
}
onMounted(()=>{today.value=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Hong_Kong'}).format(new Date());handleResize();observeMoments();window.addEventListener('scroll',updateProgress,{passive:true});window.addEventListener('resize',handleResize,{passive:true})})
watch([year,kind],observeMoments)
onBeforeUnmount(()=>{observer?.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',updateProgress);window.removeEventListener('resize',handleResize)})
</script>

<style scoped>
:global(html:has(.chronicle)), :global(body:has(.chronicle)){overflow-x:clip}

.chronicle{--night:#11121a;--fog:#9c9cab;--lilac:#b6a5ff;--cream:#f1ecdf;--gold:#e6c887;position:relative;background:var(--night);color:var(--cream);overflow:clip;font-family:var(--sans);padding-bottom:1px}.chronicle a,.chronicle button{-webkit-tap-highlight-color:transparent}.chronicle button{font:inherit}.chronicle a:focus-visible,.chronicle button:focus-visible,.chronicle select:focus-visible{outline:2px solid var(--gold);outline-offset:6px}.chronicle-hero{position:relative;max-width:1600px;margin:auto;min-height:660px;display:grid;grid-template-columns:1.05fr 1fr;padding:95px clamp(24px,5.5vw,88px) 78px;isolation:isolate;border-bottom:1px solid #ffffff12}.hero-grid{position:absolute;inset:0;z-index:-1;background-image:linear-gradient(#ffffff04 1px,transparent 1px),linear-gradient(90deg,#ffffff04 1px,transparent 1px);background-size:80px 80px;mask-image:linear-gradient(to right,#000,transparent)}.hero-copy{position:relative;z-index:3}.chronicle-kicker{font:10px/1.7 var(--mono);letter-spacing:.15em;color:var(--lilac);margin:0 0 35px;display:flex;align-items:center;gap:10px}.chronicle-kicker>span{width:5px;height:5px;background:var(--lilac);box-shadow:0 0 15px var(--lilac)}.hero-copy h1{font:900 clamp(48px,5.5vw,83px)/1.26 var(--serif);letter-spacing:-.035em;margin:0}.hero-emphasis{color:var(--gold)}.hero-description{font-size:14px;line-height:2;color:#afacb8;margin:26px 0}.hero-enter{display:inline-flex;align-items:center;gap:35px;font-size:12px;color:var(--cream);padding:12px 0;border-bottom:1px solid #ffffff40}.hero-enter svg{animation:descend 2.5s ease-in-out infinite}.hero-stage{position:absolute;width:61%;right:0;top:0;height:100%;overflow:hidden;z-index:-1}.hero-image{width:100%;height:100%;object-fit:cover;opacity:.57;animation:hero-reveal 1.7s ease-out both;mask-image:linear-gradient(to right,transparent,#000 25%)}.hero-stage-shade{position:absolute;inset:0;background:linear-gradient(90deg,var(--night),transparent 65%),linear-gradient(0deg,var(--night),transparent 65%)}.hero-year{position:absolute;right:7%;top:5%;font:600 clamp(95px,13vw,200px)/1 var(--mono);letter-spacing:-.09em;color:transparent;-webkit-text-stroke:1px #f1ecdf26;z-index:2}.hero-caption{position:absolute;bottom:115px;right:9%;text-align:right;display:grid;gap:6px}.hero-caption>span{font:9px var(--mono);letter-spacing:.2em;color:var(--gold)}.hero-caption strong{font:700 25px var(--serif)}.hero-caption small{font:11px var(--mono);color:#cbc6d3}.hero-coordinate{position:absolute;right:9%;bottom:65px;font:8px var(--mono);letter-spacing:.16em;color:var(--fog)}.hero-orbit{position:absolute;left:-170px;top:-220px;width:860px;height:860px;z-index:-1;pointer-events:none}.hero-orbit>span{position:absolute;inset:0;border:1px solid #b6a5ff0b;border-radius:50%}.hero-orbit>span:nth-child(2){inset:60px}.hero-orbit>span:nth-child(3){inset:120px;border-style:dashed;animation:orbit 100s linear infinite}.hero-foot{position:absolute;left:clamp(24px,5.5vw,88px);right:clamp(24px,5.5vw,88px);bottom:24px;display:flex;gap:35px;align-items:center;color:var(--fog);font-size:10px;letter-spacing:.07em}.hero-foot>span:first-child{color:var(--cream)}.hero-foot>span:last-child{display:flex;gap:10px;align-items:center;margin-left:auto}.chronicle-body{max-width:1376px;margin:auto;padding:0 64px}.chronicle-controls{position:sticky;top:var(--header-offset,88px);z-index:20;padding:24px 0 20px;display:flex;align-items:center;gap:32px;background:#11121af2;backdrop-filter:blur(15px);border-bottom:1px solid #ffffff1a}.year-select{display:flex;align-items:center;gap:15px}.year-select>span{font:9px var(--mono);letter-spacing:.15em;color:var(--fog)}.year-select select{color:var(--cream);background:var(--night);border:0;font:500 20px var(--mono);max-width:160px;padding:4px 0}.kind-select{display:flex;gap:4px}.kind-select button{border:0;background:transparent;color:var(--fog);font-size:11px;padding:8px 14px;border-radius:2px;cursor:pointer}.kind-select button:hover{color:var(--cream)}.kind-select button.chosen{background:#b6a5ff18;color:var(--lilac)}.moment-count{font:10px var(--mono);color:var(--fog);margin-left:auto;white-space:nowrap}.chronicle-track{position:relative;padding-bottom:50px}.time-spine{position:absolute;left:50%;top:0;bottom:120px;width:1px;background:#b6a5ff26;pointer-events:none}.time-spine>div{position:absolute;inset:0 0 auto;width:1px;background:linear-gradient(var(--lilac),var(--gold));box-shadow:0 0 16px #b6a5ff77;transition:height .15s linear}.time-spine>span{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 39px,#d3c4ff55 39px,#d3c4ff55 40px);width:7px;left:-3px;opacity:.45}.chapter{position:relative}.chapter-heading{text-align:center;position:relative;padding:65px 0 60px;background:var(--night);z-index:2}.chapter-heading>span{font:9px var(--mono);color:var(--fog);letter-spacing:.3em}.chapter-heading h2{font:500 clamp(70px,9vw,115px)/1 var(--mono);letter-spacing:-.08em;margin:14px 0;color:var(--cream)}.chapter-heading p{font-size:11px;color:var(--fog);margin:15px 0 0}.moment{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 86px minmax(0,1fr);align-items:center;margin-bottom:65px;min-height:330px;scroll-margin-top:180px}.moment-axis{grid-column:2;grid-row:1;position:relative;height:100%;display:flex;align-items:center;justify-content:center}.axis-dot{width:7px;height:7px;border-radius:50%;background:var(--lilac);position:relative;z-index:2;box-shadow:0 0 18px #b6a5ff80}.axis-halo{position:absolute;width:31px;height:31px;border:1px solid #b6a5ff30;border-radius:50%;transition:transform .7s,border-color .7s}.axis-tick{position:absolute;height:1px;width:calc(50% - 16px);background:#b6a5ff45;right:0}.moment.alternate .axis-tick{right:auto;left:0}.future .axis-dot{background:var(--gold);box-shadow:0 0 20px #e6c88799}.future .axis-halo{border-color:#e6c88766}.moment:has(.work-card:hover) .axis-halo,.moment:has(.work-card:focus-visible) .axis-halo{transform:scale(1.5);border-color:var(--gold)}.moment-date{grid-column:1;grid-row:1;text-align:right;padding-right:28px}.alternate .moment-date{grid-column:3;text-align:left;padding-right:0;padding-left:28px}.date-chapter{display:block;font:8px var(--mono);letter-spacing:.2em;color:var(--fog);margin-bottom:13px}.moment-date time{display:block;font:400 clamp(38px,4.4vw,64px)/1.1 var(--mono);letter-spacing:-.07em;color:var(--cream)}.moment-date small{font-size:10px;display:block;margin-top:16px;color:var(--lilac)}.moment-date small>span{color:var(--fog);margin-left:6px}.moment-work{grid-column:3;grid-row:1;position:relative;min-width:0;z-index:3}.alternate .moment-work{grid-column:1}.work-card{position:relative;display:block;width:100%;aspect-ratio:1.52;border:1px solid #ffffff20;padding:0;overflow:hidden;text-align:left;background:#1e1e2d;color:var(--cream);cursor:pointer;transform:perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .55s cubic-bezier(.16,1,.3,1),box-shadow .55s,border-color .55s;box-shadow:0 15px 35px #00000030;isolation:isolate}.work-card:hover,.work-card:focus-visible{transform:perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateY(-8px) scale(1.035);border-color:#e6c88790;box-shadow:0 25px 70px #00000070,0 0 35px #b6a5ff12}.work-image{position:absolute;inset:0;z-index:-3;background:radial-gradient(ellipse at 65% 20%,#494057,transparent 70%),#25232e}.work-image img{width:100%;height:100%;object-fit:cover;opacity:.8;transition:transform 1.1s cubic-bezier(.16,1,.3,1),opacity .7s;transform:scale(1.015)}.work-card:hover .work-image img,.work-card:focus-visible .work-image img{transform:scale(1.105);opacity:1}.art-placeholder{position:absolute;top:15%;left:7%;right:7%;font:700 44px var(--serif);color:#ffffff15}.work-shade{position:absolute;inset:0;z-index:-2;background:linear-gradient(180deg,#11121a38,transparent 20%,#11121a24 35%,#11121aee 100%)}.work-grid{position:absolute;inset:0;z-index:-1;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.16' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.2;pointer-events:none}.work-topline{position:absolute;left:23px;right:23px;top:20px;display:flex;justify-content:space-between;gap:10px;align-items:center;font:9px var(--mono);letter-spacing:.1em;text-shadow:0 1px 8px #000}.work-number{font-size:11px;color:var(--gold)}.work-copy{position:absolute;bottom:24px;left:24px;right:24px}.work-english{font:8px var(--mono);letter-spacing:.13em;color:#c5c0d2;display:block;margin-bottom:8px}.work-copy h3{font:700 clamp(24px,2.8vw,36px)/1.35 var(--serif);letter-spacing:-.025em;margin:0 0 13px;color:#fff9ec}.work-bottom{display:flex;justify-content:space-between;align-items:center;gap:12px;color:#c5c0cf;font-size:11px}.work-open{width:33px;height:33px;border:1px solid #ffffff35;display:grid;place-items:center;border-radius:50%;transition:background .4s,color .4s,transform .4s}.work-card:hover .work-open{background:var(--gold);border-color:var(--gold);color:var(--night);transform:rotate(45deg)}.moment-meta{display:flex;align-items:center;justify-content:space-between;gap:14px;color:var(--fog);font-size:9px;margin-top:16px;line-height:1.7}.moment-meta>span:first-child{display:flex;align-items:center;gap:5px;color:#c4b7e8;white-space:nowrap}.moment-meta>span:nth-child(2){text-align:right}.moment-meta>button{display:inline-flex;align-items:center;gap:4px;white-space:nowrap;color:var(--fog);font-size:9px;background:transparent;border:0;padding:0;cursor:pointer}.motion-ready .moment:not(.visible) .moment-work{opacity:0;transform:translateY(45px)}.motion-ready .moment:not(.visible) .moment-date{opacity:0;transform:translateY(20px)}.moment-work{transition:opacity .9s ease,transform 1s cubic-bezier(.16,1,.3,1)}.moment-date{transition:opacity 1s ease .12s,transform 1s cubic-bezier(.16,1,.3,1) .12s}.chronicle-end{position:relative;text-align:center;padding:90px 0 50px;background:var(--night)}.end-dot{display:block;position:absolute;top:35px;left:calc(50% - 3px);width:7px;height:7px;background:var(--gold);border-radius:50%;box-shadow:0 0 25px #e6c88788}.chronicle-end p{font:700 28px var(--serif);margin:0 0 12px}.chronicle-end small{font-size:11px;color:var(--fog)}.chronicle-end a{display:flex;align-items:center;justify-content:center;gap:12px;color:var(--gold);font-size:11px;margin-top:30px}.chronicle-empty{position:relative;padding:130px 20px 160px;text-align:center;isolation:isolate}.chronicle-empty>svg{margin:auto;color:var(--gold)}.chronicle-empty h2{font:700 29px var(--serif)}.chronicle-empty p{color:var(--fog);font-size:13px}.chronicle-empty a,.chronicle-empty button{display:inline-flex;align-items:center;gap:10px;background:transparent;border:0;color:var(--lilac);font-size:12px;cursor:pointer;margin-top:18px}.empty-orbit{position:absolute;top:80px;left:calc(50% - 120px);width:240px;height:240px;border:1px dashed #b6a5ff20;border-radius:50%;z-index:-1;animation:orbit 80s linear infinite}.chapter-navigation{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:30;display:flex;align-items:center;gap:21px;background:#1b1a25eb;border:1px solid #b6a5ff30;padding:11px 19px;border-radius:3px;box-shadow:0 8px 40px #00000050;backdrop-filter:blur(16px);max-width:calc(100vw - 32px);overflow:auto}.chapter-navigation>span{font:12px var(--mono);color:var(--gold);padding-right:15px;border-right:1px solid #ffffff25}.chapter-navigation a{display:flex;align-items:center;gap:7px;font:9px var(--mono);color:#cbc4d7;white-space:nowrap}.chapter-navigation a>span{height:3px;width:3px;background:var(--lilac);border-radius:50%}.chapter-navigation a:hover{color:var(--gold)}.chapter-navigation .return-start{margin-left:auto}.chapter-navigation{scrollbar-width:none}.chapter-navigation::-webkit-scrollbar{display:none}.moment-dialog{position:fixed;max-width:780px;width:calc(100% - 36px);padding:0;border:1px solid #b6a5ff45;background:#181822;color:var(--cream);max-height:90vh;overflow:auto;box-shadow:0 25px 120px #000000a0}.moment-dialog::backdrop{background:#08080dcc;backdrop-filter:blur(9px)}.moment-dialog[open]{animation:dialog-in .35s cubic-bezier(.16,1,.3,1)}.dialog-close{position:absolute;top:16px;right:16px;width:36px;height:36px;z-index:5;display:grid;place-items:center;color:white;border:1px solid #ffffff50;background:#11121ac0;border-radius:50%;cursor:pointer}.dialog-art{height:280px;position:relative;overflow:hidden;background:#343040}.dialog-art img{width:100%;height:100%;object-fit:cover}.dialog-art:after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 45%,#181822)}.dialog-art>span{position:absolute;bottom:20px;left:35px;z-index:2;font:9px var(--mono);letter-spacing:.17em}.dialog-copy{padding:10px 35px 35px}.dialog-copy>.chronicle-kicker{margin-bottom:13px;font-size:9px}.dialog-copy h2{font:700 36px var(--serif);margin:0 0 10px}.dialog-copy>p:not(.chronicle-kicker){color:#c5bfd0;font-size:13px}.dialog-platform{display:flex;gap:10px;margin:20px 0}.dialog-platform>span{font-size:10px;border:1px solid #ffffff25;padding:4px 9px;color:#aaa4b9}.dialog-summary{line-height:1.9}.dialog-links{border-top:1px solid #ffffff18;display:flex;flex-wrap:wrap;gap:25px;padding-top:20px;margin-top:20px}.dialog-links a{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--gold)}.dialog-copy>small{display:block;color:var(--fog);font-size:10px;margin-top:25px}.chronicle :target{outline:0}.moment:target .axis-halo{border-color:var(--gold);transform:scale(1.3)}@keyframes descend{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}@keyframes orbit{to{transform:rotate(360deg)}}@keyframes hero-reveal{from{opacity:0;transform:scale(1.06)}to{opacity:.57;transform:scale(1)}}@keyframes dialog-in{from{opacity:0;transform:translateY(15px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@media(max-width:1100px){.chronicle-body{padding:0 32px}.moment{grid-template-columns:minmax(0,1fr) 68px minmax(0,1fr);min-height:290px}.work-card{aspect-ratio:1.3}.moment-meta{flex-wrap:wrap;gap:5px}.moment-meta>span:nth-child(2){flex:1}.moment-meta>button{display:none}.chapter-navigation{gap:14px}.chronicle-hero{min-height:590px}}
@media(max-width:760px){.chronicle-hero{min-height:690px;display:block;padding:55px 25px 85px}.hero-copy h1{font-size:53px}.chronicle-kicker{font-size:8px;margin-bottom:28px}.hero-description{font-size:12px}.hero-stage{top:0;width:100%;height:100%;opacity:.55}.hero-stage-shade{background:linear-gradient(90deg,#11121ac9,#11121a66),linear-gradient(0deg,var(--night),transparent 80%)}.hero-image{mask-image:none;object-position:62% center}.hero-year{font-size:110px;top:auto;bottom:83px;right:25px}.hero-caption{bottom:145px;right:25px}.hero-caption strong{font-size:22px}.hero-caption small{font-size:10px}.hero-coordinate{display:none}.hero-foot{left:25px;right:25px;gap:18px;font-size:9px}.hero-foot>span:nth-child(2){display:none}.hero-orbit{left:-350px;top:-200px}.chronicle-body{padding:0 23px}.chronicle-controls{padding:17px 0;gap:14px;flex-wrap:wrap}.year-select>span{font-size:8px}.year-select select{font-size:18px}.kind-select{order:3;flex-basis:100%}.kind-select button{flex:1;font-size:10px;padding:7px 6px}.moment-count{font-size:9px}.time-spine{left:8px}.chapter-heading{text-align:left;padding:45px 0 38px 35px;background:transparent}.chapter-heading>span{font-size:8px}.chapter-heading h2{font-size:77px;margin:12px 0}.chapter-heading p{font-size:10px}.moment,.moment.alternate{display:block;padding-left:36px;margin-bottom:52px;min-height:0;scroll-margin-top:240px}.moment-axis{position:absolute;left:1px;top:19px;width:15px;height:15px}.axis-halo{width:22px;height:22px}.axis-dot{width:5px;height:5px}.axis-tick,.moment.alternate .axis-tick{right:auto;left:18px;width:12px}.moment-date,.alternate .moment-date{text-align:left;padding:0;margin-bottom:18px}.date-chapter{font-size:7px;margin-bottom:8px}.moment-date time{font-size:37px}.moment-date small{font-size:9px;margin-top:9px}.work-card{aspect-ratio:1.22}.work-topline{left:17px;right:17px;top:15px;font-size:8px}.work-copy{bottom:19px;left:18px;right:18px}.work-copy h3{font-size:26px;margin-bottom:9px}.work-english{font-size:7px}.work-bottom{font-size:10px}.work-open{width:28px;height:28px}.moment-meta{font-size:8px;gap:8px;margin-top:12px}.moment-meta>span:nth-child(2){max-width:65%}.chronicle-end{text-align:left;padding:50px 0 50px 35px;background:var(--night)}.end-dot{left:5px;top:20px}.chronicle-end p{font-size:23px}.chronicle-end small{font-size:10px}.chronicle-end a{justify-content:flex-start;font-size:10px}.chapter-navigation{bottom:13px;padding:10px 13px;gap:17px}.chapter-navigation>span{font-size:10px}.chapter-navigation a{font-size:8px}.chapter-navigation a>span{display:none}.dialog-art{height:205px}.dialog-copy{padding:10px 23px 26px}.dialog-art>span{left:23px}.dialog-copy h2{font-size:29px}.dialog-copy>.chronicle-kicker{font-size:8px}.dialog-links{gap:18px}.chronicle-empty{padding:95px 10px 135px}.chronicle-empty h2{font-size:24px}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}.motion-ready .moment:not(.visible) .moment-work,.motion-ready .moment:not(.visible) .moment-date{opacity:1;transform:none}.work-card:hover,.work-card:focus-visible{transform:none}.work-card:hover .work-image img,.work-card:focus-visible .work-image img{transform:none}.time-spine>div{transition:none}}

.coverage-panel { padding: 28px 0; border-bottom: 1px solid #ffffff1a; color: var(--fog); }
.coverage-panel summary { display: flex; align-items: center; gap: 24px; cursor: pointer; font-size: 11px; list-style: none; }
.coverage-panel summary::-webkit-details-marker { display: none; }
.coverage-panel summary strong { color: var(--cream); font-weight: 500; }
.coverage-panel summary > span:last-child { margin-left: auto; color: var(--lilac); display: flex; gap: 6px; align-items: center; white-space: nowrap; }
.coverage-panel > p { font-size: 12px; line-height: 1.9; max-width: 780px; margin: 25px 0; }
.coverage-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding-bottom: 10px; }
.coverage-game { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 18px; border: 1px solid #ffffff18; background: #ffffff03; }
.coverage-game button, .coverage-game > strong { color: var(--cream); font: 600 15px var(--serif); text-align: left; background: none; border: 0; padding: 0; display: flex; gap: 5px; align-items: center; margin-bottom: 5px; }
.coverage-game button { cursor: pointer; }
.coverage-game button:hover { color: var(--gold); }
.coverage-game small { font-size: 10px; line-height: 1.6; }
.coverage-game > span { font-size: 10px; line-height: 1.6; margin-top: 3px; }
.coverage-game em { font-size: 9px; font-style: normal; color: var(--lilac); margin-top: auto; padding-top: 5px; }
.coverage-game a { display: flex; align-items: center; gap: 5px; color: var(--gold); font-size: 10px; }
.dialog-credits { display: grid; gap: 9px; font-size: 11px; margin: 20px 0; line-height: 1.7; }
.dialog-credits > div { display: grid; grid-template-columns: 60px minmax(0, 1fr); gap: 12px; }
.dialog-credits dt { color: var(--fog); }
.dialog-credits dd { margin: 0; color: #ded7e8; }
@media(max-width:760px) {
  .coverage-panel summary { flex-wrap: wrap; gap: 10px 15px; }
  .coverage-panel summary > strong { order: 3; width: 100%; font-size: 10px; }
  .coverage-panel > p { font-size: 11px; }
  .coverage-grid { grid-template-columns: 1fr; }
}
</style>
