import { Sword, StickyNote, BookOpen, Users, Award, Coins } from 'lucide-react'
import { typeSubtitle, typeBody, typeMicro } from '../ui/typography'
import { warmGlass, RADIUS_CARD } from '../design-system/tokens/surfaces'
import { TRAIT_NAMES, formatTraitValue } from '../core/rules/traits'
import { StatBar } from './StatBar'
import { EquipmentPanel } from './panels/EquipmentPanel'
import { NotesPanel } from './panels/NotesPanel'
import { GoldPanel } from './panels/GoldPanel'
import { InlineSection } from './InlineSection'
import { CharacterHeader } from './CharacterHeader'
import { DomainAbilityPanel } from './DomainAbilityPanel'
import { FeaturePanel } from './FeaturePanel'
import { getClassForSubclass, getSubclassByName } from '../data/srd'
import { kebabCase } from '../data/card-mapper'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

const BASE_URL = import.meta.env.BASE_URL

/** Hand-picked domain card artwork per class — same as DesktopLayout */
const CLASS_ART: Record<string, string> = {
  Guardian: 'valor-touched',
  Sorcerer: 'arcana-touched',
  Warrior: 'reapers-strike',
  Druid: 'conjure-swarm',
  Bard: 'grace-touched',
  Wizard: 'book-of-vagras',
  Rogue: 'midnight-spirit',
  Ranger: 'cruel-precision',
  Seraph: 'hold-the-line',
}

function classArtSrc(className: string): string {
  return `${BASE_URL}images/cards/domains/${CLASS_ART[className] ?? 'unyielding-armor'}.avif`
}

function subclassArtSrc(subclassName: string): string {
  return `${BASE_URL}images/cards/subclasses/${kebabCase(subclassName)}.avif`
}

function ancestryArtSrc(ancestryName: string): string {
  return `${BASE_URL}images/cards/ancestries/${kebabCase(ancestryName)}.avif`
}

function communityArtSrc(communityName: string): string {
  return `${BASE_URL}images/cards/communities/${kebabCase(communityName)}.avif`
}

interface MobileLayoutProps {
  character: Character
  accentColor: string
  onHeroTap: () => void
  onCardTap: (cardName: string) => void
  onLevelUp: () => void
}

const traitLabels: Record<string, string> = {
  agility: 'Agility',
  strength: 'Strength',
  finesse: 'Finesse',
  instinct: 'Instinct',
  presence: 'Presence',
  knowledge: 'Knowledge',
}

const traitActions: Record<string, string[]> = {
  agility: ['Sprint', 'Leap', 'Maneuver'],
  strength: ['Lift', 'Smash', 'Grapple'],
  finesse: ['Control', 'Hide', 'Tinker'],
  instinct: ['Perceive', 'Sense', 'Navigate'],
  presence: ['Charm', 'Perform', 'Deceive'],
  knowledge: ['Recall', 'Analyze', 'Comprehend'],
}

