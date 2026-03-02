import { SectionHeader } from '../../ui/SectionHeader'
import { StepInstruction } from '../../ui/StepInstruction'
import { SelectableOption } from '../../ui/SelectableOption'
import { typeSubtitle, typeBody, typeMicro } from '../../ui/typography'
import { useDeckStore } from '../../store/deck-store'
import { classes } from '../../data/srd'

export function PickClass() {
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const setClass = useDeckStore((s) => s.setClass)

  return (
    <div className="flex flex-col items-center px-4">
      <h2 className="w-full max-w-[360px] mb-4">
        <SectionHeader>Choose Your Class</SectionHeader>
      </h2>
      <StepInstruction>Each class has unique domains, subclasses, and play style</StepInstruction>

      <div className="flex flex-col gap-3 w-full max-w-[360px] mt-4">
        {classes.map((cls) => {
          const isSelected = selectedClass === cls.name
          const isDimmed = selectedClass !== null && !isSelected

          return (
            <SelectableOption
              key={cls.name}
              selected={isSelected}
              dimmed={isDimmed}
              onClick={() => setClass(cls.name)}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  style={{
                    ...typeSubtitle,
                    fontSize: 18,
                    color: isSelected ? 'var(--gold)' : 'var(--text-secondary)',
                  }}
                >
                  {cls.name}
                </span>
                <span
                  style={{
                    fontFamily: typeMicro.fontFamily,
                    fontSize: typeMicro.fontSize,
                    color: 'var(--text-muted)',
                  }}
                >
                  {cls.domain_1} · {cls.domain_2}
                </span>
              </div>
              <p
                style={{
                  ...typeBody,
                  color: isSelected ? 'var(--gold)' : 'var(--text-muted)',
                }}
              >
                {cls.description.split('. ')[0]}.
              </p>
            </SelectableOption>
          )
        })}
      </div>
    </div>
  )
}
