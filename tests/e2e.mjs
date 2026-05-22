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

  // Continue from screen 03 — should advance to module 2 placeholder
  await page.getByRole('button', { name: 'Продолжить' }).click()
  await page.waitForTimeout(200)
  await shot(page, '05-after-continue')

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
