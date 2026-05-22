# Icons

45 SVG-иконок, экспортированы из Figma — частично из OSS прототипа (`3I9rvjjF03ZBtkQAMYjqKe`), частично из UI Kit Components (`dWB935qPnZhEGuiVgVUd3Q`). Все stroke 1.5, используют `currentColor` где возможно, размеры 16/18/24 px.

## Полный список

### Status (8) — индикаторы состояния

| Файл | Вариант | Назначение |
|---|---|---|
| `24-status-ok.svg` | stroke | Зелёная галочка — successful state |
| `24-status-ok-color-bg.svg` + `24-status-ok-color-check.svg` | color (composed) | Заполненный success badge |
| `24-status-error.svg` | stroke | Красный крестик — error state |
| `24-status-error-color-bg.svg` + `24-status-error-color-x.svg` | color (composed) | Заполненный error badge |
| `24-status-information.svg` | stroke | Info `(i)` icon |
| `24-status-information-color-bg.svg` + `24-status-information-color-i.svg` | color (composed) | Filled info badge |
| `18-info-ok-stroke.svg` | 18px | Small success indicator |

> Color варианты — два path'а: фон (circle) + symbol (check/cross/i). Накладывай их друг на друга в SVG-композиции, или используй stroke-варианты как fallback.

### Navigation (5)

| Файл | Назначение |
|---|---|
| `24-navigation-arrow-right.svg` | Action-row → "далее" |
| `24-navigation-chevron-up.svg` | Accordion expanded |
| `24-navigation-chevron-down.svg` | Accordion collapsed, dropdowns |
| `24-navigation-chevron-right.svg` | Breadcrumbs, action-row |
| `24-navigation-chevron-left.svg` | BackLink |

### Actions (9)

| Файл | Назначение |
|---|---|
| `24-actions-close.svg` | **Unified close X** — используй этот, не half-1/half-2 |
| `24-actions-close-large-half-1.svg` + `24-actions-close-large-half-2.svg` | Альтернатива (2 path'а) |
| `24-actions-download.svg` | "скачать ⬇" |
| `24-actions-attachment.svg` | "Выбрать файл 📎" |
| `24-actions-attachment-link.svg` | Документ-чип |
| `24-actions-copy.svg` | "Дубль" indicator |
| `24-actions-mail.svg` | Email |
| `24-actions-call.svg` | Phone |
| `24-actions-sign-out.svg` | Header user menu |
| `24-actions-book.svg` | Address book |

### Entity (5)

| Файл | Назначение |
|---|---|
| `24-entity-door.svg` | Подъезд / помещение |
| `24-entity-user.svg` | "👤 проголосовало" |
| `24-entity-time-large.svg` | "осталось N дней" (clock) |
| `24-entity-history.svg` | История ОСС |
| `24-entity-internet.svg` | Globe |

### Editor (2)

| Файл | Назначение |
|---|---|
| `24-editor-edit.svg` | "Редактировать" (карандаш) |
| `24-editor-trash.svg` | Удалить |

### Tech (1)

| Файл | Назначение |
|---|---|
| `24-tech-print.svg` | "Распечатать бюллетени" |

### Social (7) — для footer и "Скачать приложение"

| Файл | Назначение |
|---|---|
| `24-social-vkontakte.svg` | Footer |
| `24-social-odnoklassniki.svg` | Footer |
| `24-social-telegram.svg` | Footer |
| `24-social-apple.svg` | "Скачать приложение" (App Store) |
| `24-social-googleplay.svg` | "Скачать приложение" (Google Play) |
| `24-social-gd-favicon.svg` | Favicon Госуслуги.Дом |
| `24-social-smart-home.svg` | Smart Home category icon |

### Other (4)

| Файл | Назначение |
|---|---|
| `16-actions-visually-impaired.svg` | Иконка для "Версия для слабовидящих" в TopPromoBar |
| `arrow-down.svg` | Dropdown indicator (32px frame, повёрнутый chevron) |
| `link-arrow.svg` | Inline-link arrow "↗" |
| `search.svg` | Header search |

## Чего ещё нет (если понадобится — экспортируй из Figma)

- Info-stroke в размерах **12, 16, 20** px (есть только 18 и 24).
- Chevron в размерах **16** px (есть только 24).
- Иконки **Document Edit**, **Bullet**, **List Bullets**, **Text Align** — есть в UI Kit (страница Icon & logo), не выгружены.
- Логотип «Госуслуги Дом» (текстовый, для шапки) — **в Figma он собран из 9 vector-path'ов, не как один SVG**. Используй `src/logos/gosuslugi-dom.png` или собери через CSS из текста.

## Как использовать

```jsx
import SignOutIcon from './24-actions-sign-out.svg';

<img src={SignOutIcon} alt="Sign out" width={24} height={24} />

// или через SVGR (для React-компонентов):
// import { ReactComponent as SignOutIcon } from './24-actions-sign-out.svg';
// <SignOutIcon width={24} height={24} className="text-action-primary" />
```

Большинство иконок используют `currentColor` — крась через CSS `color: var(--color-action-primary)`.

## Конвенции именования

`<size>-<category>-<name>.svg`. Категории: `actions`, `entity`, `navigation`, `social`, `status`, `editor`, `tech`, `info`.
