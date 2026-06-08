# Signal method

Game Signal identifies unusual Steam movements with deterministic rules, then uses human research to explain selected cases.

## Published signal types

- **突然爆发**: the latest observed peak rises sharply against the previous observed day.
- **新作起量**: a recently released game reaches meaningful observed activity.
- **老游戏回归**: a previously observed game returns after a long gap.
- **口碑与热度背离**: meaningful activity appears despite a comparatively weak review ratio.
- **持续增长**: observed daily peaks rise for at least three consecutive observation days.

## Ranking

The score combines observed peak scale, positive change, observation depth and a rule-specific bonus. Fixed input produces fixed ordering; ties are resolved by game name. AI-generated hypotheses never alter the ranking.

The current public weight snapshot is exported to `public/data/scoring.json`. Games outside the configured 30-day new-release window and the previous date's `今日之星` receive a discount only on the player-count contribution. Growth, review-heat mismatch, release-window value and signal-type bonuses are not discounted, so the rule can still surface a persistent breakout when it remains unusually strong after the scale adjustment.

## Editorial boundary

The daily issue publishes one verifiable `今日之星`. Weekly issues keep five observed signals, but only two become deep-reading slots by default; the remaining three stay in the watch table with lighter context and full curves. A weekly case adds source-backed interpretation, transferable publishing lessons and concrete next actions after human review. Cases receive a 30-day follow-up.
