# Решения, принятые без юзера

Юрий AFK во время реализации Phase 2. Все нетривиальные решения зафиксированы здесь для последующего ревью.

## [2026-05-23 — Module 1] meeting.step1Completed как отдельный флаг

**Вопрос:** Как степпер должен показывать «шаг 1 пройден» когда пользователь уже в модуле 2 (повестка), но `meeting.state` всё ещё `draft_preparation`?

**Принятое решение:** добавлен флаг `step1Completed: boolean` в Meeting type. Set'ится в true после клика «Продолжить» на экране 03. Stepper в MeetingFlow читает этот флаг + subState для корректного отображения статусов шагов.

**Аргумент:** альтернатива — переключать `meeting.state` между sub-стейтами — ломает state-machine (state логически остаётся «черновик подготовки», пока не нажата «Отправить» на 12). Отдельный флаг чище.

**Статус ревью:** awaiting.

## [2026-05-23 — Foundation F5] e2e shell с одним assertion

**Вопрос:** Что класть в `tests/e2e.mjs` на этапе foundation, когда Dashboard ещё placeholder?

**Принятое решение:** scaffold с одним assertion (hero-карточка), который заведомо упадёт на foundation deploy, но станет зелёным после M1.1. Не запускали e2e в foundation phase.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 2] «Ремонт крыши» vs «Ремонт кровли»

**Вопрос:** Спека и текст вопросов 2.x говорят «Капитальный ремонт кровли» в финальных формулировках. Но в справочнике на экране 07 (выбор темы) — link-row «Ремонт крыши» (спека 02-agenda.md § Шаг 2.3, верхний пример link-rows).

**Принятое решение:** в AgendaWizardTheme link-row именован «Ремонт крыши» (по верхней версии спеки). После клика state блока становится `themeTitle: 'Капитальный ремонт кровли'` (как в createBlock2()). Таким образом UI справочника и финальные формулировки расходятся семантически но идентичны юридически (крыша = кровля).

**Статус ревью:** awaiting. Если Юрий захочет — поменять link-row на «Ремонт кровли» для согласованности (1 строчка).

## [2026-05-23 — Module 2] AgendaBlockCard: разнесение accordion-button и InfoPopover

**Вопрос:** Изначальная реализация AgendaBlockCard ставила InfoPopover (button) внутрь header-button accordion'а. React 19 ругается «button cannot be a descendant of button».

**Принятое решение:** заголовок-блок переделан в `<div>` с отдельным toggle-button (chevron справа). Кликабельная зона ограничена chevron'ом — но это приемлемо для прототипа. Остальной заголовок не открывает блок при клике (только chevron).

**Статус ревью:** awaiting. Альтернатива — портал для popover'а, но это overkill.

## [2026-05-23 — Module 2] StrictMode double-invoke автодобавления block 1

**Вопрос:** AgendaMain автодобавляет block-1 в useEffect. React 19 StrictMode инициализирует эффект дважды → block-1 добавляется дважды → дубликат key.

**Принятое решение:** добавлен `useRef(false)` флаг + `useMeetingStore.getState()` для немутируемого чтения текущей повестки. Идемпотентность обеспечена.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 2] Редактирование блока 1 vs блока 2 из AgendaMain

**Вопрос:** Ghost-link «Редактировать блок» должен куда-то вести. Для блока 2 — экран 08 с предзаполненным state. Для блока 1 — нет полноценного UI редактирования (вопросы disabled).

**Принятое решение:** для блока 1 — toast «Редактирование блока 1 ограничено в этом MVP». Для блока 2 — переход на agenda_wizard_questions; при «Сохранить» там перед addAgendaBlock делается removeAgendaBlock('block-2'), чтобы не было дубликата.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 2] Дата срока работ — 2026-12-31

**Вопрос:** Спека пишет дефолт «31.12.2025», но сейчас 2026-05-23 — прошлое.

