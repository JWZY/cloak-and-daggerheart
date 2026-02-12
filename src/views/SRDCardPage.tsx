import { useEffect } from 'react'
import { SRDCard } from '../components/cards/SRDCard'
import { DOMAIN_COLORS } from '../components/cards/DomainCard'
import type { DomainIconName } from '../components/cards/domain-icons'

const basePath = import.meta.env.BASE_URL || '/'

// Subclass card data — class→domain mapping from SRD, feat text from subclasses.json
const SUBCLASS_CARDS: {
  name: string
  className: string
  domain1: string
  domain2: string
  domainIcons: [DomainIconName, DomainIconName]
  spellcastTrait?: string
  feats: { name?: string; text: string }[]
  featList?: string[]
  illustrationSrc?: string
}[] = [
  {
    name: 'School of Knowledge',
    className: 'Wizard',
    domain1: 'Codex',
    domain2: 'Splendor',
    domainIcons: ['codex', 'splendor'],
    spellcastTrait: 'Knowledge',
    feats: [
      { name: 'Prepared', text: 'Take an additional domain card of your level or lower from a domain you have access to.' },
      { name: 'Adept', text: 'When you Utilize an Experience, you can mark a Stress instead of spending a Hope. If you do, double your Experience modifier for that roll.' },
    ],
    illustrationSrc: `${basePath}images/cards/subclasses/school-of-knowledge.png`,
  },
  {
    name: 'School of War',
    className: 'Wizard',
    domain1: 'Codex',
    domain2: 'Splendor',
    domainIcons: ['codex', 'splendor'],
    spellcastTrait: 'Knowledge',
    feats: [
      { name: 'Battlemage', text: "You've focused your studies on becoming an unconquerable force on the battlefield. Gain an additional Hit Point slot." },
      { name: 'Face Your Fear', text: 'When you succeed with Fear on an attack roll, you deal an extra 1d10 magic damage.' },
    ],
    illustrationSrc: `${basePath}images/cards/subclasses/school-of-war.png`,
  },
  {
    name: 'Syndicate',
    className: 'Rogue',
    domain1: 'Midnight',
    domain2: 'Grace',
    domainIcons: ['midnight', 'grace'],
    spellcastTrait: 'Finesse',
    feats: [
      { name: 'Well-Connected', text: 'When you arrive in a prominent town or environment, you know somebody who calls this place home. Give them a name, note how you think they could be useful, and choose one fact:' },
    ],
    featList: [
      'They owe me a favor, but they\u2019ll be hard to find.',
      'They\u2019re going to ask for something in exchange.',
      'They\u2019re always in a great deal of trouble.',
      'We used to be together. It\u2019s a long story.',
      'We didn\u2019t part on great terms.',
    ],
    illustrationSrc: `${basePath}images/cards/subclasses/syndicate.png`,
  },
  {
    name: 'Call of the Slayer',
    className: 'Warrior',
    domain1: 'Blade',
    domain2: 'Bone',
    domainIcons: ['blade', 'bone'],
    feats: [
      { name: 'Slayer', text: 'You gain a pool of dice called Slayer Dice. On a roll with Hope, you can place a d6 on this card instead of gaining a Hope, adding the die to the pool. You can store a number of Slayer Dice equal to your Proficiency. When you make an attack roll or damage roll, you can spend any number of these Slayer Dice, rolling them and adding their result to the roll. At the end of each session, clear any unspent Slayer Dice on this card and gain a Hope per die cleared.' },
    ],
    illustrationSrc: `${basePath}images/cards/subclasses/call-of-the-slayer.png`,
  },
  {
    name: 'Divine Wielder',
    className: 'Seraph',
    domain1: 'Splendor',
    domain2: 'Valor',
    domainIcons: ['splendor', 'valor'],
    spellcastTrait: 'Strength',
    feats: [
      { name: 'Spirit Weapon', text: 'When you have an equipped weapon with a range of Melee or Very Close, it can fly from your hand to attack an adversary within Close range and then return to you. You can mark a Stress to target an additional adversary within range with the same attack roll.' },
      { name: 'Sparing Touch', text: 'Once per long rest, touch a creature and clear 2 Hit Points or 2 Stress from them.' },
    ],
    illustrationSrc: `${basePath}images/cards/subclasses/divine-wielder.png`,
  },
]

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
          {SUBCLASS_CARDS.map((card) => (
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
