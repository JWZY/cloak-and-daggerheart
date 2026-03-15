import { Sword, StickyNote, BookOpen, Users, Award, Coins } from 'lucide-react'
import { typeTitle, typeSubtitle, typeBody, typeMicro, goldGradientStyle } from '../ui/typography'
import { warmGlass, RADIUS_CARD } from '../design-system/tokens/surfaces'
import { TRAIT_NAMES, formatTraitValue } from '../core/rules/traits'
import { StatBar } from './StatBar'
import { ConditionBar } from './ConditionBar'
import { EquipmentPanel } from './panels/EquipmentPanel'
import { NotesPanel } from './panels/NotesPanel'
import { GoldPanel } from './panels/GoldPanel'
import { InlineSection } from './InlineSection'
import { DomainAbilityPanel } from './DomainAbilityPanel'
import { WeaponPanel } from './WeaponPanel'
import { FeaturePanel } from './FeaturePanel'
import { ArmorEvasionBlock } from './ArmorEvasionBlock'
import { DomainBanner } from '../cards/DomainBanner'
import { DOMAIN_COLORS, DOMAIN_COLORS_MUTED } from '../cards/domain-colors'
import { getClassForSubclass, getSubclassByName } from '../data/srd'
import { kebabCase } from '../data/card-mapper'
import { useCharacterStore } from '../store/character-store'
import type { Character, TraitName } from '../types/character'

const BASE_URL = import.meta.env.BASE_URL

/** Hand-picked domain card artwork per class — same as PickClass.tsx */
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