**Принятое решение:** дефолт сдвинут на 2026-12-31. createBlock2() и AgendaWizardQuestions используют 2026-12-31. Это согласовано с другими демо-данными (текст-диффы со сметами/датами на 2026).

**Статус ревью:** awaiting.

## [2026-05-23 — Module 1 e2e] BASE_URL для dev server

**Вопрос:** На какой URL ходить e2e? `127.0.0.1:5173` (плановый) занят. Vite поднялся на 5174 и принимает только `localhost`, не `127.0.0.1`.

**Принятое решение:** запустил e2e с явным `BASE_URL=http://localhost:5174/oss-prototype-2`. Запомнить: дефолт в `tests/e2e.mjs` (`127.0.0.1:5173`) может потребовать override на dev-машине, если порт занят.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 3] Stepper для notification_published — step 3 как completed

**Вопрос:** В исходном MeetingFlow.tsx `notification_published` → `activeIdx = 2` (step 3 active). Но по логике после публикации step 3 должен быть `completed`, а step 4 (Voting) — `active`.

**Принятое решение:** изменил mapping в `stepperSteps()` на `notification_published: 3`. После публикации MeetingFlow в основном не показывается (есть navigate('/')), но защитный кейс «вернулся на /oss/:id» — стрипка будет корректной.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 3] Вступительное слово сначала отрабатывает onBlur только при не-пустом значении

**Вопрос:** Спека говорит «при tab-away с < 100 символами» показывать helper. Но если пользователь только что зашёл и сразу таб-наут, нулевое значение, это тоже срабатывает — мешает.

**Принятое решение:** onBlur показывает error только если `length > 0 && length < 100`. При клике «Продолжить» с пустым полем валидация всё равно сработает.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 3] e2e — assert «вернулся на дашборд» проверяет URL endsWith oss-prototype-2 (с/без слеша)

**Вопрос:** После `navigate('/')` (внутри BrowserRouter с basename `/oss-prototype-2`), URL становится `http://localhost:5175/oss-prototype-2` (без trailing slash в Vite dev).

**Принятое решение:** assert принимает оба варианта (со слешом и без), также regex с возможной строкой запроса.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 3] Dropdown «Редактировать» — inline-реализация, не отдельный компонент

**Вопрос:** В дизайн-системе нет dropdown-примитива. Спека требует dropdown с 3 пунктами под кнопкой «Редактировать» на превью.

**Принятое решение:** inline-dropdown внутри NotificationPreview.tsx (absolute-positioned div + click-outside hook). Не выделял в общий примитив — это единственное место использования в текущих модулях.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 3] Документ-chip в превью — один файл (Смета)

**Вопрос:** Какие документы рендерить в превью? Спека упоминает «chip'ы загруженных файлов».

**Принятое решение:** рендерю один статический chip «Смета на капитальный ремонт кровли.pdf». Договор и др. опциональные документы вшиты в Module 2 как File-объекты внутри AgendaWizardQuestions.tsx (не сохраняются в meeting.voting.materials). Если позже Юрий захочет — сделать сбор файлов из всех блоков повестки в materials и рендерить динамически.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 4] Демо-распределение голосов через детерминированный seed по номеру квартиры

**Вопрос:** Как получить шахматку из ~100 квартир со статусами «онлайн / бумажный / отказ / не определился», когда state хранит только paperBallots[]? Нужна стабильность между ререндерами и между ранней/поздней фазой.

**Принятое решение:** функция `buildVotingMap(meeting)` в `src/lib/votingDistribution.ts`. Фиксированные множества: pink (отказ) — 14, 22, 78; beige (бумажный) early — 17, 33; beige late — 17, 33, 26, 30. Первые 21 квартиры в возрастающем порядке номеров (исключая pink/beige) — green. Остальные — white. Зарегистрированные через M1 paperBallots переопределяют детерминированную мапу (white → beige live в той же сессии).

**Аргумент:** в state-machine трудно сохранять «кто что выбрал». Демо ≠ продакшен. Карта строится один раз через useMemo от meeting.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 4] `_demoVariant` маркер для разделения voting_active / voting_active_low_quorum

