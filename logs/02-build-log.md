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

## Iteration 4 — 2026-05-22 (Phase 1 Bundle C — toast + forms)

Tasks 14–17 готовы:
- `showComingSoon()` helper
- `FormField`, `TextInput`, `Textarea` (с counter)
- `Select`, `Checkbox`, `Radio`, `RadioActionRow`
- `FileUploadArea`, `FileCard`

4 коммита, тесты по-прежнему 8 проходят, build clean.

## Iteration 5 — 2026-05-22 (Phase 1 Bundle D — modals + popover + demo + verify)

Tasks 18–22 готовы:
- `Modal` базовый (focus-trap, esc, overlay click, close-X) — **+5 TDD-тестов**
- `ConfirmModal` (default focus на secondary «Отмена»)
- `InfoPopover` (click trigger + esc/outside close)
- `FoundationDemo` страница — витрина всех primitives
- 404.html fallback для SPA-маршрутизации на GitHub Pages

5 коммитов. Тесты: **13 всего** (5 Modal + 4 demoState + 4 meetingStore). Build: 298 kB JS, 13.2 kB CSS. Deploy green.

### Decisions

- **404.html через postbuild copy.** Vite не умеет это нативно для SPA на GH Pages. Простейший фикс — `cp dist/index.html dist/404.html` в build-скрипте. Юзер ходит по `/foundation-demo` через client-side routing с дашборда, никогда не приходит туда по прямому URL — поэтому HTTP-status 404 (с правильным телом) на cold-load приемлем.
- **Button onClick wrap.** TypeScript ругался при передаче `onClick={showComingSoon}` напрямую — MouseEvent попадал бы в первый аргумент `label`. Обернул в `() => showComingSoon()`.

### Phase 1 (foundation) — закрыта

Все foundation-компоненты готовы. URL для проверки: https://yurivolkoff.github.io/oss-prototype-2/foundation-demo

Готовность к Phase 2 (модули 1–5):
- ✓ TypeScript-типы из data-model.md
- ✓ Zustand store с reset()
- ✓ Router + 2 страницы
- ✓ Layout (хедер, футер, степпер, address bar)
- ✓ Все UI primitives (Card, Button, Pill, KeyValueRow, InfoBlock, WarningBanner, StatusRow, Accordion)
- ✓ Все form-компоненты (FormField, TextInput, Textarea, Select, Checkbox, Radio, RadioActionRow, FileUploadArea, FileCard)
- ✓ Модалки (Modal, ConfirmModal)
- ✓ InfoPopover
- ✓ Toast helper
- ✓ 13 unit-тестов проходят

Следующая итерация (Phase 2 — модули) — отдельный план.

## Phase 2 — Модули 1–5 (pending)

_Будет заполнено по факту выполнения._

## Гейт Phase 3 — провизорно

**Foundation sub-gate пройден** (модули ещё впереди). Полное закрытие фазы 3 — после реализации всех 5 модулей.
