import { BarChart3, Sword, StickyNote, Star, Sparkles, BookOpen, Users, Award } from 'lucide-react'
import { FormatText } from '../ui/FormatText'
import { typeSubtitle, typeBody, typeMicro } from '../ui/typography'
import { HeroCard } from './HeroCard'
import { StatBar } from './StatBar'
import { StatsPanel } from './panels/StatsPanel'
import { EquipmentPanel } from './panels/EquipmentPanel'
import { NotesPanel } from './panels/NotesPanel'
import { InlineSection } from './InlineSection'
import { CharacterHeader } from './CharacterHeader'
import { DomainCardBody } from './DomainCardBody'
import { ScaledCard } from '../cards/ScaledCard'
import { DomainCard } from '../cards/DomainCard'
import { AncestryCard } from '../cards/AncestryCard'
import { CommunityCard } from '../cards/CommunityCard'
import { cardScale } from '../cards/card-tokens'
import { domainCardToProps } from '../data/card-mapper'
import { getClassForSubclass } from '../data/srd'
import { useCharacterStore } from '../store/character-store'
import type { Character } from '../types/character'

interface DesktopLayoutProps {
  character: Character
  accentColor: string
  onHeroTap: () => void
  onCardTap: (cardName: string) => void
  onLevelUp: () => void
}

export function DesktopLayout({ character, accentColor, onHeroTap, onCardTap }: DesktopLayoutProps) {
  const classData = getClassForSubclass(character.subclass)
  const updateBackground = useCharacterStore((s) => s.updateBackground)
  const updateConnections = useCharacterStore((s) => s.updateConnections)

  return (
    <div
      className="mx-auto px-6 py-4"
      style={{ maxWidth: 1200 }}
    >
      <div className="grid gap-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Left column: character name + hero card, sticky */}
        <div className="sticky top-0 self-start flex flex-col items-center justify-center pt-8" style={{ minHeight: '100dvh' }}>
          <CharacterHeader character={character} variant="desktop" />


          {/* Hero card at 0.85 scale */}
          <ScaledCard scale={cardScale.hero} style={{ flexShrink: 0 }}>
            <HeroCard subclass={character.subclass} onTap={onHeroTap} />
          </ScaledCard>
        </div>

        {/* Right column: cards grid + stats + panels */}
        <div className="flex flex-col gap-6 py-8">
          {/* Domain cards in 3-column grid */}
          <div className="grid grid-cols-3 gap-3">
            {character.domainCards.map((card) => {
              const mapped = domainCardToProps(card)
              return (
                <ScaledCard
                  key={card.name}
                  scale={0.5}
                  style={{ overflow: 'hidden', borderRadius: 10 }}
                >
                  <DomainCard
                    {...mapped.props}
                    scale={1}
                    onClick={() => onCardTap(card.name)}
                  >
                    <DomainCardBody bodyText={mapped.bodyText} />
                  </DomainCard>
                </ScaledCard>
              )
            })}
          </div>

          {/* Ancestry + Community in 2-column row */}
          <div className="grid grid-cols-2 gap-3">
            <AncestryCard
              ancestry={character.ancestry}
              scale={0.5}
              onClick={() => onCardTap('ancestry')}
            />
            <CommunityCard
              community={character.community}
              scale={0.5}
              onClick={() => onCardTap('community')}
            />
          </div>

          {/* Stats and panels */}
          <div className="px-0">
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
                    <div style={{ ...typeBody, color: 'var(--text-secondary)', marginTop: 4 }}>
                      <FormatText text={classData.hope_feat_text} />
                    </div>
                  </div>
                </InlineSection>
              )}

              {/* Class Features */}
              {classData?.class_feats?.map((feat, i) => (
                <InlineSection key={i} title={feat.name} icon={Sparkles}>
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
      </div>
    </div>
  )
}
