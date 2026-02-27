import { SectionHeader } from '../../ui/SectionHeader'
import { StepInstruction } from '../../ui/StepInstruction'
import { SelectableOption } from '../../ui/SelectableOption'
import { useDeckStore } from '../../store/deck-store'
import { classes } from '../../data/srd'

export function PickClass() {
  const selectedClass = useDeckStore((s) => s.selectedClass)
  const setClass = useDeckStore((s) => s.setClass)

  return (
    <div className="flex flex-col items-center px-4">
      <h2 className="w-full max-w-xs mb-4">
        <SectionHeader>Choose Your Class</SectionHeader>
      </h2>
      <StepInstruction>Each class has unique domains, subclasses, and play style</StepInstruction>

      <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
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
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 18,
                    fontWeight: 600,
                    fontVariant: 'small-caps',
                    letterSpacing: '0.04em',
                    color: isSelected ? '#e7ba90' : 'rgba(212, 207, 199, 0.7)',
                  }}
                >
                  {cls.name}
                </span>
                <span
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 11,
                    color: 'rgba(212, 207, 199, 0.4)',
                  }}
                >
                  {cls.domain_1} · {cls.domain_2}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.4,
                  color: isSelected ? 'rgba(231, 186, 144, 0.7)' : 'rgba(212, 207, 199, 0.5)',
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
