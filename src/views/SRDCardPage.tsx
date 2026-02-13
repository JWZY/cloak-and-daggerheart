import { useEffect } from 'react'
import { SRDCard } from '../components/cards/SRDCard'
import { DOMAIN_COLORS } from '../components/cards/DomainCard'
import { subclasses, getClassForSubclass } from '../data/srd'
import type { DomainIconName } from '../components/cards/domain-icons'

const basePath = import.meta.env.BASE_URL || '/'

// Only thing specified per card — everything else derived from SRD data
const FEATURED_SUBCLASSES = [
  'School of Knowledge',
  'School of War',
  'Syndicate',
  'Call of the Slayer',
  'Divine Wielder',
]

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

const subclassCards = FEATURED_SUBCLASSES.map(name => {
  const subclass = subclasses.find(s => s.name === name)
  const parentClass = getClassForSubclass(name)
  if (!subclass || !parentClass) {
    console.warn(`SRDCardPage: subclass "${name}" not found in SRD data, skipping`)
    return null
  }

  // Parse feats, extracting any bullet list from foundation text
  let featList: string[] | undefined
  const feats = subclass.foundations.map(f => {
    const bulletSplit = f.text.indexOf('\n\n- ')
    if (bulletSplit !== -1 && !featList) {
      // First feat with bullets: split intro text from bullet items
      const intro = f.text.slice(0, bulletSplit)
      const bullets = f.text.slice(bulletSplit)
        .split('\n')
        .map(line => line.replace(/^- /, '').trim())
        .filter(Boolean)
      featList = bullets
      return { name: f.name, text: intro }
    }
    return { name: f.name, text: f.text }
  })

  return {
    name: subclass.name,
    className: parentClass.name,
    domain1: parentClass.domain_1,
    domain2: parentClass.domain_2,
    domainIcons: [
      parentClass.domain_1.toLowerCase() as DomainIconName,
      parentClass.domain_2.toLowerCase() as DomainIconName,
    ] as [DomainIconName, DomainIconName],
    spellcastTrait: subclass.spellcast_trait,
    feats,
    featList,
    illustrationSrc: `${basePath}images/cards/subclasses/${toSlug(name)}.png`,
  }
}).filter((card): card is NonNullable<typeof card> => card !== null)

export function SRDCardPage() {
  // Override body/root overflow:hidden (set for iOS-native feel) so this page scrolls
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = 'body, #root { overflow: auto !important; position: static !important; height: auto !important; }'
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#0a0e14',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Page title */}
        <h1 style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 36,
          fontWeight: 500,
          fontVariant: 'small-caps',
          color: '#f9f8f3',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Subclass Cards
        </h1>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, marginBottom: 48 }}>
          SRD subclass cards with domain-based banners
        </p>

        {/* Card grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 32,
          justifyContent: 'center',
        }}>
          {subclassCards.map((card) => (
            <SRDCard
              key={card.name}
              name={card.name}
              className={card.className}
              tier="Foundation"
              spellcastTrait={card.spellcastTrait}
              feats={card.feats}
              featList={card.featList}
              bannerColor={DOMAIN_COLORS[card.domain2]}
              bannerInnerColor={DOMAIN_COLORS[card.domain1]}
              domainIcons={card.domainIcons}
              illustrationSrc={card.illustrationSrc}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
