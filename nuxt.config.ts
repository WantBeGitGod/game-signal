import { existsSync, readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const dataRoot = resolve(process.cwd(), "public", "data")
const manifestPath = resolve(dataRoot, "manifest.json")
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf-8"))
  : { issues: [] }
const issueRoutes = (manifest.issues || []).map((date: string) => `/issues/${date}`)
const weeklyManifestPath = resolve(dataRoot, "weekly", "manifest.json")
const weeklyManifest = existsSync(weeklyManifestPath)
  ? JSON.parse(readFileSync(weeklyManifestPath, "utf-8"))
  : { issues: [] }
const weeklyRoutes = (weeklyManifest.issues || []).map((issue: { slug: string }) => `/weekly/${issue.slug}`)
const gamesRoot = resolve(dataRoot, "games")
const gameRoutes = existsSync(gamesRoot)
  ? readdirSync(gamesRoot)
      .filter(file => file.endsWith(".json"))
      .map(file => `/games/${file.replace(/\.json$/, "")}`)
  : []

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: false },
  experimental: {
    appManifest: false
  },
  modules: ["@nuxt/content"],
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      htmlAttrs: { lang: "zh-CN" },
      titleTemplate: "%s · Game Signal",
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Noto+Sans+SC:wght@400;500;700;900&family=Noto+Serif+SC:wght@700;900&display=swap" }
      ],
      meta: [
        { name: "description", content: "从 Steam 异动中寻找值得发行人继续追问的游戏信号。" },
        { name: "theme-color", content: "#171713" }
      ]
    }
  },
  content: {
    highlight: false,
    documentDriven: false
  },
  runtimeConfig: {
    public: {
      preview: process.env.NUXT_PUBLIC_PREVIEW !== "false"
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        "/",
        "/weekly",
        "/issues",
        "/cases",
        "/companies",
        "/methodology",
        "/system",
        "/author",
        ...weeklyRoutes,
        ...issueRoutes,
        ...gameRoutes
      ]
    }
  },
  routeRules: {
    "/**": { prerender: true }
  }
})
