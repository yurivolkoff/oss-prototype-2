# Фаза 3 — Разработка (in progress)

**Статус:** ⏳ in progress

## Iteration 1 — 2026-05-22 (Phase 0 — Infrastructure)

### Decisions

- Стек согласно `docs/oss-prototype/spec/00-common.md`: Vite 5 + React 18 + TypeScript 5 + Tailwind v3 + Zustand + React Router DOM + sonner + lucide-react + date-fns + clsx.
- Тесты: vitest + @testing-library/react + happy-dom.
- Deploy: GitHub Actions → GitHub Pages, base path `/oss-prototype-2/`.

### Dispensations (отступления от плана)

- **`@import` → `<link rel="stylesheet">` для tokens.css.** Vite/postcss-import пытался резолвить абсолютный путь `/oss-prototype-2/tokens.css` против файловой системы и падал. Заменено на `<link>` в `index.html` — тот же эффект, токены доступны как CSS-переменные.

### Bugs caught/fixed

- Git Bash на Windows перехватывал leading `/` в `gh api /repos/...` и превращал в `C:/Program Files/Git/repos/...`. Использовали без leading slash.

### Артефакты

- Live: https://yurivolkoff.github.io/oss-prototype-2/
- Repo: https://github.com/yurivolkoff/oss-prototype-2
- 8 коммитов в `main` (от scaffold до deploy workflow)

## Iteration 2 — 2026-05-22 (Phase 1 Bundle A — foundation core)

### Что сделано

Tasks 1–6 из плана `docs/oss-prototype/plans/2026-05-22-phase-1-foundation.md`:

1. Test framework setup (vitest + RTL)
2. TypeScript types из `data-model.md`
3. cn() utility + parseDemoState() с TDD-покрытием
4. initialState() для демо-данных + format helpers
5. Zustand `meetingStore` с TDD-покрытием
6. Router + DashboardPlaceholder + FoundationDemo stub

### Decisions

- TodoWrite в `package.json.scripts` добавил `test` + `test:watch`.
- В `tsconfig.app.json` merged `types: ["vite/client", "vitest/globals", "@testing-library/jest-dom"]` (не overwrite — сохранили существующий `vite/client`).

### Тесты

- 8 unit-тестов проходят: 4 на `parseDemoState`, 4 на `meetingStore`.
- Build: `✓ built in 688ms`, 27 modules.

## Iteration 3 — 2026-05-22 (Phase 1 Bundle B — layout + stepper + UI primitives)

### Что сделано

Tasks 7–13 из плана:

7. Layout: TopPromoBar, AppHeader, AddressBar, Footer
8. BackLink + AppLayout wrapper
9. Stepper (6 шагов, 3 состояния)
10. StepPills (mini wizard chips)
11. Card, Button, IconButton, Pill
12. KeyValueRow, InfoBlock, WarningBanner, StatusRow
13. Accordion

### Тесты

- 8 unit-тестов всё ещё проходят (никаких регрессий).
- Build: clean, bundle 265 KB / CSS 10.28 KB.
- Deploy: workflow run 26283822006 — green за 34 сек.

### Замечания

- Tailwind classes используются для layout, inline `style` — для token-цветов через CSS-переменные. Это компромисс: чистый Tailwind не позволяет dynamic var() без extends в config, а `style` даёт прозрачность.
- CI annotations про deprecation Node.js 20 — косметика, июнь 2026 cutoff.

## Iteration 4 — 2026-05-22 (Phase 1 Bundle C — toast + forms) — pending

_Будет заполнено по факту выполнения._

## Iteration 5 — 2026-05-22 (Phase 1 Bundle D — modals + popover + demo + verify) — pending

_Будет заполнено по факту выполнения._
