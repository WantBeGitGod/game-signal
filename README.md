# Game Signal public site

Public Nuxt 3 site for the Game Signal publication.

- The repository contains only reviewed content, static public data and owned/generated visual assets.
- Raw databases, scraper code, credentials, browser profiles and draft research remain private.
- Preview deployments use `noindex` until the formal launch gate is met.

## Development

```powershell
npm install
npm run dev
npm run typecheck
npm run generate
```

The private production pipeline writes public data under `public/data/` and approved cases under `content/`. Case exports carry a resolved `cover_image_url`, normally reusing the canonical game's Steam preview image, so the case index and article page share one visual identity.

## Information architecture

The header navigation stays focused on public proof-of-work browsing:

- 周刊
- 今日之星
- 案例
- 团队

Methodology, production system and author links remain in the footer so the first scan keeps attention on published work instead of meta pages.

## Commercial access reservation

The current site does not include login, payment or entitlement checks. It only reserves the content boundary:

- public weekly issues and daily `今日之星` remain free;
- reviewed cases can declare `access: free | members | paid | embargo`;
- `available_at` can support member early access or delayed public unlocks;
- detailed game/team data must stay out of `public/data` until a real server-side access layer exists.

## Public contract

- [Data contract](docs/data-contract.md)
- [Signal method](docs/signal-method.md)

## GitHub Pages activation

1. Connect this folder to the public GitHub repository.
2. Enable Pages with GitHub Actions as the source.
3. Keep `NUXT_PUBLIC_PREVIEW=true` until the formal launch gate is met.
4. Update `NUXT_APP_BASE_URL` in `.github/workflows/deploy-pages.yml` if the repository name changes.

The deploy job only runs after a successful static build, so a failed build does not replace the last valid Pages deployment.