export function MobileLayout({ character, accentColor, onHeroTap, onCardTap }: MobileLayoutProps) {
  const classData = getClassForSubclass(character.subclass)
  const subclassData = getSubclassByName(character.subclass)
  const spellcastTrait = subclassData?.spellcast_trait ?? null
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

          {/* ─── Trait Bar ─── 6 columns matching desktop */}
          <div
            style={{
              ...warmGlass,
              borderRadius: RADIUS_CARD,
              padding: '12px 8px',
            }}
          >
            <div className="grid grid-cols-6 gap-1">
              {TRAIT_NAMES.map((trait) => {
                const value = character.traits[trait]
                const isSpellcast = spellcastTrait?.toLowerCase() === trait

                return (
                  <div
                    key={trait}
                    className="flex flex-col items-center py-2 px-1 rounded-lg"
                    style={{
                      background: isSpellcast ? 'var(--gold-muted)' : 'transparent',
                      border: isSpellcast ? '1px solid var(--gold-muted)' : '1px solid transparent',
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span style={{ ...typeSubtitle, fontSize: 11, color: 'var(--gold)' }}>
                        {traitLabels[trait]}
                      </span>
                      <span style={{ ...typeSubtitle, fontVariantNumeric: 'tabular-nums', color: 'var(--gold)' }}>
                        {formatTraitValue(value)}
                      </span>
                    </div>
                    {isSpellcast && (
                      <span style={{ ...typeBody, fontSize: 10, color: 'var(--gold-secondary)' }}>Spellcast</span>
                    )}
                    <div className="flex flex-col items-center mt-1 gap-0">
                      {traitActions[trait]?.map((action) => (
                        <span
                          key={action}
                          style={{
                            ...typeBody,
                            fontSize: 10,
                            color: 'var(--text-muted)',
                          }}
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

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

          {/* Subclass Features — foundations, specializations, masteries based on tier */}
          {subclassData?.foundations?.map((feat, i) => (
            <FeaturePanel
              key={`foundation-${i}`}
              name={feat.name}
              source={`${character.subclass}: Foundation`}
              text={feat.text}
              imageSrc={subclassArtSrc(character.subclass)}
              onTap={() => onCardTap('hero-card')}
            />
          ))}
          {character.subclassTier !== 'foundation' && subclassData?.specializations?.map((feat, i) => (
            <FeaturePanel
              key={`specialization-${i}`}
              name={feat.name}
              source={`${character.subclass}: Specialization`}
              text={feat.text}
              imageSrc={subclassArtSrc(character.subclass)}
              onTap={() => onCardTap('hero-card')}
            />
          ))}
          {character.subclassTier === 'mastery' && subclassData?.masteries?.map((feat, i) => (
            <FeaturePanel
              key={`mastery-${i}`}
              name={feat.name}
              source={`${character.subclass}: Mastery`}
              text={feat.text}
              imageSrc={subclassArtSrc(character.subclass)}
              onTap={() => onCardTap('hero-card')}
            />
          ))}

          {/* Hope Feature */}
          {classData?.hope_feat_name && (
            <FeaturePanel
              name={classData.hope_feat_name}
              source={`Hope \u00b7 ${character.class}`}
              text={classData.hope_feat_text}
              imageSrc={classArtSrc(character.class)}
            />
          )}

          {/* Class Features */}
          {classData?.class_feats?.map((feat, i) => (
            <FeaturePanel
              key={i}
              name={feat.name}
              source={`Class: ${character.class}`}
              text={feat.text}
              imageSrc={classArtSrc(character.class)}
            />
          ))}

          {/* Ancestry Features */}
          {character.ancestry?.feats?.map((feat, i) => (
            <FeaturePanel
              key={`ancestry-${i}`}
              name={feat.name}
              source={`Ancestry: ${character.ancestry.name}`}
              text={feat.text}
              imageSrc={ancestryArtSrc(character.ancestry.name)}
              onTap={() => onCardTap('ancestry')}
            />
          ))}

          {/* Community Features */}
          {character.community?.feats?.map((feat, i) => (
            <FeaturePanel
              key={`community-${i}`}
              name={feat.name}
              source={`Community: ${character.community.name}`}
              text={feat.text}
              imageSrc={communityArtSrc(character.community.name)}
              onTap={() => onCardTap('community')}
            />
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

          {/* Equipment */}
          <InlineSection title="Equipment" icon={Sword}>
            <EquipmentPanel character={character} />
          </InlineSection>

          {/* Gold */}
          <InlineSection title="Gold" icon={Coins}>
            <GoldPanel character={character} />
          </InlineSection>

          {/* Notes */}
          <InlineSection title="Notes" icon={StickyNote}>
            <NotesPanel character={character} />
          </InlineSection>

          {/* Background */}
          {classData?.backgrounds && classData.backgrounds.length > 0 && (
            <InlineSection title="Background" icon={BookOpen}>
              {classData.backgrounds.map((bg, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <p style={{ ...typeBody, color: 'var(--gold-secondary)', marginBottom: 4 }}>
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
                      background: 'rgba(30, 22, 14, 0.35)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 12,
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
            <InlineSection title="Connections" icon={Users}>
              {classData.connections.map((conn, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <p style={{ ...typeBody, color: 'var(--gold-secondary)', marginBottom: 4 }}>
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
                      background: 'rgba(30, 22, 14, 0.35)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 12,
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
