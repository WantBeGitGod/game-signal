export function filterArticles<T extends Record<string, unknown>>(articles: T[], featuredOnly = false): T[] {
  return articles.filter(article => article.status === "published" && (!featuredOnly || article.featured === true))
}

export function selectHomeArticles<T extends Record<string, unknown>>(articles: T[], limit = 2): T[] {
  const date = (article: T) => String(article.republished_at || article.published_at || article.created_at || "")
  return filterArticles(articles)
    .sort((a, b) => Number(b.featured === true) - Number(a.featured === true) || date(b).localeCompare(date(a)))
    .slice(0, limit)
}
