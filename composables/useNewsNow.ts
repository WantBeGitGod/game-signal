// Re-evaluate the recent window after hydration, including on static Pages builds.
export function useNewsNow() {
  const clock = useState('news-now', () => Date.now())
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    clock.value = Date.now()
    timer = setInterval(() => { clock.value = Date.now() }, 60_000)
  })
  onUnmounted(() => { if (timer) clearInterval(timer) })
  return clock
}
