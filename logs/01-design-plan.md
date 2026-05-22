# Фаза 2 — Дизайн (dispensed)

**Статус:** ✓ closed (dispensed by user on 2026-05-22)
**Причина dispensation:** скилл `prototype` подгружен после фазы. Артефакты дизайн-плана уже существуют в `docs/oss-prototype/spec/`.

## Где артефакты

- `docs/oss-prototype/spec/README.md` — навигация, hard rules, источники истины
- `docs/oss-prototype/spec/scenario.md` — нарратив сценария по-человечески
- `docs/oss-prototype/spec/00-common.md` — общая логика, state machine
- `docs/oss-prototype/spec/01-preparation.md` ... `05-completion.md` — пять модулей по экранам
- `docs/oss-prototype/spec/shared/data-model.md` — модель `Meeting`, enum'ы
- `docs/oss-prototype/spec/shared/components.md` — глобальные компоненты (header, footer, stepper, etc.)
- `docs/oss-prototype/spec/shared/patterns.md` — модалки, popovers, валидация, toast
- `docs/oss-prototype/design/refs/` — 17 скриншотов от Figma
- `docs/oss-prototype/design/src/` — токены, иконки, лого
- `_temporary/text-diff.md` — авторитативные замены dummy-копирайта для экранов 01–04

## Покрытие компонентной базы

Дизайн-план перекрывает компонент-libу из `knowledge/prototyping/component-library.md`. Все компоненты из спеки уже задокументированы в `shared/components.md` + `shared/patterns.md` — никаких новых компонентов сверх компонент-libы не вводилось.

## Гейт пройден

- **Дата:** 2026-05-22 (retroactively)
- **Источник:** dispensed by user
- **Замечания:** работа сделана до активации регламента; спека и токены готовы для фазы 3
- **Что переходит в следующую фазу:** вся `docs/oss-prototype/spec/` + `design/`
