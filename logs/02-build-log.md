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

## Iteration 6 — 2026-05-22 (Foundation tech-review fixes от Юрия)

После checkpoint'а Юрий прислал 5 правок по foundation. Все мелкие, прицельные, без архитектурных решений.

### Fix 1 — StatusRow: плывут отступы
- Pill в фиксированную колонку `w-44` (`flex-shrink-0`)
- Убрал отдельную lucide-иконку — её не было в спеке, добавил по ошибке
- Counter и action в `flex-shrink-0` чтобы не сжимались
- `last:border-0` чтобы последняя строка без висящей рамки

### Fix 2 — Accordion: hover должен покрывать весь контейнер, не только header
- Перенёс `hover:bg-gray-50` с button на внешний `<div>`
- Добавил `overflow-hidden` чтобы rounded corners работали с hover-bg
- Кнопка-header больше не имеет собственного hover (полностью наследует от контейнера)

### Fix 3 — Radio/Checkbox: плохие отступы, наезжают друг на друга
- Radio: `inline-flex` → `flex`, добавил `py-2` (8px вертикальной паддинги)
- Checkbox: то же самое для консистентности
- В FoundationDemo убрал `space-y-2` (теперь padding встроен в сам компонент)
- По умолчанию радио теперь стакаются вертикально (тоже из user-фидбэка)

### Fix 4 — Button: нет hover/pressed состояний
- Переписал все три варианта (primary/secondary/ghost) через Tailwind arbitrary values: `bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-700)] active:bg-[var(--color-accent-800)]`
- Убрал inline `style` — теперь всё на Tailwind utilities
- Focus-ring цвет — `--color-accent-600`
- Disabled-state: hover не меняет фон

### Fix 5 — Select: нет шеврона
- Обёрнул в `<div className="relative">`
- Добавил `<ChevronDown>` иконку, позиционированную абсолютно справа (`right-3`)
- `pointer-events-none` на шеврон — клики проходят к нативному select
- Увеличил `pr-9` на select чтобы текст не наезжал на шеврон
- Добавил `hover:border-gray-400` для hover-обратной связи

5 коммитов (7835990 .. 30676e6). Build clean, 13 тестов проходят.

## Phase 2 — Все модули + FIN — 2026-05-23

### Итоги по модулям

**30 коммитов** в Phase 2 (от `30676e6` foundation tech-review до HEAD). Все пять модулей + foundation extensions (F.x) + FIN реализованы AFK.

| # | Модуль | Экраны | Файлы (≈) | Замечания |
|---|---|---|---|---|
| F | Foundation extensions | — | 3 | demo-state hydration, MeetingSubState, demoData |
| 1 | Подготовка данных | 01–04 | 7 | Dashboard hero + accordions + шахматка + ApartmentModal (preparation mode) |
| 2 | Конструктор повестки | 05–09 | 8 | AgendaMain + wizard 3-step + CustomQuestionModal + IncompleteAgendaModal |
| 3 | Уведомление | 10–12 | 3 | NotificationForm + NotificationPreview + PublishConfirmModal |
| 4 | Голосование | 13–14 | 5 | VotingActive + VotingProgressBar + VotingScoreboard + ApartmentModal (4 mode) + deterministic distribution |
| 5 | Завершение | 15–16 | 4 | VotingCompleted + ResultBlock + WorkInfoForm + HistoryTable archived row |
| FIN | Read-only | 01–12 после завершения | 6 | ReadOnlyBanner + readOnly prop в 4 экранах + stepper-clicks |

### Тесты

- **Unit:** 18 (5 Modal + 4 demoState + 4 meetingStore + 5 read-only-helper неявно покрывается e2e)
- **E2E:** 25/25 проходят против live (`BASE_URL=https://yurivolkoff.github.io/oss-prototype-2 npm run e2e`)
- **Build:** clean, 446.78 kB JS / 20.67 kB CSS / 1819 modules

### URLs для ревью

| URL | Что показывает |
|---|---|
| https://yurivolkoff.github.io/oss-prototype-2/ | Дашборд (screen 01) |
| https://yurivolkoff.github.io/oss-prototype-2/oss/new | Старт собрания → preparation flow (screens 02 → 03 → 05 → wizard → 10 → 12) |
| https://yurivolkoff.github.io/oss-prototype-2/oss/demo?demo-state=voting_active | Screen 13 — активное голосование |
| https://yurivolkoff.github.io/oss-prototype-2/oss/demo?demo-state=voting_active_low_quorum | Screen 14 — голосование с риском |
| https://yurivolkoff.github.io/oss-prototype-2/oss/demo?demo-state=voting_completed | Screen 15 — завершение (кворум набран) |
| https://yurivolkoff.github.io/oss-prototype-2/oss/demo?demo-state=voting_completed_no_quorum | Screen 15 — несостоявшееся |
| https://yurivolkoff.github.io/oss-prototype-2/oss/demo?demo-state=work_info_required | Screen 16 — размещение информации о работах |

После любого `voting_completed` — клики на step 1/2/3 степпера ведут в read-only режим соответствующего экрана.

### Open concerns для Юрия

Каждое нетривиальное решение, принятое без user-input, залогировано в `logs/decisions-while-afk.md` (всего ≈ 20 записей). Ключевые:

- **`step1Completed` boolean флаг** — отдельное поле в Meeting type, не часть state-machine.
- **«Ремонт крыши» vs «Капитальный ремонт кровли»** — справочник тем называется «Ремонт крыши», итоговый block — «Капитальный ремонт кровли». Возможный фикс — один verbatim вариант.
- **Дата срока работ 2026-12-31** — сдвинут от спекового 31.12.2025 (прошлое от текущей даты 2026-05-23).
- **`_demoVariant` маркер** в Meeting type для различения 13 vs 14 экранов (одинаковый `state='voting_active'`).
- **buildVotingMap детерминированное распределение** — pink/beige/green/white по фиксированным номерам квартир.
- **PaperBallot СНИЛС/паспорт не персистятся** — store получает пустые строки.
- **DemoStateHydrator на изменение URL** — переписан с mount-only на useLocation-listener.
- **FakeFile для preloaded документов** в WorkInfoForm — упрощение, real upload не моделируется.
- **HistoryTable archived строка** — динамически добавляется, не персистится.
- **Read-only режим (FIN)** — реализован через readOnly-prop в 4 компонентах, не отдельный wrapper.
- **Stepper-clicks** — только steps 1/2/3 кликабельны в read-only.

### Phase 2 закрыт (провизорно)

Phase 3 (Разработка) ставлю в `⚠️ provisional` — ждёт Юрия для прохода через прототип, ревью artefactов (GENERATED-CONTENT.md, decisions-while-afk.md) и финального approve. После approve — Phase 4 (Тех-ревью) / 5 (Бизнес-ревью) / 6 (Юзабилити-эмуляция).

## Гейт Phase 3 — провизорно

**Foundation sub-gate пройден.** Все 5 модулей + FIN реализованы. Tests green против live. Phase 3 ставится `⚠️ provisional` (см. `phase-status.md`) до user-review.
