export type TimedPoint = { datetime: string; players: number; average_players?: number }

// Existing exports use Singapore local wall time; explicit offsets are respected.
export function pointTime(value: string): number {
  const iso = value.replace(" ", "T")
  return Date.parse(/[zZ]$|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}+08:00`)
}

export function windowPoints<T extends TimedPoint>(points: T[], start?: string, end?: string): T[] {
  return points.filter(point => Number.isFinite(pointTime(point.datetime)) &&
    (!start || point.datetime.slice(0, 10) >= start) && (!end || point.datetime.slice(0, 10) <= end))
    .slice().sort((a, b) => pointTime(a.datetime) - pointTime(b.datetime))
}

export function chartCoordinates<T extends TimedPoint>(points: T[], left: number, right: number, top: number, bottom: number, yMax: number) {
  const first = points.length ? pointTime(points[0].datetime) : 0
  const last = points.length ? pointTime(points[points.length - 1].datetime) : first
  return points.map(point => ({ ...point,
    x: last === first ? (left + right) / 2 : left + (pointTime(point.datetime) - first) / (last - first) * (right - left),
    y: bottom - point.players / yMax * (bottom - top)
  }))
}

export function chartSegments<T extends TimedPoint>(points: T[], maxGapMinutes = 90): T[][] {
  const segments: T[][] = []
  for (const point of points) {
    const segment = segments[segments.length - 1]
    if (!segment || pointTime(point.datetime) - pointTime(segment[segment.length - 1].datetime) > maxGapMinutes * 60000) segments.push([point])
    else segment.push(point)
  }
  return segments
}
