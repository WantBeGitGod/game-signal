import test from "node:test"
import assert from "node:assert/strict"
import { filterArticles, selectHomeArticles } from "../utils/homeArticles.ts"

test("home picks prioritize editor-selected published articles and never expose drafts", () => {
  const articles = [
    { slug: "latest", status: "published", created_at: "2026-10-12" },
    { slug: "draft", status: "draft", featured: true, created_at: "2026-10-13" },
    { slug: "picked", status: "published", featured: true, created_at: "2026-09-07" },
  ]
  assert.deepEqual(selectHomeArticles(articles).map(article => article.slug), ["picked", "latest"])
  assert.deepEqual(articles.map(article => article.slug), ["latest", "draft", "picked"])
})

test("republished time orders picks while legacy articles keep their original chronology", () => {
  const articles = [
    { slug: "old-pick", status: "published", featured: true, created_at: "2026-09-07" },
    { slug: "updated-pick", status: "published", featured: true, created_at: "2026-08-01", republished_at: "2026-10-12" },
    { slug: "legacy", status: "published", published_at: "2026-10-10" },
  ]
  assert.deepEqual(selectHomeArticles(articles, 3).map(article => article.slug), ["updated-pick", "old-pick", "legacy"])
})

test("a string flag does not accidentally grant a featured label", () => {
  const articles = [
    { slug: "typed", status: "published", featured: true, created_at: "2026-09-01" },
    { slug: "mistyped", status: "published", featured: "true", created_at: "2026-10-12" },
  ]
  assert.equal(selectHomeArticles(articles)[0].slug, "typed")
})

test("featured filter selects only published boolean picks and toggling off restores list order", () => {
  const articles = [
    { slug: "ordinary", status: "published" },
    { slug: "pick", status: "published", featured: true },
    { slug: "draft", status: "draft", featured: true },
    { slug: "mistyped", status: "published", featured: "true" },
  ]
  assert.deepEqual(filterArticles(articles, true).map(article => article.slug), ["pick"])
  assert.deepEqual(filterArticles(articles, false).map(article => article.slug), ["ordinary", "pick", "mistyped"])
  assert.equal(articles.length, 4)
  assert.deepEqual(filterArticles([{ status: "published" }], true), [])
})
