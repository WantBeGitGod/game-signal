# Signal method

Game Signal identifies unusual Steam movements with deterministic rules, then uses human research to explain selected cases.

## Published signal types

- **突然爆发**: the latest observed peak rises sharply against the previous observed record.
- **新作起量**: a recently released game reaches meaningful observed activity.
- **老游戏回归**: an older game returns without a detected recent content or discount event.
- **内容更新回归**: an older game returns alongside recent chapter, DLC, expansion, season or major-update news.
- **折扣回流**: an older game returns alongside recent sale, discount or free-weekend news.
- **口碑与热度背离**: meaningful activity appears despite a comparatively weak review ratio.
- **持续增长**: observed daily peaks rise for at least three consecutive observation days.

## Ranking

The score combines observed peak scale, positive change, observation depth and a rule-specific bonus. Fixed input produces fixed ordering; ties are resolved by game name. AI-generated hypotheses never alter the ranking.

The current public weight snapshot is exported to `public/data/scoring.json`. Games outside the configured 30-day new-release window are checked against recent Steam news. Chapter, DLC, expansion, season and major-update evidence is scored close to a new release; sale and discount evidence receives a lower signal score plus an additional final-score multiplier.

Repeated daily-star wins in the previous 30 days reduce final score through deterministic multipliers, and a game that already has 3 wins inside that rolling window is excluded until an earlier win ages out. The public homepage also shows each star's all-time `摘星次数`.

For public Chinese-language pages, verified Chinese titles are preferred for display. This does not change ranking identity: appid and canonical aliases remain the source of truth for repeat-window debt.

## Editorial boundary

The daily issue publishes one verifiable `今日之星`. Weekly issues keep five observed signals, but only two become deep-reading slots by default; the remaining three stay in the watch table with lighter context and full curves. A weekly case adds source-backed interpretation, transferable publishing lessons and concrete next actions after human review. Cases receive a 30-day follow-up.
