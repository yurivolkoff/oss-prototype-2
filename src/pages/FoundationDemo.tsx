import { useState } from 'react'
import { Building2 } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import BackLink from '../components/layout/BackLink'
import Stepper, { STEPPER_LABELS } from '../components/stepper/Stepper'
import StepPills from '../components/stepper/StepPills'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Pill from '../components/ui/Pill'
import KeyValueRow from '../components/ui/KeyValueRow'
import InfoBlock from '../components/ui/InfoBlock'
import WarningBanner from '../components/ui/WarningBanner'
import StatusRow from '../components/ui/StatusRow'
import Accordion from '../components/ui/Accordion'
import FormField from '../components/form/FormField'
import TextInput from '../components/form/TextInput'
import Textarea from '../components/form/Textarea'
import Select from '../components/form/Select'
import Checkbox from '../components/form/Checkbox'
import Radio from '../components/form/Radio'
import RadioActionRow from '../components/form/RadioActionRow'
import FileUploadArea from '../components/form/FileUploadArea'
import FileCard from '../components/form/FileCard'
import ConfirmModal from '../components/modal/ConfirmModal'
import InfoPopover from '../components/popover/InfoPopover'
import { showComingSoon } from '../components/toast/toastHelpers'

export default function FoundationDemo() {
  const [text, setText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  return (
    <AppLayout>
      <BackLink to="/" />

      <h1 className="text-2xl font-bold mt-4 mb-2">Foundation Demo</h1>
      <p className="text-sm text-gray-600 mb-8">
        Витрина базовых компонентов. Если что-то здесь ломается — модули Phase 2 на этом сломаются ещё сильнее.
      </p>

      <section className="space-y-8">
        <DemoSection title="Stepper">
          <Stepper
            steps={STEPPER_LABELS.map((label, i) => ({
              label,
              status: i < 2 ? 'completed' : i === 2 ? 'active' : 'pending',
            }))}
          />
        </DemoSection>

        <DemoSection title="StepPills">
          <StepPills count={3} activeIndex={1} completedThrough={0} />
        </DemoSection>

        <DemoSection title="Card variants">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-medium">Base card</h3>
              <p className="text-sm text-gray-600 mt-1">Стандартный белый контейнер.</p>
            </Card>
            <Card variant="accent" className="p-6">
              <h3 className="font-medium">Accent card</h3>
              <p className="text-sm opacity-90 mt-1">Hero-карточка с градиентом.</p>
            </Card>
          </div>
        </DemoSection>

        <DemoSection title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
        </DemoSection>

        <DemoSection title="Pills">
          <div className="flex flex-wrap gap-2">
            <Pill tone="success">готово</Pill>
            <Pill tone="warning">осталось 7 дней</Pill>
            <Pill tone="error">нужны уточнения</Pill>
            <Pill tone="info">новый</Pill>
            <Pill tone="neutral">завершилось</Pill>
            <Pill tone="dark">Обязательный</Pill>
          </div>
        </DemoSection>

        <DemoSection title="KeyValueRow">
          <Card className="p-4 space-y-1">
            <KeyValueRow label="Кадастровый номер дома" value="78:23:0000000:1234" mono />
            <KeyValueRow label="Общая площадь помещений" value="4419.7 м²" />
          </Card>
        </DemoSection>

        <DemoSection title="InfoBlock">
          <InfoBlock>
            <strong>Кворум по вопросу — 2/3 от всех голосов в доме.</strong>
            <div className="mt-1 text-xs">
              Для решений по капитальному ремонту требуется не менее 2/3 голосов от общего числа собственников. Основание: ст. 46 ч. 1 п. 1 ЖК РФ.
            </div>
          </InfoBlock>
        </DemoSection>

        <DemoSection title="WarningBanner">
          <WarningBanner title="Голосование может не состояться">
            Кворум пока не набран. Напомните соседям о собрании.
          </WarningBanner>
        </DemoSection>

        <DemoSection title="StatusRow">
          <Card className="p-4">
            <StatusRow
              kind="success"
              pillLabel="хорошая оценка"
              text="Кадастровые номера связаны с помещениями в ГИС ЖКХ"
              counter="116 из 120"
              action={
                <Button variant="ghost" size="medium" onClick={() => showComingSoon()}>
                  Связать номера
                </Button>
              }
            />
            <StatusRow
              kind="warning"
              pillLabel="обратите внимание"
              text="Задублированные помещения"
              counter="98 помещений"
            />
          </Card>
        </DemoSection>

        <DemoSection title="Accordion">
          <Accordion number={1} title="Организация общего собрания" subtitle="ст. 47.1 ЖК РФ" defaultOpen>
            <p className="text-sm text-gray-700">Развёрнутое содержимое аккордеона.</p>
          </Accordion>
          <div className="mt-3">
            <Accordion number={2} title="Капитальный ремонт кровли" subtitle="Кворум по вопросу — 2/3 от всех голосов">
              <p className="text-sm text-gray-700">Свёрнут по умолчанию.</p>
            </Accordion>
          </div>
        </DemoSection>

        <DemoSection title="Form: TextInput / Textarea / Select / Checkbox / Radio">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="наименование подрядчика" required helper="название и ИНН">
              <TextInput placeholder="например, ООО «СтройСервис»" />
            </FormField>
            <FormField label="источник финансирования" required>
              <Select
                placeholder="выберите источник"
                options={[
                  { value: 'regional_operator_fund', label: 'Фонд регионального оператора' },
                  { value: 'special_account', label: 'Специальный счёт дома' },
                  { value: 'other', label: 'Иные средства' },
                ]}
              />
            </FormField>
            <FormField label="вступительное слово" helper="увидят все собственники в ЛК Госуслуг" className="col-span-2">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={4000}
                showCounter
                placeholder="например, в нашем доме нужен ремонт кровли…"
              />
            </FormField>
            <div>
              <Checkbox checked disabled label="Обязательный вопрос (disabled)" />
              <Checkbox defaultChecked label="Рекомендуемый вопрос" />
            </div>
            <div>
              <Radio name="example" value="a" defaultChecked label="за" />
              <Radio name="example" value="b" label="воздержался" />
              <Radio name="example" value="c" label="против" />
            </div>
          </div>
        </DemoSection>

        <DemoSection title="RadioActionRow">
          <Card className="p-2">
            <RadioActionRow
              title="Капитальный ремонт"
              subtitle="п. 1, 1.1, 1.2 ч. 2 ст. 44 ЖК РФ + ст. 189"
              onClick={() => showComingSoon('Демо — категории не активны')}
            />
            <RadioActionRow
              title="Управление МКД"
              subtitle="п. 4 ч. 2 ст. 44 ЖК РФ"
              onClick={() => showComingSoon('Демо — категории не активны')}
            />
          </Card>
        </DemoSection>

        <DemoSection title="FileUploadArea / FileCard">
          <div className="space-y-3">
            {file ? (
              <FileCard
                name={file.name}
                sizeBytes={file.size}
                onRemove={() => setFile(null)}
                badge={{ label: 'распознаны все ответы', tone: 'success' }}
              />
            ) : (
              <FileUploadArea
                label="Загрузите скан бумажной бюллетени"
                onFiles={(files) => setFile(files[0])}
              />
            )}
          </div>
        </DemoSection>

        <DemoSection title="InfoPopover">
          <div className="text-sm">
            Кликни на иконку, чтобы открыть popover:{' '}
            <InfoPopover>
              <strong>Кворум собрания</strong>
              <div className="mt-1 text-xs text-gray-600">
                Собрание правомочно, если в нём приняли участие собственники, обладающие более чем 50% от общего числа голосов всех собственников. Основание: ст. 45 ч. 3 ЖК РФ.
              </div>
            </InfoPopover>
          </div>
        </DemoSection>

        <DemoSection title="ConfirmModal + Toast">
          <div className="flex gap-3">
            <Button onClick={() => setShowConfirm(true)}>Открыть Confirm</Button>
            <Button variant="secondary" onClick={() => showComingSoon()}>
              Показать toast
            </Button>
          </div>

          <ConfirmModal
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false)
              showComingSoon('Confirm нажат')
            }}
            title="Опубликовать уведомление?"
            confirmLabel="Опубликовать"
          >
            <p>
              Голосование начнётся 01.06.2026 и завершится 31.07.2026. После публикации повестка не редактируется.
            </p>
          </ConfirmModal>
        </DemoSection>

        <DemoSection title="Icons">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Building2 className="w-6 h-6" />
            <span>lucide-react интегрирован</span>
          </div>
        </DemoSection>
      </section>
    </AppLayout>
  )
}

function DemoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</h2>
      {children}
    </div>
  )
}
