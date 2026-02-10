import { useState } from 'react'
import { SRDCard } from '../components/cards/SRDCard'
import type { SRDCardProps } from '../components/cards/SRDCard'

const DEFAULTS = {
  titleFontSize: 36,
  titleLineHeight: '32px',
  titleLetterSpacing: 0.02,
  titleSmallCaps: true,
  titleTextTransform: 'none',
  classNameFontSize: 13,
  classNameLetterSpacing: 0.08,
  bodyFontSize: 13,
  bodyLineHeight: 17,
  footerFontSize: 13,
  footerSmallCaps: true,
  footerTextTransform: 'none',
}

function Slider({ label, value, onChange, min, max, step = 1, unit = '' }: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/60">{label}</span>
        <span className="text-white/40 font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber-500"
      />
    </label>
  )
}

function Toggle({ label, value, onChange }: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-xs text-white/60">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className="w-8 h-4 rounded-full relative transition-colors"
        style={{ background: value ? '#d4a053' : '#333' }}
      >
        <div
          className="w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all"
          style={{ left: value ? 16 : 2 }}
        />
      </button>
    </label>
  )
}

function Select({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-white/60">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/10 text-white text-xs rounded px-2 py-1 border border-white/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-widest text-amber-500/60 mt-3 mb-1 first:mt-0">
      {children}
    </div>
  )
}

