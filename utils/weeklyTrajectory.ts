type RankedDay = { date: string; rank: number; actual_star?: boolean }

export function weeklyTrajectory(start: string, end: string, publishedDays: string[] | undefined, ranks: RankedDay[]) {
  const days = []
  const last = Date.parse(`${end}T00:00:00Z`)
  for (let time = Date.parse(`${start}T00:00:00Z`); time <= last; time += 86400000) {
    const date = new Date(time).toISOString().slice(0, 10)
    const ranked = ranks.find(item => item.date === date)
    days.push({ date, rank: ranked?.rank, star: Boolean(ranked?.actual_star),
      status: ranked ? "ranked" : publishedDays?.includes(date) ? "outside" : "unknown" })
  }
  return days
}