interface DesktopLayoutProps {
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

// Action verbs under each trait — matches the character sheet
const traitActions: Record<string, string[]> = {
  agility: ['Sprint', 'Leap', 'Maneuver'],
  strength: ['Lift', 'Smash', 'Grapple'],
  finesse: ['Control', 'Hide', 'Tinker'],
  instinct: ['Perceive', 'Sense', 'Navigate'],
  presence: ['Charm', 'Perform', 'Deceive'],
  knowledge: ['Recall', 'Analyze', 'Comprehend'],
}

/**
 * Desktop layout inspired by the official Daggerheart character sheet.
 *
 * Landscape adaptation of the portrait sheet:
 * - Full-width identity banner (class + name + level)
 * - Full-width trait bar (6 traits with action verbs)
 * - 3-column body:
 *   Left  = vital stats (armor, HP, stress, hope) — "Damage & Health" column
 *   Center = abilities & features (domain abilities, class features, hope feat)
 *   Right  = equipment, experiences, notes, background/connections
 */
export function DesktopLayout({ character, accentColor, onHeroTap, onCardTap }: DesktopLayoutProps) {
  const classData = getClassForSubclass(character.subclass)
  const subclassData = getSubclassByName(character.subclass)
  const updateBackground = useCharacterStore((s) => s.updateBackground)
  const updateConnections = useCharacterStore((s) => s.updateConnections)
  const toggleFeatureUsed = useCharacterStore((s) => s.toggleFeatureUsed)

  const portraitSrc = character.portrait || subclassArtSrc(character.subclass)

  return (
    <div className="mx-auto px-6 py-6" style={{ maxWidth: 1400 }}>

      {/* ─── Identity Banner ─── */}
      <div className="relative mb-5">
        {/* Gold gradient line — flush with top of pennant */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold-muted), transparent)',
          }}
        />

        <button
          type="button"
          aria-label={`${character.name}, level ${character.level} ${character.subclass} ${character.class}`}
          onClick={onHeroTap}
          className="flex items-center gap-6 mx-auto"
          style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
        >
          {/* Portrait circle */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '1px solid var(--gold-muted)',
              overflow: 'hidden',
              flexShrink: 0,
              background: 'var(--bg-surface)',
            }}
          >
            <img
              src={portraitSrc}
              alt=""
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Domain pennant — both domains stacked */}
          <div className="relative" style={{ width: 44, height: 80, flexShrink: 0 }}>
            {classData && (
              <DomainBanner
                outerColor={DOMAIN_COLORS_MUTED[classData.domain_2] ?? '#626565'}
                innerColor={DOMAIN_COLORS[classData.domain_1] ?? DOMAIN_COLORS.Blade}
                uid="desktop-header"
                domain={classData.domain_1}
                domain2={classData.domain_2}
                basePath={import.meta.env.BASE_URL}
                scale={1}
              />
            )}
          </div>

          {/* Name + L# subclass class — both left-aligned */}
          <div className="flex flex-col items-start">
            <span style={{ ...typeTitle, fontSize: 28, ...goldGradientStyle }}>
              {character.name}
            </span>
            <span style={{ ...typeSubtitle, color: 'var(--gold-secondary)' }}>
              L{character.level} {character.subclass} {character.class}
            </span>
          </div>
        </button>
      </div>

      {/* ─── Armor/Evasion + Trait Bar ─── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'stretch' }}>
        {/* Armor & Evasion block — fixed width on the left */}
        <div style={{ flexShrink: 0, width: 170 }}>
          <ArmorEvasionBlock character={character} />
        </div>

        {/* Trait cells fill the rest */}
        <div
          style={{
            ...warmGlass,
            borderRadius: RADIUS_CARD,
            padding: '12px 16px',
            flex: 1,
            minWidth: 0,
          }}
        >
          <div className="grid grid-cols-6 gap-1">
            {TRAIT_NAMES.map((trait) => {
              const value = character.traits[trait]
              return (
                <div
                  key={trait}
                  className="flex flex-col items-center py-2 px-2 rounded-lg"
                >
                  <span style={{ ...typeMicro, color: 'var(--gold)' }}>
                    {traitLabels[trait]}
                  </span>
                  <span style={{ ...typeSubtitle, fontSize: 26, fontVariantNumeric: 'tabular-nums', color: 'var(--gold)', lineHeight: 1.2 }}>
                    {formatTraitValue(value)}
                  </span>
                  <span style={{ ...typeMicro, color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap' as const }}>
                    {traitActions[trait]?.join(' · ')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── Three-Column Body ─── */}
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: '1.2fr 1.6fr 1fr' }}
      >

        {/* ═══ LEFT COLUMN: Vital Stats ═══ */}
        <div className="sticky top-0 self-start flex flex-col gap-4">
          <StatBar character={character} accentColor={accentColor} />

          {/* Condition chips — between StatBar and Experiences */}
          <ConditionBar character={character} />

          {/* Experiences — like "Experience" on the character sheet */}
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
        </div>

        {/* ═══ CENTER COLUMN: Abilities & Features ═══ */}
        <div className="flex flex-col gap-3">
          {/* Weapons — first thing you reach for in combat */}
          {(character.equipment?.primaryWeapon || character.equipment?.secondaryWeapon) && (
            <>
              {character.equipment.primaryWeapon && (
                <WeaponPanel
                  weapon={character.equipment.primaryWeapon}
                  attackMod={character.traits[character.equipment.primaryWeapon.trait.toLowerCase() as TraitName] ?? 0}
                  proficiency={character.proficiency}
                />
              )}
              {character.equipment.secondaryWeapon && (
                <WeaponPanel
                  weapon={character.equipment.secondaryWeapon}
                  attackMod={character.traits[character.equipment.secondaryWeapon.trait.toLowerCase() as TraitName] ?? 0}
                  proficiency={character.proficiency}
                />
              )}
            </>
          )}

          {/* Domain Abilities */}
          {character.domainCards.map((card) => (
            <DomainAbilityPanel
              key={card.name}
              card={card}
              onTap={() => onCardTap(card.name)}
            />
          ))}

          {/* Subclass Features — foundations, specializations, masteries based on tier */}
          {subclassData?.foundations?.map((feat, i) => (
            <FeaturePanel
              key={`foundation-${i}`}
              name={feat.name}
              source={`${character.subclass}: Foundation`}
              text={feat.text}
              imageSrc={subclassArtSrc(character.subclass)}
              onTap={() => onCardTap('hero-card')}
              used={character.usedFeatures.includes(feat.name)}
              onToggleUsed={() => toggleFeatureUsed(character.id, feat.name)}
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
              used={character.usedFeatures.includes(feat.name)}
              onToggleUsed={() => toggleFeatureUsed(character.id, feat.name)}
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
              used={character.usedFeatures.includes(feat.name)}
              onToggleUsed={() => toggleFeatureUsed(character.id, feat.name)}
            />
          ))}

          {/* Hope Feature */}
          {classData?.hope_feat_name && (
            <FeaturePanel
              name={classData.hope_feat_name}
              source={`Hope \u00b7 ${character.class}`}
              text={classData.hope_feat_text}
              imageSrc={classArtSrc(character.class)}
              used={character.usedFeatures.includes(classData.hope_feat_name)}
              onToggleUsed={() => toggleFeatureUsed(character.id, classData.hope_feat_name)}
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
              used={character.usedFeatures.includes(feat.name)}
              onToggleUsed={() => toggleFeatureUsed(character.id, feat.name)}
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
              used={character.usedFeatures.includes(feat.name)}
              onToggleUsed={() => toggleFeatureUsed(character.id, feat.name)}
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
              used={character.usedFeatures.includes(feat.name)}
              onToggleUsed={() => toggleFeatureUsed(character.id, feat.name)}
            />
          ))}
        </div>

        {/* ═══ RIGHT COLUMN: Equipment, Gold, Notes, Reference ═══ */}
        <div className="flex flex-col gap-4">
          <InlineSection title="Equipment" icon={Sword}>
            <EquipmentPanel character={character} />
          </InlineSection>

          <InlineSection title="Gold" icon={Coins}>
            <GoldPanel character={character} />
          </InlineSection>

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

          <InlineSection title="Notes" icon={StickyNote}>
            <NotesPanel character={character} />
          </InlineSection>
        </div>
      </div>
    </div>
  )
}