**Вопрос:** Оба варианта имеют `meeting.state === 'voting_active'`, но screen 14 отличается от 13 наличием WarningBanner. Как UI поймёт, какой вариант показывать?

**Принятое решение:** optional поле `_demoVariant: DemoState | null` в типе Meeting. Set'ится в `hydrateDemoState` для variants voting_active и voting_active_low_quorum. VotingActive.tsx читает это поле.

**Альтернативы:** проверять `daysLeft < 10`, но это хрупко (зависит от Date.now()) и плохо тестируется. Маркер чище.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 4] СНИЛС/паспорт не сохраняются в store при registerPaperBallot

**Вопрос:** Спека говорит «СНИЛС и паспорт НЕ сохраняются в state — стираются при закрытии модалки». Но `PaperBallot` тип уже имеет поля ownerSnils, ownerPassport.

**Принятое решение:** при вызове `registerPaperBallot` из M1 — передаём пустые строки в эти поля. Локальный state модалки хранит реальные значения только до закрытия. После закрытия модалки они сбрасываются вместе с остальным локальным state (`useEffect` на premise change).

**Статус ревью:** awaiting. Альтернатива — убрать поля из типа вообще, но это сломает читаемость PaperBallot как domain-сущности.

## [2026-05-23 — Module 4] DemoStateHydrator на изменение URL

**Вопрос:** Прежний `useEffect([])` в App.tsx срабатывал только на mount. Для e2e и live-переключения между демо-стейтами нужно реагировать на каждую смену query.

**Принятое решение:** вынес хидратацию в компонент `DemoStateHydrator`, использующий `useLocation().search` как dependency. Слушает все смены URL.

**Статус ревью:** awaiting. Сайд-эффект: navigation между обычными страницами без demo-state — store не трогается; ничего не сломалось.

## [2026-05-23 — Module 5] FakeFile вместо реальных File для preloaded документов

**Вопрос:** Как пред-заполнить FileCard «Договор.pdf / 0.89 МБ» и «Акт.pdf / 0.69 МБ», если в state.workInfo.contract/act тип `File | null`, а реальные файлы взять негде в демо?

**Принятое решение:** в `WorkInfoForm.tsx` локально используем тип `FakeFile { name; sizeBytes }` для UI-нужд. В store `publishWorkInfo` шлётся без `contract`/`act` (упрощение MVP — реальный upload не моделируем; protocolUrl уже placeholder).

**Альтернатива:** изменить тип workInfo на `File | FakeFile | null` — но это раздувает domain-модель ради демо-задачи.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 5] valid date-input без своего DatePicker

**Вопрос:** Спека требует date-inputs (01.09.2026, 30.10.2026), а у нас нет своего DatePicker-компонента.

**Принятое решение:** нативный `<input type="date">` через существующий TextInput primitive. Значения хранятся в ISO (`2026-09-01`), браузер показывает локализованно. Валидация «дата окончания не раньше начала» работает через `new Date()` сравнение.

**Альтернатива:** написать свой DatePicker — out of scope.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 5] Демо-документы блока 2 в ResultBlock — hardcoded

**Вопрос:** Спека упоминает «chip'ы загруженных файлов (Смета.pdf, Договор.pdf если был) + link скачать всё» в подсекции «Документы» блока 2. Откуда брать список файлов в state?

**Принятое решение:** ResultBlock рендерит hardcoded chip «Смета.pdf / 1.2 МБ» когда `block.type === 'capital_repair'`. Договор.pdf не рендерится в этом блоке — он живёт в WorkInfoForm. Клик по chip = toast.

**Аргумент:** state не хранит per-block materials в нужном формате; добавлять структуру ради демо-чипа — overkill.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 5] HistoryTable строка для archived собрания

**Вопрос:** Спека говорит «в таблице История ОСС появляется новая строка после archive». Менять глобальный массив ROWS или динамически добавлять?

