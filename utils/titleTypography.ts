/** Display-only spacing: keep title punctuation attached to its neighbouring word. */
export function formatWeeklyTitle(title: string): string {
  return title.trim().replace(/\s+/gu, " ")
    .replace(/ +([™®!?,.:;，。！？、：；）】》])/gu, "\u00a0$1")
    .replace(/([（【《]) +/gu, "$1\u00a0")
    .replace(/ +([&+–—-]) +/gu, "\u00a0$1\u00a0")
    .replace(/([\p{L}\p{N}])([-‐])(?=[\p{L}\p{N}])/gu, "$1\u2060$2\u2060")
}
