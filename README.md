# OSS Prototype 2

Кликабельный прототип администратора ОСС в ГИС ЖКХ 3.0 (Phase 0+).

**Live:** https://yurivolkoff.github.io/oss-prototype-2/

## Стек

- Vite + React + TypeScript
- Tailwind CSS v3
- zustand, react-router-dom, lucide-react, sonner, date-fns, clsx

## Разработка

```bash
nvm use            # Node 20 (см. .nvmrc)
npm install
npm run dev        # http://localhost:5173/oss-prototype-2/
npm run build      # сборка в dist/
npm run preview    # локальный предпросмотр сборки
```

## Деплой

GitHub Actions деплоит `main` на GitHub Pages автоматически
(`.github/workflows/deploy.yml`).

## Структура

- `public/tokens.css` — дизайн-токены (из `docs/oss-prototype/design/src/tokens/`)
- `public/icons/` — 46 SVG-иконок дизайн-системы
- `public/logos/` — логотипы Госуслуг.Дом, ГИС ЖКХ, партнёров
- `src/` — приложение

## Генерируемый контент

См. `GENERATED-CONTENT.md` — реестр всего, что добавлено сверх спецификации.
