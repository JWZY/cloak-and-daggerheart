import { BarChart3, Sword, StickyNote, Star, Sparkles, BookOpen, Users, Award } from 'lucide-react'
import { typeSubtitle, typeBody, typeMicro } from '../ui/typography'
import { HeroCard } from './HeroCard'
import { CardCarousel } from './CardCarousel'
import { StatBar } from './StatBar'
import { StatsPanel } from './panels/StatsPanel'
import { EquipmentPanel } from './panels/EquipmentPanel'
import { NotesPanel } from './panels/NotesPanel'
import { InlineSection } from './InlineSection'
import { CharacterHeader } from './CharacterHeader'
import { LevelUpButton } from './LevelUpButton'
import { ScaledCard } from '../cards/ScaledCard'
import { cardScale } from '../cards/card-tokens'
import { getClassForSubclass } from '../data/srd'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

interface MobileLayoutProps {
  character: Character
  accentColor: string
  onHeroTap: () => void
  onCardTap: (cardName: string) => void
  onLevelUp: () => void
}

export function MobileLayout({ character, accentColor, onHeroTap, onCardTap, onLevelUp }: MobileLayoutProps) {
  const classData = getClassForSubclass(character.subclass)
  const updateBackground = useCharacterStore((s) => s.updateBackground)
  const updateConnections = useCharacterStore((s) => s.updateConnections)

  return (
    <div className="flex flex-col">
      <CharacterHeader character={character} variant="mobile" />

      {character.level < 2 && (
        <LevelUpButton onClick={onLevelUp} variant="mobile" />
      )}

      {/* Hero Card — natural height, centered */}
      <div className="flex items-center justify-center px-4 py-3">
        <ScaledCard scale={cardScale.large} style={{ flexShrink: 0 }}>
          <HeroCard subclass={character.subclass} onTap={onHeroTap} />
        </ScaledCard>
      </div>

      {/* Card Carousel */}
      <div className="py-2">
        <CardCarousel character={character} onCardTap={onCardTap} />
      </div>

      {/* Stats + Panels */}
      <div className="px-3 pb-3 pt-1">
        <div className="flex flex-col gap-4">
          <StatBar character={character} accentColor={accentColor} />

          <InlineSection title="Traits" icon={BarChart3}>
            <StatsPanel character={character} />
          </InlineSection>

          <InlineSection title="Equipment" icon={Sword}>
            <EquipmentPanel character={character} />
          </InlineSection>

          <InlineSection title="Notes" icon={StickyNote}>
            <NotesPanel character={character} />
          </InlineSection>

          {/* Hope Feature */}
          {classData?.hope_feat_name && (
            <InlineSection title="Hope Feature" icon={Star}>
              <div>
                <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>
                  {classData.hope_feat_name}
                </span>
                <p style={{ ...typeBody, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {classData.hope_feat_text}
                </p>
              </div>
            </InlineSection>
          )}

          {/* Class Features */}
          {classData?.class_feats?.map((feat, i) => (
            <InlineSection key={i} title={feat.name} icon={Sparkles}>
              <p style={{ ...typeBody, color: 'var(--text-secondary)' }}>
                {feat.text}
              </p>
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

          {/* Background */}
          {classData?.backgrounds && classData.backgrounds.length > 0 && (
            <InlineSection title="Background" icon={BookOpen}>
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
                      fontFamily: typeBody.fontFamily,
                      fontSize: typeBody.fontSize,
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
                      fontFamily: typeBody.fontFamily,
                      fontSize: typeBody.fontSize,
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
