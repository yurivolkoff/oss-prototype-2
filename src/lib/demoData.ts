import type { Premise, AgendaBlock } from '../types/meeting'

const FIRST_NAMES_M = ['Иван', 'Сергей', 'Алексей', 'Дмитрий', 'Андрей', 'Михаил', 'Николай', 'Владимир']
const FIRST_NAMES_F = ['Ольга', 'Анна', 'Татьяна', 'Елена', 'Мария', 'Светлана', 'Наталья', 'Ирина']
const MIDDLE_NAMES_M = ['Иванович', 'Сергеевич', 'Александрович', 'Петрович', 'Николаевич']
const MIDDLE_NAMES_F = ['Ивановна', 'Сергеевна', 'Александровна', 'Петровна', 'Николаевна']
const SURNAMES = ['Соколов', 'Морозов', 'Кузнецов', 'Лебедев', 'Новиков', 'Орлов', 'Семёнов', 'Васильев']

function nameAt(idx: number): string {
  const isF = idx % 3 === 1
  const surname = SURNAMES[idx % SURNAMES.length] + (isF ? 'а' : '')
  const first = isF ? FIRST_NAMES_F[idx % FIRST_NAMES_F.length] : FIRST_NAMES_M[idx % FIRST_NAMES_M.length]
  const middle = isF ? MIDDLE_NAMES_F[idx % MIDDLE_NAMES_F.length] : MIDDLE_NAMES_M[idx % MIDDLE_NAMES_M.length]
  return `${surname} ${first} ${middle}`
}

/**
 * Generate 30 apartments + 5 non-residential premises.
 * Layout: 3 entrances × 4 floors × ~2-3 apartments per floor.
 * Status mix: 4 with `no_cadastral` error, 2 with `wrong_area` warning, 1 duplicate, rest ok.
 * Apartments №15 (entrance 6/floor 4, but we use entrance 2) carries the error-state for screen 04 demo.
 */
export function generatePremises(): Premise[] {
  const apartments: Premise[] = []
  let aptNum = 1

  for (let entrance = 1; entrance <= 3; entrance++) {
    for (let floor = 1; floor <= 4; floor++) {
      const onFloor = floor === 1 ? 2 : 3 // 2 on first, 3 on upper
      for (let p = 0; p < onFloor; p++) {
        const baseArea = 35 + ((aptNum * 7) % 50) // 35–84 м², deterministic
        const isProblem15 = aptNum === 15
        const isProblem25 = aptNum === 25
        const isProblem30 = aptNum === 30
        const isWarn22 = aptNum === 22
        const isDup12 = aptNum === 12

        const status: Premise['status'] = isProblem15 || isProblem25 || isProblem30 || isDup12
          ? 'error'
          : isWarn22
            ? 'warning'
            : 'ok'

        const issues: Premise['issues'] = []
        if (isProblem15 || isProblem25 || isProblem30) issues.push('no_cadastral')
        if (isWarn22) issues.push('wrong_area')
        if (isDup12) issues.push('duplicate')

        const ownersCount = aptNum % 4 === 0 ? 2 : 1
        const owners: Premise['owners'] = Array.from({ length: ownersCount }, (_, i) => ({
          fullName: nameAt(aptNum * 7 + i),
          email: `owner${aptNum}${i ? '-2' : ''}@example.ru`,
          phone: `+7 921 ${100 + aptNum}-${10 + i}-${20 + i}`,
          ownedArea: +(baseArea / ownersCount).toFixed(2),
          ownershipShare: ownersCount === 1 ? '1/1' : '1/2',
          ownershipDocNumber: `78-78-${String(aptNum).padStart(3, '0')}/${String(aptNum * 3 + i).padStart(3, '0')}/2020-${1000 + aptNum}`,
          state: aptNum === 15 ? (i === 0 ? 'verified' : 'pending') : 'verified',
        }))

        apartments.push({
          id: `apt-${aptNum}`,
          type: 'apartment',
          number: String(aptNum),
          entrance,
          floor,
          area: isProblem15 ? 52.3 : baseArea, // ref text-diff.md: 52.3 м² for №15
          cadastralLinked: !isProblem15 && !isProblem25 && !isProblem30,
          status,
          issues,
          owners,
        })
        aptNum++
      }
    }
  }

  // 5 non-residential premises
  const nonres: Premise[] = [
    { id: 'nr-1', type: 'non_residential', number: 'Парковка', entrance: 1, floor: 0, area: 5000, cadastralLinked: true, status: 'ok', issues: [], owners: [] },
    { id: 'nr-2', type: 'non_residential', number: 'Кладовая 1', entrance: 1, floor: -1, area: 12, cadastralLinked: true, status: 'ok', issues: [], owners: [] },
    { id: 'nr-3', type: 'non_residential', number: 'Кладовая 2', entrance: 2, floor: -1, area: 14, cadastralLinked: true, status: 'ok', issues: [], owners: [] },
    { id: 'nr-4', type: 'non_residential', number: 'Магазин', entrance: 3, floor: 1, area: 180, cadastralLinked: true, status: 'ok', issues: [], owners: [] },
    { id: 'nr-5', type: 'non_residential', number: 'Офис УО', entrance: 1, floor: 1, area: 45, cadastralLinked: true, status: 'ok', issues: [], owners: [] },
  ]

  return [...apartments, ...nonres]
}

