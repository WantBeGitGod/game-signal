# Frontend design and rollback

## Homepage and navigation

The September 2026 frontend uses a warm paper background, forest green accents, serif display headings and restrained data typography. The shared visual system applies to daily issues, weekly issues and charts, articles, game archives, teams and informational pages.

Homepage order:

1. Latest published daily star: game name, positioning, artwork and supporting metrics.
2. Complete two-minute quick take: reference frame, core loop, player fit and selection reason. Positioning is already visible in the cover and is not repeated. If a historical issue lacks a quick take, the page shows the existing description and a clear pending label.
3. Data/source and Steam links.
4. Three recent daily issues and a full-width archive action on mobile.
5. Two recent article previews, the article index and weekly index links.
6. Collection status and footer.

The home page reads the existing public manifest and quick-take schema. It does not generate or change editorial judgments, scores, historical facts or access controls. Daily issue detail pages retain their data, sources and complete quick take.

Primary navigation: 今日 (homepage), 周刊, 往日之星, 文章, 游戏档案, 团队. Author, methodology and system links remain available. Existing URLs and legacy article redirects are retained.

## Local review

```powershell
Set-Location <site-repo>
npm run dev -- --host 127.0.0.1 --port 3100
```

Open http://127.0.0.1:3100. Stop the development server before running `npm run generate`; Nuxt prevents these processes from sharing its build directory. This design branch is a local review deliverable; creating the branch and tags does not deploy the website.

## Git backup and rollback

Run these commands from your local public-site repository. Replace `<site-repo>` with its checkout directory.

- Original frontend: annotated tag `frontend-before-redesign-20260906`, commit `eac6278`.
- Design branch: `codex/frontend-redesign-20260906`.
- Completed redesign: annotated tag `frontend-redesign-20260906`.

To undo the design while preserving later content commits, start from a clean working tree and create a normal revert commit:

```powershell
Set-Location <site-repo>
git status --short
git revert frontend-redesign-20260906
npm run generate
```

If later edits touch the same frontend lines, Git may request conflict resolution. Do not use `reset --hard` to discard intervening publications or other work.

To inspect the original frontend independently without changing the active checkout:

```powershell
git worktree add --detach ../game-signal-original-preview frontend-before-redesign-20260906
```

The original code, styles and assets are retained in the tag. The worktree needs its own dependencies before running. Git rollback alone changes local source; an already deployed site still requires its normal deployment procedure.
