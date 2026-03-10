import { Sword, StickyNote, Star, Sparkles, BookOpen, Users, Award, Dna, Globe } from 'lucide-react'
import { FormatText } from '../ui/FormatText'
import { typeSubtitle, typeBody, typeMicro } from '../ui/typography'
import { STAT_COLORS } from '../cards/domain-colors'
import { warmGlass, RADIUS_CARD } from '../design-system/tokens/surfaces'
import { TRAIT_NAMES, formatTraitValue } from '../core/rules/traits'
import { StatBar } from './StatBar'
import { EquipmentPanel } from './panels/EquipmentPanel'
import { NotesPanel } from './panels/NotesPanel'
import { InlineSection } from './InlineSection'
import { CharacterHeader } from './CharacterHeader'
import { DomainAbilityPanel } from './DomainAbilityPanel'
import { getClassForSubclass } from '../data/srd'
import { useCharacterStore } from '../store/character-store'
import type { Character, TraitName } from '../types/character'

interface MobileLayoutProps {
  character: Character
  accentColor: string
  onHeroTap: () => void
  onCardTap: (cardName: string) => void
  onLevelUp: () => void
}

const traitAbbreviations: Record<TraitName, string> = {
  agility: 'Agi',
  strength: 'Str',
  finesse: 'Fin',
  instinct: 'Ins',
  presence: 'Pre',
  knowledge: 'Kno',
}

function TraitsGrid({ character }: { character: Character }) {
  return (
    <div
      style={{
        ...warmGlass,
        borderRadius: RADIUS_CARD,
        padding: 12,
      }}
    >
      <div className="grid grid-cols-3 gap-x-3 gap-y-2">
        {TRAIT_NAMES.map((trait) => {
          const value = character.traits[trait]
          return (
            <div
              key={trait}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <span
                style={{
                  ...typeSubtitle,
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                }}
              >
                {traitAbbreviations[trait]}
              </span>
              <span
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: value > 0
                    ? 'var(--gold)'
                    : value < 0
                      ? STAT_COLORS.negative
                      : 'var(--text-muted)',
                }}
              >
                {formatTraitValue(value)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MobileLayout({ character, accentColor, onHeroTap, onCardTap }: MobileLayoutProps) {
  const classData = getClassForSubclass(character.subclass)
  const updateBackground = useCharacterStore((s) => s.updateBackground)
  const updateConnections = useCharacterStore((s) => s.updateConnections)

  return (
    <div className="flex flex-col">
      <CharacterHeader character={character} variant="mobile" onTap={onHeroTap} />

      {/* Stats + Panels */}
      <div className="px-4 pb-3 pt-1">
        <div className="flex flex-col gap-4">
          {/* StatBar — #1 most important interactive element */}
          <StatBar character={character} accentColor={accentColor} />

          {/* Traits Grid — compact 3x2 */}
          <TraitsGrid character={character} />

          {/* Domain Abilities */}
          {character.domainCards.length > 0 && (
            <div className="flex flex-col gap-3">
              <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                Domain Abilities
              </span>
              {character.domainCards.map((card) => (
                <DomainAbilityPanel
                  key={card.name}
                  card={card}
                  onTap={() => onCardTap(card.name)}
                />
              ))}
            </div>
          )}

          {/* Equipment */}
          <InlineSection title="Equipment" icon={Sword}>
            <EquipmentPanel character={character} />
          </InlineSection>

          {/* Ancestry Feature */}
          {character.ancestry?.feats?.length > 0 && (
            <InlineSection title={`${character.ancestry.name} (Ancestry)`} icon={Dna} collapsible defaultCollapsed>
              <div className="flex flex-col gap-3">
                {character.ancestry.feats.map((feat, i) => (
                  <div key={i}>
                    <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                      {feat.name}
                    </span>
                    <div style={{ ...typeBody, color: 'var(--text-secondary)', marginTop: 4 }}>
                      <FormatText text={feat.text} />
                    </div>
                  </div>
                ))}
              </div>
            </InlineSection>
          )}

          {/* Community Feature */}
          {character.community?.feats?.length > 0 && (
            <InlineSection title={`${character.community.name} (Community)`} icon={Globe} collapsible defaultCollapsed>
              <div className="flex flex-col gap-3">
                {character.community.feats.map((feat, i) => (
                  <div key={i}>
                    <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                      {feat.name}
                    </span>
                    <div style={{ ...typeBody, color: 'var(--text-secondary)', marginTop: 4 }}>
                      <FormatText text={feat.text} />
                    </div>
                  </div>
                ))}
              </div>
            </InlineSection>
          )}

          {/* Hope Feature */}
          {classData?.hope_feat_name && (
            <InlineSection title="Hope Feature" icon={Star} collapsible defaultCollapsed>
              <div>
                <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                  {classData.hope_feat_name}
                </span>
                <div style={{ ...typeBody, color: 'var(--text-secondary)', marginTop: 4 }}>
                  <FormatText text={classData.hope_feat_text} />
                </div>
              </div>
            </InlineSection>
          )}

          {/* Class Features */}
          {classData?.class_feats?.map((feat, i) => (
            <InlineSection key={i} title={feat.name} icon={Sparkles} collapsible defaultCollapsed>
              <div style={{ ...typeBody, color: 'var(--text-secondary)' }}>
                <FormatText text={feat.text} />
              </div>
            </InlineSection>
          ))}

          {/* Experiences */}
          {character.experiences?.length > 0 && (
            <InlineSection title="Experiences" icon={Award}>
              <div className="flex flex-col gap-1">
                {character.experiences.filter(e => e?.text).map((exp, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span style={{ ...typeBody, color: 'var(--text-secondary)' }}>
                      {exp.text}
                    </span>
                    <span style={{ ...typeMicro, color: 'var(--gold-secondary)' }}>
                      +{exp.bonus}
                    </span>
                  </div>
                ))}
              </div>
            </InlineSection>
          )}

          {/* Notes */}
          <InlineSection title="Notes" icon={StickyNote}>
            <NotesPanel character={character} />
          </InlineSection>

          {/* Background */}
          {classData?.backgrounds && classData.backgrounds.length > 0 && (
            <InlineSection title="Background" icon={BookOpen} collapsible defaultCollapsed>
              {classData.backgrounds.map((bg, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <p style={{ ...typeMicro, color: 'var(--gold-secondary)', marginBottom: 4 }}>
                    {bg.question}
                  </p>
                  <input
                    type="text"
                    value={character.backgroundAnswers?.[i] ?? ''}
                    onChange={(e) => updateBackground(character.id, i, e.target.value)}
                    placeholder="Your answer..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 8,
                      color: 'var(--text-primary)',
                      ...typeBody,
                      outline: 'none',
                      caretColor: 'var(--gold)',
                    }}
                  />
                </div>
              ))}
            </InlineSection>
          )}

          {/* Connections */}
          {classData?.connections && classData.connections.length > 0 && (
            <InlineSection title="Connections" icon={Users} collapsible defaultCollapsed>
              {classData.connections.map((conn, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <p style={{ ...typeMicro, color: 'var(--gold-secondary)', marginBottom: 4 }}>
                    {conn.question}
                  </p>
                  <input
                    type="text"
                    value={character.connectionAnswers?.[i] ?? ''}
                    onChange={(e) => updateConnections(character.id, i, e.target.value)}
                    placeholder="Your answer..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 8,
                      color: 'var(--text-primary)',
                      ...typeBody,
                      outline: 'none',
                      caretColor: 'var(--gold)',
                    }}
                  />
                </div>
              ))}
            </InlineSection>
          )}
        </div>
      </div>
    </div>
  )
}