**Принятое решение:** ROWS остаются static (2 демо-строки). Если `meeting.state === 'archived'`, добавляем третью строку из текущего store-snapshot. status pill: success «Решение принято» (quorumReached=true) или error «Не состоялось» (false). После `reset()` или нового собрания строка исчезнет — это OK для прототипа.

**Статус ревью:** awaiting.

## [2026-05-23 — Module 5] Финальная модалка confirm — кнопка «Разместить» (не «Подтвердить»)

**Вопрос:** Стандартный ConfirmModal.confirmLabel='Подтвердить'. Спека требует «Разместить» / «Отмена».

**Принятое решение:** прокидываем `confirmLabel="Разместить"` явно в `<ConfirmModal>` в WorkInfoForm. Это уже поддерживалось примитивом.

**Статус ревью:** awaiting.

## [2026-05-23 — FIN.1] Read-only мод — info-плашка + disable-inputs + hide-CTAs

**Вопрос:** Как реализовать read-only режим для экранов 01-12 после `voting_completed`? Варианты — отдельная страница / wrapper-компонент / readOnly-prop в каждом экране.

**Принятое решение:** добавлен optional `readOnly?: boolean` prop в 4 компонента (PreparationOverview, PreparationPremises, AgendaMain, NotificationForm). Каждый отвечает за свой UX:
- info-плашка `<ReadOnlyBanner />` (новый компонент) сверху по спеке `05-completion.md`;
- все form-инпуты получают `disabled={readOnly}`;
- primary CTA (Верно далее / Продолжить / Сохранить / Добавить блок вопрос) и secondary buttons (Изменить в профиле, Редактировать повестку) — скрыты через `{!readOnly && (...)}`;
- AgendaMain useEffect auto-add block-1 — пропускается в readOnly, чтобы не мутировать архивный state.

`MeetingFlow.tsx` решает, нужен ли readOnly: helper `isReadOnlyForStage(stage, meeting)` сравнивает stage с `stateStageIndex(meeting.state)`. Stepper-step с `status='completed'` и существующим маппингом получает onClick, переключающий subState — это даёт URL-агностичный путь в read-only.

**Альтернативы:**
- Отдельная страница `<ArchivedMeetingView />` — больше дублирования.
- Глобальный `<fieldset disabled>` wrapper — не покрывает custom-CTAs.
- Отдельный wrapper `<ReadOnlyWrapper>` вокруг существующих компонентов — ломает scrollIntoView / refs / inline state.

**Файлы изменены (7):** ReadOnlyBanner.tsx (new), MeetingFlow.tsx, PreparationOverview.tsx, PreparationPremises.tsx, AgendaMain.tsx, NotificationForm.tsx, FileCard.tsx (onRemove → optional).

**Статус ревью:** awaiting.

## [2026-05-23 — FIN.1] FileCard.onRemove → optional

**Вопрос:** В read-only NotificationForm видео-FileCard не должен показывать X-кнопку удаления.

**Принятое решение:** `onRemove` в `FileCardProps` сделано optional. При `undefined` X-кнопка не рендерится. Все существующие вызовы (WorkInfoForm preloaded contract/act, NotificationForm video) продолжают работать.

**Статус ревью:** awaiting.

## [2026-05-23 — FIN.1] Stepper-clicks только на shapes 1/2/3

**Вопрос:** Какие шаги степпера кликабельны в read-only? Все completed?

**Принятое решение:** только step 1 (preparation), step 2 (agenda_main), step 3 (notification_form). Steps 4–6 не имеют отдельных «прошлых» экранов для модулей 1–4 — voting/completion имеют свои экраны (VotingActive/VotingCompleted/WorkInfoForm). Степпер показывает их как `completed` (если архив), но без onClick — клик не делает ничего.

**Статус ревью:** awaiting. Альтернатива — сделать step 4 (Сбор голосов) кликабельным и показывать VotingCompleted; но это переиспользует экран модуля 5 для шага 4 степпера, что путает.
