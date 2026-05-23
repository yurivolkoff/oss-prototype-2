/**
 * End-to-end smoke for OSS Prototype.
 * Coverage built progressively as modules land.
 *
 * Usage:
 *   npm run dev               (terminal 1)
 *   npm run e2e               (terminal 2)
 *
 *   BASE_URL=https://yurivolkoff.github.io/oss-prototype-2 npm run e2e   (live)
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5173/oss-prototype-2'
const OUT = resolve('test-output')
mkdirSync(OUT, { recursive: true })

const results = []
let failures = 0

function record(name, ok, note = '') {
  results.push({ name, ok, note })
  if (!ok) failures++
  console.log(`${ok ? '✓' : '✗'} ${name}${note ? ` — ${note}` : ''}`)
}

async function expect(cond, name, note = '') {
  record(name, !!cond, note)
}

async function shot(page, name) {
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: true })
}

async function main() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 900, height: 1200 },
    locale: 'ru-RU',
  })
  const page = await context.newPage()
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`))

  // ─── Module 1 — Dashboard renders ─────────────────────────────────
  await page.goto(BASE_URL + '/')
  await page.waitForLoadState('networkidle')
  await shot(page, '01-dashboard')

  await expect(
    await page.getByRole('heading', { name: /Общее собрание собственников/i }).first().isVisible(),
    '1.1 — hero-карточка на дашборде'
  )

  // ─── Module 1 — full happy path ──────────────────────────────────
  await page.getByRole('button', { name: 'Начать собрание' }).click()
  await page.waitForURL(/\/oss\//)
  await page.waitForLoadState('networkidle')
  await shot(page, '02-preparation-overview')
  await expect(
    await page.getByRole('heading', { name: 'Подготовка данных по дому 1/2' }).isVisible(),
    '1.2 — screen 02 рендерится'
  )

  await page.getByRole('button', { name: 'Верно, далее' }).click()
  await page.waitForTimeout(300)
  await shot(page, '03-premises-grid')
  await expect(
    await page.getByRole('heading', { name: 'Подготовка данных по дому 2/2' }).isVisible(),
    '1.3 — screen 03 рендерится'
  )

  // Filter test: click «дубль» chip
  await page.getByTestId('chip-duplicate').click()
  await page.waitForTimeout(200)
  await shot(page, '03-premises-filter-dubl')

  // Reset filter, then click on apartment №15 (error tile)
  await page.getByTestId('chip-duplicate').click()
  await page.waitForTimeout(150)
  await page.getByTestId('premise-tile-15').click()
  await page.waitForTimeout(300)
  await shot(page, '04-apartment-modal')
  await expect(
    await page.getByRole('dialog').isVisible(),
    '1.4 — модалка квартиры открывается'
  )

  // Close modal via Esc
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
  await expect(
    !(await page.getByRole('dialog').isVisible()),
    '1.5 — Esc закрывает модалку'
  )

  // Continue from screen 03 — should advance to module 2 (agenda main, screen 05)
  await page.getByRole('button', { name: 'Продолжить' }).click()
  await page.waitForTimeout(300)
  await shot(page, '05-agenda-main-block1')

  // ─── Module 2 — agenda construction ─────────────────────────────
  await expect(
    await page.getByRole('heading', { name: 'Повестка собрания' }).isVisible(),
    '2.1 — screen 05 рендерится (Повестка собрания)'
  )
  await expect(
    (await page.getByText('Организация общего собрания').count()) >= 1,
    '2.2 — блок 1 «Организация общего собрания» предзаполнен'
  )

  // Click "Добавить блок вопрос"
  await page.getByRole('button', { name: 'Добавить блок вопрос' }).click()
  await page.waitForTimeout(300)
  await shot(page, '06-wizard-type')
  await expect(
    await page.getByRole('heading', { name: 'Новый блок вопросов' }).isVisible(),
    '2.3 — screen 06 wizard type рендерится'
  )

  // Click "Капитальный ремонт" category row
  await page.getByText('Капитальный ремонт', { exact: true }).first().click()
  await page.waitForTimeout(300)
  await shot(page, '07-wizard-theme')
  await expect(
    (await page.getByText('Справочник вопросов').count()) >= 1,
    '2.4 — screen 07 wizard theme рендерится'
  )

  // Click "Ремонт крыши" (interactive theme — the "works" section is open by default)
  await page.getByText('Ремонт крыши', { exact: true }).click()
  await page.waitForTimeout(300)
  await shot(page, '08-wizard-questions')
  await expect(
    (await page.getByText('Выберите вопросы и заполните параметры').count()) >= 1,
    '2.5 — screen 08 wizard questions рендерится'
  )

  // Save block
  await page.getByRole('button', { name: 'Сохранить' }).click()
  await page.waitForTimeout(400)
  await shot(page, '09-agenda-final')
  await expect(
    (await page.getByText('Капитальный ремонт кровли').count()) >= 1,
    '2.6 — блок 2 «Капитальный ремонт кровли» добавлен в повестку'
  )

  // Click "Продолжить" — should navigate to module 3 (notification form)
  await page.getByRole('button', { name: 'Продолжить' }).click()
  await page.waitForTimeout(300)
  await shot(page, '10-after-agenda-continue')

  // ─── Module 3 — notification ────────────────────────────────────
  // continuation from module 2 «Продолжить» click; subState now 'notification_form'
  await page.waitForTimeout(300)
  await shot(page, '10-notification-form')
  await expect(
    await page.getByLabel(/Место и срок приёма письменных решений/).isVisible(),
    '3.1 — поле «место приёма» переименовано'
  )

  // Fill required: вступительное слово (≥100 chars)
  const intro = 'Уважаемые соседи! В нашем доме нужно решить вопрос о капитальном ремонте кровли. Голосование займёт 60 дней, пожалуйста, не пропустите его.'
  await page.getByLabel(/Вступительное слово/).fill(intro)

  await page.getByRole('button', { name: 'Продолжить' }).click()
  await page.waitForTimeout(300)
  await shot(page, '12-notification-preview')
  await expect(
    await page.getByRole('heading', { name: 'Подтверждение голосования' }).isVisible(),
    '3.2 — screen 12 рендерится'
  )

  await page.getByRole('button', { name: 'Отправить' }).click()
  await page.waitForTimeout(300)
  await shot(page, '12-publish-confirm')
  await expect(
    await page.getByText('Опубликовать уведомление?').isVisible(),
    '3.3 — финальная модалка confirm открывается'
  )

  // Cancel + reopen + confirm
  await page.getByRole('button', { name: 'Отмена' }).click()
  await page.waitForTimeout(200)
  await page.getByRole('button', { name: 'Отправить' }).click()
  await page.waitForTimeout(200)
  await page.getByRole('button', { name: 'Опубликовать' }).click()
  await page.waitForTimeout(500)
  await page.waitForLoadState('networkidle')
  await shot(page, '01-dashboard-after-publish')
  const finalUrl = await page.url()
  await expect(
    finalUrl.endsWith('/oss-prototype-2/') ||
      finalUrl.endsWith('/oss-prototype-2') ||
      /\/oss-prototype-2\/?(\?|$)/.test(finalUrl),
    '3.4 — возврат на дашборд после публикации',
    finalUrl,
  )

  // ─── Module 4 — voting active ────────────────────────────────────
  // Demo-state jump: ?demo-state=voting_active opens directly on screen 13
  await page.goto(BASE_URL + '/oss/demo?demo-state=voting_active')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(400)
  await shot(page, '13-voting-active')
  await expect(
    await page.getByRole('heading', { name: 'Активное голосование' }).isVisible(),
    '4.1 — screen 13 rendered via demo-state'
  )

  // Verify progress bar shows ~21%
  await expect(
    (await page.getByText(/21\s*%/).count()) >= 1,
    '4.2 — прогресс-бар показывает 21%'
  )

  // White tile click — opens M1 paper-ballot modal showing СНИЛС field
  // Pick a known white tile (apt №25 — beyond the first 21 green slots, not in pink/beige seed sets)
  await page.getByTestId('voting-tile-25').click()
  await page.waitForTimeout(300)
  await shot(page, '13-paper-ballot-modal')
  await expect(
    (await page.getByText(/СНИЛС/i).count()) >= 1,
    '4.3a — М1 paper-ballot модалка содержит СНИЛС'
  )
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)

  // Low quorum variant
  await page.goto(BASE_URL + '/oss/demo?demo-state=voting_active_low_quorum')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(400)
  await shot(page, '14-voting-low-quorum')
  await expect(
    (await page.getByText(/Голосование может не состояться/).count()) >= 1,
    '4.3 — warning-banner на screen 14'
  )
  await expect(
    (await page.getByText(/24\s*%/).count()) >= 1,
    '4.4 — прогресс-бар показывает 24%'
  )

  // ─── Module 5 — completion: success path ─────────────────────────
  await page.goto(BASE_URL + '/oss/demo?demo-state=voting_completed')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(400)
  await shot(page, '15-voting-completed')
  await expect(
    (await page.getByText('кворум набран').count()) >= 1,
    '5.1 — pill «кворум набран» на витрине результатов'
  )

  // Verify ResultBlock pills
  await expect(
    (await page.getByText('решение принято').count()) >= 1,
    '5.2 — pill «решение принято» виден'
  )

  // Move to work-info form
  await page.getByRole('button', { name: 'Перейти к размещению информации' }).click()
  await page.waitForTimeout(300)
  await shot(page, '16-work-info-form')
  await expect(
    await page.getByRole('heading', { name: 'Размещение информации' }).isVisible(),
    '5.3 — screen 16 рендерится'
  )

  // Verify InfoBlock with КоАП
  await expect(
    (await page.getByText(/13\.19\.2\s*КоАП/).count()) >= 1,
    '5.4 — InfoBlock со штрафами КоАП 13.19.2 виден'
  )

  // Click «Разместить информацию»
  await page.getByRole('button', { name: 'Разместить информацию' }).click()
  await page.waitForTimeout(200)
  await page.getByRole('button', { name: 'Разместить', exact: true }).click()  // confirm modal
  await page.waitForTimeout(500)
  await page.waitForLoadState('networkidle')
  await shot(page, '01-dashboard-after-archive')

  // ─── Module 5 — no quorum variant ────────────────────────────────
  await page.goto(BASE_URL + '/oss/demo?demo-state=voting_completed_no_quorum')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(400)
  await shot(page, '15-no-quorum')
  await expect(
    (await page.getByText('кворум не набран').count()) >= 1,
    '5.5 — pill «кворум не набран» на варианте несостоявшегося'
  )

  // ─── FINAL ─────────────────────────────────────────────────────────
  console.log('\n──────────────────────────')
  console.log(`Passed: ${results.filter((r) => r.ok).length}/${results.length}`)
  if (failures > 0) console.log(`FAILED: ${failures}`)
  console.log(`Console errors: ${consoleErrors.length}`)
  if (consoleErrors.length > 0) console.log(consoleErrors.slice(0, 10).join('\n'))

  writeFileSync(
    resolve(OUT, 'e2e-results.json'),
    JSON.stringify({ results, consoleErrors }, null, 2),
    'utf-8'
  )

  await browser.close()
  process.exit(failures === 0 && consoleErrors.length === 0 ? 0 : 1)
}

main().catch((err) => { console.error(err); process.exit(2); })