export function SRDCardPage() {
  const basePath = import.meta.env.BASE_URL || '/'

  const [titleFontSize, setTitleFontSize] = useState(DEFAULTS.titleFontSize)
  const [titleLineHeight, setTitleLineHeight] = useState(32)
  const [titleLetterSpacing, setTitleLetterSpacing] = useState(DEFAULTS.titleLetterSpacing)
  const [titleSmallCaps, setTitleSmallCaps] = useState(DEFAULTS.titleSmallCaps)
  const [titleTextTransform, setTitleTextTransform] = useState(DEFAULTS.titleTextTransform)
  const [classNameFontSize, setClassNameFontSize] = useState(DEFAULTS.classNameFontSize)
  const [classNameLetterSpacing, setClassNameLetterSpacing] = useState(DEFAULTS.classNameLetterSpacing)
  const [bodyFontSize, setBodyFontSize] = useState(DEFAULTS.bodyFontSize)
  const [bodyLineHeight, setBodyLineHeight] = useState(DEFAULTS.bodyLineHeight)
  const [footerFontSize, setFooterFontSize] = useState(DEFAULTS.footerFontSize)
  const [footerSmallCaps, setFooterSmallCaps] = useState(DEFAULTS.footerSmallCaps)
  const [footerTextTransform, setFooterTextTransform] = useState(DEFAULTS.footerTextTransform)

  const styleOverrides = {
    titleFontSize,
    titleLineHeight: `${titleLineHeight}px`,
    titleLetterSpacing: `${titleLetterSpacing}em`,
    titleSmallCaps,
    titleTextTransform,
    classNameFontSize,
    classNameLetterSpacing: `${classNameLetterSpacing}em`,
    bodyFontSize,
    bodyLineHeight: `${bodyLineHeight}px`,
    footerFontSize,
    footerSmallCaps,
    footerTextTransform,
  }

  const cards: Omit<SRDCardProps, keyof typeof styleOverrides>[] = [
    {
      name: 'Syndicate',
      className: 'Rogue',
      tier: 'Foundation',
      spellcastTrait: 'Finesse',
      bannerColor: '#BD0C70',
      domainIcons: ['midnight', 'grace'],
      feats: [
        { name: 'Well-Connected', text: 'When you arrive in a prominent town or environment, you know somebody who calls this place home. Give them a name, note how you think they could be useful, and choose one fact from the following list:' },
      ],
      featList: [
        'They owe me a favor, but they\'ll be hard to find.',
        'They\'re going to ask for something in exchange.',
        'They\'re always in a great deal of trouble.',
        'We used to be together. It\'s a long story.',
        'We didn\'t part on great terms.',
      ],
      illustrationSrc: `${basePath}images/cards/subclass/syndicate.png`,
    },
    {
      name: 'School of War',
      className: 'Wizard',
      tier: 'Foundation',
      spellcastTrait: 'Knowledge',
      bannerColor: '#BEA228',
      domainIcons: ['codex', 'splendor'],
      feats: [
        { name: 'Battlemage', text: 'You\'ve focused your studies on becoming an unconquerable force on the battlefield. Gain an additional Hit Point slot.' },
        { name: 'Face Your Fear', text: 'When you succeed with Fear on an attack roll, you deal an extra 1d10 magic damage.' },
      ],
      illustrationSrc: `${basePath}images/cards/subclass/school-of-war.png`,
    },
    {
      name: 'School of Knowledge',
      className: 'Wizard',
      tier: 'Foundation',
      spellcastTrait: 'Knowledge',
      bannerColor: '#BEA228',
      domainIcons: ['codex', 'splendor'],
      feats: [
        { name: 'Prepared', text: 'Take an additional domain card of your level or lower from a domain you have access to.' },
        { name: 'Adept', text: 'When you Utilize an Experience, you can mark a Stress instead of spending a Hope. If you do, double your Experience modifier for that roll.' },
      ],
      illustrationSrc: `${basePath}images/cards/subclass/school-of-knowledge.png`,
    },
    {
      name: 'Call of the Slayer',
      className: 'Warrior',
      tier: 'Foundation',
      bannerColor: '#A3A9A8',
      domainIcons: ['blade', 'bone'],
      feats: [
        { name: 'Slayer', text: 'You gain a pool of Slayer Dice (d6s) with a number equal to your Proficiency. When you or an ally within close range makes a damage roll, you can spend a Slayer Die and add it to the damage roll.' },
        { text: 'At the end of each session, clear any unspent Slayer Dice on this card and gain a Hope per die cleared.' },
      ],
      illustrationSrc: `${basePath}images/cards/subclass/call-of-the-slayer.png`,
    },
    {
      name: 'Divine Wielder',
      className: 'Seraph',
      tier: 'Foundation',
      spellcastTrait: 'Strength',
      bannerColor: '#EB5B00',
      domainIcons: ['splendor', 'grace'],
      feats: [
        { name: 'Spirit Weapon', text: 'When you make an attack with a melee weapon, you can send it flying up to your weapon range to attack your target, and then it flies back to your hand.' },
        { name: 'Sparing Touch', text: 'Once per long rest, touch a creature and clear 2 Hit Points or 2 Stress from them.' },
      ],
      illustrationSrc: `${basePath}images/cards/subclass/divine-wielder.png`,
    },
  ]

  const [copied, setCopied] = useState(false)

  const copyConfig = () => {
    const config = {
      titleFontSize,
      titleLineHeight: `${titleLineHeight}px`,
      titleLetterSpacing: `${titleLetterSpacing}em`,
      titleSmallCaps,
      titleTextTransform,
      classNameFontSize,
      classNameLetterSpacing: `${classNameLetterSpacing}em`,
      bodyFontSize,
      bodyLineHeight: `${bodyLineHeight}px`,
      footerFontSize,
    }
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const resetAll = () => {
    setTitleFontSize(DEFAULTS.titleFontSize)
    setTitleLineHeight(32)
    setTitleLetterSpacing(DEFAULTS.titleLetterSpacing)
    setTitleSmallCaps(DEFAULTS.titleSmallCaps)
    setTitleTextTransform(DEFAULTS.titleTextTransform)
    setClassNameFontSize(DEFAULTS.classNameFontSize)
    setClassNameLetterSpacing(DEFAULTS.classNameLetterSpacing)
    setBodyFontSize(DEFAULTS.bodyFontSize)
    setBodyLineHeight(DEFAULTS.bodyLineHeight)
    setFooterFontSize(DEFAULTS.footerFontSize)
    setFooterSmallCaps(DEFAULTS.footerSmallCaps)
    setFooterTextTransform(DEFAULTS.footerTextTransform)
  }

  return (
    <div
      className="h-screen w-full flex overflow-hidden"
      style={{ background: '#0a0e14', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Controls panel */}
      <div
        className="flex flex-col gap-1.5 p-5 overflow-y-auto flex-shrink-0"
        style={{ width: 240, background: '#111318', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-white/80">Card Tweaker</span>
          <div className="flex gap-2">
            <button
              onClick={copyConfig}
              className="text-[10px] transition-colors"
              style={{ color: copied ? '#22c55e' : 'rgba(212,160,83,0.6)' }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={resetAll}
              className="text-[10px] text-amber-500/60 hover:text-amber-500 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <SectionLabel>Title</SectionLabel>
        <Slider label="Font size" value={titleFontSize} onChange={setTitleFontSize} min={20} max={48} unit="px" />
        <Slider label="Line height" value={titleLineHeight} onChange={setTitleLineHeight} min={20} max={56} unit="px" />
        <Slider label="Letter spacing" value={titleLetterSpacing} onChange={setTitleLetterSpacing} min={-0.1} max={0.2} step={0.005} unit="em" />
        <Toggle label="Small caps" value={titleSmallCaps} onChange={setTitleSmallCaps} />
        <Select
          label="Text transform"
          value={titleTextTransform}
          onChange={setTitleTextTransform}
          options={[
            { value: 'none', label: 'None' },
            { value: 'uppercase', label: 'UPPERCASE' },
            { value: 'lowercase', label: 'lowercase' },
            { value: 'capitalize', label: 'Capitalize' },
          ]}
        />

        <SectionLabel>Class Name</SectionLabel>
        <Slider label="Font size" value={classNameFontSize} onChange={setClassNameFontSize} min={8} max={20} unit="px" />
        <Slider label="Letter spacing" value={classNameLetterSpacing} onChange={setClassNameLetterSpacing} min={0} max={0.2} step={0.005} unit="em" />

        <SectionLabel>Body</SectionLabel>
        <Slider label="Font size" value={bodyFontSize} onChange={setBodyFontSize} min={10} max={20} unit="px" />
        <Slider label="Line height" value={bodyLineHeight} onChange={setBodyLineHeight} min={12} max={28} unit="px" />

        <SectionLabel>Footer</SectionLabel>
        <Slider label="Font size" value={footerFontSize} onChange={setFooterFontSize} min={8} max={20} unit="px" />
        <Toggle label="Small caps" value={footerSmallCaps} onChange={setFooterSmallCaps} />
        <Select
          label="Text transform"
          value={footerTextTransform}
          onChange={setFooterTextTransform}
          options={[
            { value: 'none', label: 'None' },
            { value: 'uppercase', label: 'UPPERCASE' },
            { value: 'lowercase', label: 'lowercase' },
            { value: 'capitalize', label: 'Capitalize' },
          ]}
        />
      </div>

      {/* Cards column */}
      <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {/* All cards */}
        <div className="flex flex-col items-center gap-8 py-8">
          {cards.map((card) => (
            <div key={card.name} className="flex-shrink-0">
              <SRDCard {...card} {...styleOverrides} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