/**
 * Block 1 — Организация общего собрания (mandatory for first OSS in System).
 * 5 fixed questions per ст. 47.1 ЖК РФ. All pre-checked, mandatory (can't uncheck in this MVP).
 */
export function createBlock1(): AgendaBlock {
  return {
    id: 'block-1',
    number: 1,
    type: 'organization',
    themeCode: null,
    themeTitle: 'Организация общего собрания',
    zhkRfReference: 'ст. 47.1 ЖК РФ — обязательные вопросы для первого собрания в Системе',
    decisionThreshold: 'simple_majority_present',
    questions: [
      {
        code: '1.1',
        title: 'Выбор информационной системы для проведения голосования',
        description:
          'Выбрать в качестве информационной системы, с использованием которой будут проводиться общие собрания собственников помещений в доме — Государственную информационную систему жилищно-коммунального хозяйства (ГИС ЖКХ).',
        isRecommended: true,
        isMandatory: true,
        isChecked: true,
        requiresDocument: null,
        isCustom: false,
      },
      {
        code: '1.2',
        title: 'Выбор администратора электронного собрания',
        description:
          'Возложить функции администратора общего собрания собственников помещений, проводимого с использованием Системы, на ООО «Уют и комфорт» (ИНН 7801234567).',
        isRecommended: true,
        isMandatory: true,
        isChecked: true,
        requiresDocument: null,
        isCustom: false,
      },
      {
        code: '1.3',
        title: 'Определение продолжительности голосования с использованием системы',
        description:
          'Определить продолжительность голосования на общих собраниях собственников, проводимых в форме заочного голосования с использованием Системы, — 60 дней со дня начала голосования.',
        isRecommended: true,
        isMandatory: true,
        isChecked: true,
        requiresDocument: null,
        isCustom: false,
      },
      {
        code: '1.4',
        title: 'Определение порядка приёма решений по вопросам, поставленным на голосование',
        description:
          'Установить, что письменные решения собственников могут быть переданы администратору общего собрания по адресу: г. Санкт-Петербург, ул. Пушкина, д. 1, офис ООО «Уют и комфорт», не позднее 48 часов до окончания голосования.',
        isRecommended: true,
        isMandatory: true,
        isChecked: true,
        requiresDocument: null,
        isCustom: false,
      },
      {
        code: '1.5',
        title: 'Определение места (адреса) хранения протокола и решений собственников',
        description:
          'Определить местом хранения копий протоколов общих собраний и решений собственников помещений: офис ООО «Уют и комфорт» по адресу г. Санкт-Петербург, ул. Пушкина, д. 1.',
        isRecommended: true,
        isMandatory: true,
        isChecked: true,
        requiresDocument: null,
        isCustom: false,
      },
    ],
    params: {},
    alerts: [],
  }
}

/**
 * Block 2 — Капитальный ремонт кровли (demo case).
 * Pre-populated for ?demo-state=notification_published+ and downstream scenarios.
 */
export function createBlock2(): AgendaBlock {
  return {
    id: 'block-2',
    number: 2,
    type: 'capital_repair',
    themeCode: 'capital_repair_roof',
    themeTitle: 'Капитальный ремонт кровли',
    zhkRfReference: 'п. 1 ч. 2 ст. 44 ЖК РФ + ст. 189 ч. 5–5.2',
    decisionThreshold: 'two_thirds_total',
    questions: [
      { code: '2.1', title: 'Утверждение перечня услуг и работ по капитальному ремонту кровли', description: 'Утвердить перечень услуг и работ по капитальному ремонту кровли согласно смете. Срок — до 31.12.2026. Стоимость — 3 000 000 ₽. Подрядчик — ООО «СтройСервис», ИНН 7707083893.', isRecommended: true, isMandatory: false, isChecked: true, requiresDocument: 'cost_estimate', isCustom: false },
      { code: '2.2', title: 'Определение источника и порядка финансирования капитального ремонта кровли', description: 'Определить источником финансирования капитального ремонта кровли — Фонд регионального оператора в размере 3 000 000 ₽. Срок — до 31.12.2026. Подрядчик — ООО «СтройСервис».', isRecommended: true, isMandatory: false, isChecked: true, requiresDocument: null, isCustom: false },
      { code: '2.3', title: 'Утверждение сметы на проведение капитального ремонта кровли', description: 'Утвердить смету на проведение капитального ремонта кровли согласно приложенному документу «Смета на капитальный ремонт кровли».', isRecommended: true, isMandatory: false, isChecked: true, requiresDocument: 'cost_estimate', isCustom: false },
      { code: '2.4', title: 'Утверждение состава комиссии от собственников при приёмке результатов', description: 'Утвердить состав комиссии от собственников при приёмке результатов капитального ремонта кровли. Уполномочить указанных лиц на подписание акта приёмки выполненных работ у подрядчика ООО «СтройСервис».', isRecommended: true, isMandatory: false, isChecked: true, requiresDocument: null, isCustom: false },
      { code: '2.5', title: 'Выбор подрядчика для проведения работ', description: 'Выбрать в качестве подрядчика для проведения работ по капитальному ремонту кровли — ООО «СтройСервис» (ИНН 7707083893).', isRecommended: true, isMandatory: false, isChecked: true, requiresDocument: null, isCustom: false },
    ],
    params: {
      workDeadline: '2026-12-31',
      workBudget: 3_000_000,
      contractorName: 'ООО «СтройСервис», ИНН 7707083893',
      fundingSource: 'regional_operator_fund',
    },
    alerts: [],
  }
}
