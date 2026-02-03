import { useState, useEffect } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Counter } from '../components/ui/Counter'
import { Sheet } from '../components/ui/Sheet'
import { Markdown } from '../components/ui/Markdown'
import { DomainCard } from '../components/character/DomainCard'
import { wizard, ancestries, communities, wizardLevel1Cards, schoolOfKnowledge, leatherArmor } from '../data/srd'

// Helper to convert hex to RGB string
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
  }
  return '255, 255, 255'
}

// Helper to convert RGB string to hex
function rgbToHex(rgb: string): string {
  const parts = rgb.split(',').map(p => parseInt(p.trim()))
  if (parts.length === 3) {
    return '#' + parts.map(p => p.toString(16).padStart(2, '0')).join('')
  }
  return '#ffffff'
}

// Default values for all glass parameters
const DEFAULT_GLASS_PARAMS = {
  // Colors
  specColor: '255, 255, 255',
  shadowColor: '0, 0, 0',
  // Specular highlight
  specPrimary: 0.375,
  specSecondary: 0.09,
  // Shadow
  shadowPrimary: 0.1,
  shadowSecondary: 0.05,
  // Drop shadow
  dropShadow: 0.25,
  // Blur & saturation
  blur: 2,
  saturate: 150,
  // Gradient opacities
  gradTop: 0.05,
  gradMid: 0.02,
  gradBottom: 0.01,
}

// Preset configurations
const GLASS_PRESETS = {
  default: {
    name: 'Default',
    params: { ...DEFAULT_GLASS_PARAMS },
  },
  warm: {
    name: 'Warm',
    params: {
      ...DEFAULT_GLASS_PARAMS,
      specColor: '219, 197, 147', // #DBC593
      shadowColor: '27, 9, 0',    // #1B0900
    },
  },
  ice: {
    name: 'Ice',
    params: {
      ...DEFAULT_GLASS_PARAMS,
      specColor: '200, 230, 255', // light blue
      shadowColor: '20, 40, 80',  // dark blue
      blur: 3,
      saturate: 180,
    },
  },
  neon: {
    name: 'Neon',
    params: {
      ...DEFAULT_GLASS_PARAMS,
      specColor: '255, 100, 255', // magenta
      shadowColor: '50, 0, 80',   // purple
      specPrimary: 0.5,
      specSecondary: 0.15,
    },
  },
}

type GlassPreset = keyof typeof GLASS_PRESETS

// Background presets
type BackgroundPreset = 'purple' | 'dark' | 'blue' | 'green' | 'warm' | 'neutral' | 'image-forest' | 'image-abstract'

const BACKGROUND_PRESETS: Record<BackgroundPreset, { name: string; className: string; style?: React.CSSProperties }> = {
  purple: {
    name: 'Purple',
    className: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
  },
  dark: {
    name: 'Dark',
    className: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
  },
  blue: {
    name: 'Blue',
    className: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
  },
  green: {
    name: 'Green',
    className: 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900',
  },
  warm: {
    name: 'Warm',
    className: 'bg-gradient-to-br from-amber-950 via-orange-950 to-stone-950',
  },
  neutral: {
    name: 'Neutral',
    className: 'bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900',
  },
  'image-forest': {
    name: 'Forest',
    className: '',
    style: {
      backgroundImage: 'url("https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  },
  'image-abstract': {
    name: 'Abstract',
    className: '',
    style: {
      backgroundImage: 'url("https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  },
}

// Slider component for controls
function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  unit = ''
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/50">{label}</span>
        <span className="text-white/70 font-mono">{value.toFixed(step < 1 ? 2 : 0)}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-md"
      />
    </div>
  )
}

// Color picker component
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string // RGB string like "255, 255, 255"
  onChange: (v: string) => void
}) {
  const hexValue = rgbToHex(value)

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/50">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hexValue}
          onChange={(e) => onChange(hexToRgb(e.target.value))}
          className="w-8 h-6 rounded cursor-pointer border border-white/20 bg-transparent"
        />
        <span className="text-xs text-white/40 font-mono w-16">{hexValue}</span>
      </div>
    </div>
  )
}

export function ComponentsLibrary() {
  const [counterValue, setCounterValue] = useState(3)
  const [slotValue, setSlotValue] = useState(2)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [bgPreset, setBgPreset] = useState<BackgroundPreset>('purple')
  const [showControls, setShowControls] = useState(true)
  const [activePreset, setActivePreset] = useState<GlassPreset>('default')

  // Glass parameters state
  const [glassParams, setGlassParams] = useState(DEFAULT_GLASS_PARAMS)

  // Update a single parameter
  const updateParam = <K extends keyof typeof DEFAULT_GLASS_PARAMS>(
    key: K,
    value: typeof DEFAULT_GLASS_PARAMS[K]
  ) => {
    setGlassParams(prev => ({ ...prev, [key]: value }))
    setActivePreset('default') // Clear preset when manually editing
  }

  // Apply a preset
  const applyPreset = (preset: GlassPreset) => {
    setGlassParams(GLASS_PRESETS[preset].params)
    setActivePreset(preset)
  }

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--lg-spec-color', glassParams.specColor)
    root.style.setProperty('--lg-shadow-color', glassParams.shadowColor)
    root.style.setProperty('--lg-spec-primary', glassParams.specPrimary.toString())
    root.style.setProperty('--lg-spec-secondary', glassParams.specSecondary.toString())
    root.style.setProperty('--lg-shadow-primary', glassParams.shadowPrimary.toString())
    root.style.setProperty('--lg-shadow-secondary', glassParams.shadowSecondary.toString())
    root.style.setProperty('--lg-drop-shadow', glassParams.dropShadow.toString())
    root.style.setProperty('--lg-blur', `${glassParams.blur}px`)
    root.style.setProperty('--lg-saturate', `${glassParams.saturate}%`)
    root.style.setProperty('--lg-grad-top', glassParams.gradTop.toString())
    root.style.setProperty('--lg-grad-mid', glassParams.gradMid.toString())
    root.style.setProperty('--lg-grad-bottom', glassParams.gradBottom.toString())

    return () => {
      // Clean up on unmount
      const props = [
        '--lg-spec-color', '--lg-shadow-color', '--lg-spec-primary', '--lg-spec-secondary',
        '--lg-shadow-primary', '--lg-shadow-secondary', '--lg-drop-shadow', '--lg-blur',
        '--lg-saturate', '--lg-grad-top', '--lg-grad-mid', '--lg-grad-bottom'
      ]
      props.forEach(prop => root.style.removeProperty(prop))
    }
  }, [glassParams])

  // Get real data samples
  const sampleAncestry = ancestries.find(a => a.name === 'Elf') || ancestries[0]
  const sampleCommunity = communities.find(c => c.name === 'Highborne') || communities[0]
  const sampleDomainCard = { ...wizardLevel1Cards[0], used: false }
  const sampleUsedCard = { ...wizardLevel1Cards[1], used: true }

  // Sample traits (from suggested wizard build)
  const sampleTraits = {
    agility: 0,
    strength: -1,
    finesse: 1,
    instinct: 0,
    presence: 1,
    knowledge: 2,
  }

  const formatTrait = (value: number) => (value > 0 ? `+${value}` : value.toString())

  const bgConfig = BACKGROUND_PRESETS[bgPreset]

  return (
    <div
      className={`min-h-screen h-screen overflow-auto p-6 pb-24 ${bgConfig.className}`}
      style={bgConfig.style}
    >
      {/* Floating Controls Panel */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowControls(!showControls)}
          className="lg-button mb-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {showControls && (
          <div className="glass-strong rounded-2xl p-4 w-72 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-xs uppercase tracking-wide text-white/40">Liquid Glass Controls</h3>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-xs text-white/50">Presets</span>
              <div className="grid grid-cols-4 gap-1">
                {(Object.keys(GLASS_PRESETS) as GlassPreset[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => applyPreset(preset)}
                    className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activePreset === preset
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {GLASS_PRESETS[preset].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-xs text-white/50 uppercase tracking-wide">Colors</span>
              <ColorPicker
                label="Specular"
                value={glassParams.specColor}
                onChange={(v) => updateParam('specColor', v)}
              />
              <ColorPicker
                label="Shadow"
                value={glassParams.shadowColor}
                onChange={(v) => updateParam('shadowColor', v)}
              />
            </div>

            {/* Specular Highlight */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-xs text-white/50 uppercase tracking-wide">Specular Highlight</span>
              <Slider
                label="Primary"
                value={glassParams.specPrimary}
                onChange={(v) => updateParam('specPrimary', v)}
                min={0}
                max={1}
              />
              <Slider
                label="Secondary"
                value={glassParams.specSecondary}
                onChange={(v) => updateParam('specSecondary', v)}
                min={0}
                max={0.5}
              />
            </div>

            {/* Shadow */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-xs text-white/50 uppercase tracking-wide">Shadow</span>
              <Slider
                label="Primary"
                value={glassParams.shadowPrimary}
                onChange={(v) => updateParam('shadowPrimary', v)}
                min={0}
                max={0.5}
              />
              <Slider
                label="Secondary"
                value={glassParams.shadowSecondary}
                onChange={(v) => updateParam('shadowSecondary', v)}
                min={0}
                max={0.3}
              />
              <Slider
                label="Drop Shadow"
                value={glassParams.dropShadow}
                onChange={(v) => updateParam('dropShadow', v)}
                min={0}
                max={1}
              />
            </div>

            {/* Effects */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-xs text-white/50 uppercase tracking-wide">Effects</span>
              <Slider
                label="Blur"
                value={glassParams.blur}
                onChange={(v) => updateParam('blur', v)}
                min={0}
                max={20}
                step={1}
                unit="px"
              />
              <Slider
                label="Saturation"
                value={glassParams.saturate}
                onChange={(v) => updateParam('saturate', v)}
                min={100}
                max={300}
                step={10}
                unit="%"
              />
            </div>

            {/* Gradient */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-xs text-white/50 uppercase tracking-wide">Gradient</span>
              <Slider
                label="Top"
                value={glassParams.gradTop}
                onChange={(v) => updateParam('gradTop', v)}
                min={0}
                max={0.2}
              />
              <Slider
                label="Middle"
                value={glassParams.gradMid}
                onChange={(v) => updateParam('gradMid', v)}
                min={0}
                max={0.1}
              />
              <Slider
                label="Bottom"
                value={glassParams.gradBottom}
                onChange={(v) => updateParam('gradBottom', v)}
                min={0}
                max={0.1}
              />
            </div>

            {/* Background Presets */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs text-white/50 uppercase tracking-wide">Background</span>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(BACKGROUND_PRESETS) as BackgroundPreset[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setBgPreset(preset)}
                    title={BACKGROUND_PRESETS[preset].name}
                    className={`aspect-square rounded-lg transition-all ${
                      bgPreset === preset
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
                        : ''
                    } ${BACKGROUND_PRESETS[preset].className || 'bg-gray-500'}`}
                    style={BACKGROUND_PRESETS[preset].style ? {
                      ...BACKGROUND_PRESETS[preset].style,
                      backgroundSize: 'cover',
                    } : undefined}
                  />
                ))}
              </div>
              <span className="text-xs text-white/30">{BACKGROUND_PRESETS[bgPreset].name}</span>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => applyPreset('default')}
              className="w-full py-2 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center pt-8">
          <h1 className="text-3xl font-bold text-white mb-2">Liquid Glass</h1>
          <p className="text-white/50">Design System Components</p>
          <p className="text-xs text-white/30 mt-2">
            {activePreset !== 'default' ? `${GLASS_PRESETS[activePreset].name} preset` : 'Custom settings'} on {BACKGROUND_PRESETS[bgPreset].name} background
          </p>
        </header>

        {/* ============ DESIGN PHILOSOPHY ============ */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Design Philosophy</h2>
            <p className="text-sm text-white/50 mt-1">Apple's Liquid Glass aesthetic</p>
          </div>

          <Card variant="glass" padding="md">
            <div className="space-y-3 text-sm text-white/70">
              <p><span className="text-white font-medium">Specular highlights</span> along the top edge simulate light reflection</p>
              <p><span className="text-white font-medium">Subtle shadows</span> along the bottom edge create depth</p>
              <p><span className="text-white font-medium">Background gradient</span> from light (top) to dark (bottom)</p>
              <p><span className="text-white font-medium">Soft blur</span> with saturation boost for frosted glass effect</p>
              <p><span className="text-white font-medium">Drop shadow</span> for elevation and floating appearance</p>
            </div>
          </Card>

          {/* Visual Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Visual Breakdown</h3>
            <div className="relative h-32 glass rounded-[var(--lg-card-radius)] flex items-center justify-center">
              <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              <span className="absolute top-2 text-[10px] text-white/40 uppercase tracking-wide">Specular Highlight</span>
              <span className="text-white/50">Content Area</span>
              <span className="absolute bottom-2 text-[10px] text-white/30 uppercase tracking-wide">Bottom Shadow + Drop Shadow</span>
            </div>
          </div>
        </section>

        {/* ============ ATOMS ============ */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Atoms</h2>
            <p className="text-sm text-white/50 mt-1">Basic building blocks</p>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Typography</h3>
            <Card variant="glass" padding="md">
              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-wide text-white/40 block mb-1">Label (Section Header)</span>
                  <code className="text-xs text-white/30">text-xs uppercase tracking-wide text-white/40</code>
                </div>
                <div>
                  <span className="text-2xl font-semibold text-white">+2</span>
                  <span className="text-xs text-white/30 ml-3">Value: text-2xl font-semibold text-white</span>
                </div>
                <div>
                  <span className="text-base font-medium text-white">{wizard.class_feats[0].name}</span>
                  <span className="text-xs text-white/30 ml-3">Title: text-base font-medium text-white</span>
                </div>
                <div>
                  <span className="text-sm text-white/50">Supporting text and descriptions</span>
                  <span className="text-xs text-white/30 ml-3">text-sm text-white/50</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Button</h3>
            <Card variant="glass" padding="md">
              <div className="space-y-6">
                {/* Liquid Glass Buttons */}
                <div>
                  <span className="text-xs text-white/40 mb-3 block">Liquid Glass (Pill)</span>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="glass" size="md">Glass</Button>
                    <Button variant="glass-primary" size="md">Glass Strong</Button>
                    <Button variant="glass" size="md" disabled>Disabled</Button>
                  </div>
                </div>

                {/* Circle Buttons */}
                <div>
                  <span className="text-xs text-white/40 mb-3 block">Liquid Glass Circle (lg-button)</span>
                  <div className="flex items-center gap-4">
                    <button className="lg-button">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="lg-button">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <button className="lg-button" disabled>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Solid Buttons */}
                <div>
                  <span className="text-xs text-white/40 mb-3 block">Solid (Non-glass)</span>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" size="md">Primary</Button>
                    <Button variant="secondary" size="md">Secondary</Button>
                    <Button variant="ghost" size="md">Ghost</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Separators */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Separators</h3>
            <Card variant="glass" padding="md">
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-white/40 mb-2 block">Divider Line (divide-y divide-white/10)</span>
                  <div className="divide-y divide-white/10">
                    <div className="py-3 text-white/70">Item above line</div>
                    <div className="py-3 text-white/70">Item below line</div>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-white/40 mb-2 block">Border Separator (border-t border-white/10)</span>
                  <div className="border-t border-white/10 pt-3 text-white/70">Content with top border</div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ============ MOLECULES ============ */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Molecules</h2>
            <p className="text-sm text-white/50 mt-1">Combinations of atoms</p>
          </div>

          {/* Card */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Card</h3>
            <div className="space-y-3">
              <Card variant="glass" padding="md">
                <span className="text-xs uppercase tracking-wide text-white/40">Glass Card</span>
                <p className="text-white mt-2">Standard glass card with padding</p>
              </Card>
              <Card variant="glass-strong" padding="md">
                <span className="text-xs uppercase tracking-wide text-white/40">Glass Strong</span>
                <p className="text-white mt-2">Higher opacity glass variant</p>
              </Card>
              <Card variant="solid" padding="md">
                <span className="text-xs uppercase tracking-wide text-gray-500">Solid Card</span>
                <p className="text-gray-900 mt-2">White background for light contexts</p>
              </Card>
            </div>
          </div>

          {/* Counter */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Counter</h3>
            <Card variant="glass" padding="md">
              <div className="space-y-6">
                <div>
                  <Counter
                    value={counterValue}
                    onChange={setCounterValue}
                    label="Hope"
                    variant="glass"
                  />
                </div>
                <div>
                  <Counter
                    value={slotValue}
                    onChange={setSlotValue}
                    label="HP (Slot Style)"
                    showSlots
                    slotCount={6}
                    variant="glass"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sheet */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Sheet (Bottom Drawer)</h3>
            <Card variant="glass" padding="md">
              <Button variant="glass" onClick={() => setSheetOpen(true)}>
                Open Sheet
              </Button>
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title={sampleDomainCard.name}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/50">
                      {sampleDomainCard.domain}
                    </span>
                    <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-white/70">
                      {sampleDomainCard.type}
                    </span>
                    <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-white/70">
                      Level {sampleDomainCard.level}
                    </span>
                  </div>
                  <div className="text-white/80">
                    <Markdown>{sampleDomainCard.text}</Markdown>
                  </div>
                  <Button variant="glass" onClick={() => setSheetOpen(false)}>
                    Close
                  </Button>
                </div>
              </Sheet>
            </Card>
          </div>

          {/* Markdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Markdown Renderer</h3>
            <Card variant="glass" padding="md">
              <Markdown>{schoolOfKnowledge.foundations[0].text}</Markdown>
            </Card>
          </div>
        </section>

        {/* ============ LIST PATTERNS ============ */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xs uppercase tracking-widest text-white/40">List Patterns</h2>
            <p className="text-sm text-white/50 mt-1">Content organization without nested boxes</p>
          </div>

          {/* Key-Value Row */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Key-Value List</h3>
            <Card variant="glass" padding="md">
              <h4 className="text-xs uppercase tracking-wide text-white/40 mb-4">Character Info</h4>
              <div className="divide-y divide-white/10">
                <div className="py-3 first:pt-0 flex justify-between items-center">
                  <span className="text-sm text-white/50">Ancestry</span>
                  <span className="text-sm font-medium text-white">{sampleAncestry.name}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-sm text-white/50">Community</span>
                  <span className="text-sm font-medium text-white">{sampleCommunity.name}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-sm text-white/50">Class</span>
                  <span className="text-sm font-medium text-white">Wizard</span>
                </div>
                <div className="py-3 last:pb-0 flex justify-between items-center">
                  <span className="text-sm text-white/50">Subclass</span>
                  <span className="text-sm font-medium text-white">School of Knowledge</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Stat Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Stat Grid</h3>
            <Card variant="glass" padding="md">
              <h4 className="text-xs uppercase tracking-wide text-white/40 mb-4">Traits</h4>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(sampleTraits).map(([trait, value]) => (
                  <div key={trait} className="text-center">
                    <span className="text-xs uppercase tracking-wide text-white/40 block mb-1">
                      {trait}
                    </span>
                    <span className="text-2xl font-semibold text-white">
                      {formatTrait(value)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Feature/Feat List */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Feature List</h3>
            <Card variant="glass" padding="md">
              <h4 className="text-xs uppercase tracking-wide text-white/40 mb-4">Class Features</h4>
              <div className="space-y-5">
                {wizard.class_feats.slice(0, 2).map((feat) => (
                  <div key={feat.name}>
                    <h5 className="font-medium text-white">{feat.name}</h5>
                    <p className="text-sm text-white/50 mt-1.5">{feat.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Ancestry Feats */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Ancestry Feats</h3>
            <Card variant="glass" padding="md">
              <h4 className="text-xs uppercase tracking-wide text-white/40 mb-4">
                Ancestry: {sampleAncestry.name}
              </h4>
              <div className="space-y-5">
                {sampleAncestry.feats.map((feat) => (
                  <div key={feat.name}>
                    <h5 className="font-medium text-white">{feat.name}</h5>
                    <p className="text-sm text-white/50 mt-1.5">{feat.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Equipment Item */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Equipment Item</h3>
            <Card variant="glass" padding="md">
              <h4 className="text-xs uppercase tracking-wide text-white/40 mb-4">Armor</h4>
              <h5 className="font-medium text-white mb-3">{leatherArmor?.name}</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/50">Armor Score</span>
                  <p className="font-medium text-white mt-0.5">{leatherArmor?.base_score}</p>
                </div>
                <div>
                  <span className="text-white/50">Thresholds</span>
                  <p className="font-medium text-white mt-0.5">{leatherArmor?.base_thresholds}</p>
                </div>
              </div>
              {leatherArmor?.feat_text && (
                <p className="text-sm text-white/50 mt-3">{leatherArmor.feat_text}</p>
              )}
            </Card>
          </div>

          {/* Weapon List */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Weapon List</h3>
            <Card variant="glass" padding="md">
              <h4 className="text-xs uppercase tracking-wide text-white/40 mb-4">Weapons</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-white">{wizard.suggested_primary}</h5>
                    <span className="text-xs uppercase tracking-wide text-white/40">Primary</span>
                  </div>
                  <p className="text-sm text-white/50 mt-1">Wizard's main weapon</p>
                </div>
                {wizard.suggested_secondary && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-white">{wizard.suggested_secondary}</h5>
                      <span className="text-xs uppercase tracking-wide text-white/40">Secondary</span>
                    </div>
                    <p className="text-sm text-white/50 mt-1">Backup weapon</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Resource Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Resource Grid</h3>
            <Card variant="glass" padding="md">
              <h4 className="text-xs uppercase tracking-wide text-white/40 mb-4">Resources</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <span className="text-xs uppercase tracking-wide text-white/40 block">Gold</span>
                  <p className="text-2xl font-semibold text-white mt-1">1</p>
                  <span className="text-xs text-white/50">handful</span>
                </div>
                <div className="text-center">
                  <span className="text-xs uppercase tracking-wide text-white/40 block">Supplies</span>
                  <p className="text-2xl font-semibold text-white mt-1">—</p>
                  <span className="text-xs text-white/50">basic</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Reference */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Quick Reference</h3>
            <Card variant="glass" padding="md">
              <h4 className="text-xs uppercase tracking-wide text-white/40 mb-4">Dice Mechanics</h4>
              <div className="divide-y divide-white/10 text-sm">
                <div className="py-3 first:pt-0 flex justify-between items-center">
                  <span className="font-medium text-white">Roll with Hope</span>
                  <span className="text-white/50">Hope die {'>'} Fear die</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="font-medium text-white">Roll with Fear</span>
                  <span className="text-white/50">Fear die {'>'} Hope die</span>
                </div>
                <div className="py-3 last:pb-0 flex justify-between items-center">
                  <span className="font-medium text-white">Critical Success</span>
                  <span className="text-white/50">Hope die = Fear die</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ============ ORGANISMS ============ */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Organisms</h2>
            <p className="text-sm text-white/50 mt-1">Complex interactive components</p>
          </div>

          {/* Domain Card */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Domain Card (Available)</h3>
            <DomainCard card={sampleDomainCard} />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Domain Card (Used)</h3>
            <DomainCard card={sampleUsedCard} />
          </div>

          {/* Quick Stats Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Quick Stats (2-up)</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card variant="glass" padding="md">
                <div className="text-center">
                  <span className="text-xs uppercase tracking-wide text-white/40">Evasion</span>
                  <p className="text-2xl font-semibold text-white">{wizard.evasion}</p>
                </div>
              </Card>
              <Card variant="glass" padding="md">
                <div className="text-center">
                  <span className="text-xs uppercase tracking-wide text-white/40">Proficiency</span>
                  <p className="text-2xl font-semibold text-white">d8</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ============ PATTERNS TO AVOID ============ */}
        <section className="space-y-6">
          <div className="border-b border-red-500/30 pb-2">
            <h2 className="text-xs uppercase tracking-widest text-red-400/70">Patterns to Avoid</h2>
            <p className="text-sm text-white/50 mt-1">Anti-patterns identified</p>
          </div>

          <Card variant="glass" padding="md">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wide text-red-400/70 block mb-2">❌ Nested Boxes</span>
                <div className="p-3 bg-white/5 rounded-xl border border-red-500/30">
                  <h5 className="font-medium text-white">{wizard.class_feats[0].name}</h5>
                  <p className="text-sm text-white/50 mt-1">{wizard.class_feats[0].text}</p>
                </div>
                <p className="text-xs text-white/30 mt-2">Creates visual clutter — use typography/whitespace instead</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wide text-red-400/70 block mb-2">❌ Pill Badges</span>
                <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/50 border border-red-500/30">
                  Primary
                </span>
                <p className="text-xs text-white/30 mt-2">Use uppercase labels instead: <span className="text-xs uppercase tracking-wide text-white/40">Primary</span></p>
              </div>
            </div>
          </Card>
        </section>

        {/* ============ LIQUID GLASS TOKENS ============ */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Liquid Glass Tokens</h2>
            <p className="text-sm text-white/50 mt-1">CSS custom properties</p>
          </div>

          <Card variant="glass" padding="md">
            <h4 className="text-xs uppercase tracking-wide text-white/40 mb-4">Effect Values</h4>
            <div className="divide-y divide-white/10 text-sm">
              <div className="py-3 first:pt-0 flex justify-between">
                <span className="text-white/50">--lg-blur</span>
                <code className="text-white/70">2px</code>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-white/50">--lg-saturate</span>
                <code className="text-white/70">150%</code>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-white/50">--lg-spec-primary</span>
                <code className="text-white/70">0.375</code>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-white/50">--lg-spec-secondary</span>
                <code className="text-white/70">0.09</code>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-white/50">--lg-drop-shadow</span>
                <code className="text-white/70">0.25</code>
              </div>
              <div className="py-3 last:pb-0 flex justify-between">
                <span className="text-white/50">--lg-card-radius</span>
                <code className="text-white/70">16px</code>
              </div>
            </div>
          </Card>

          <Card variant="glass" padding="md">
            <h4 className="text-xs uppercase tracking-wide text-white/40 mb-4">Sizing</h4>
            <div className="divide-y divide-white/10 text-sm">
              <div className="py-3 first:pt-0 flex justify-between">
                <span className="text-white/50">--lg-button-size</span>
                <code className="text-white/70">48px</code>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-white/50">--lg-pill-height</span>
                <code className="text-white/70">56px</code>
              </div>
              <div className="py-3 last:pb-0 flex justify-between">
                <span className="text-white/50">--lg-input-height</span>
                <code className="text-white/70">48px</code>
              </div>
            </div>
          </Card>
        </section>

        {/* ============ SPACING TOKENS ============ */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xs uppercase tracking-widest text-white/40">Spacing Tokens</h2>
            <p className="text-sm text-white/50 mt-1">Consistent spacing values</p>
          </div>

          <Card variant="glass" padding="md">
            <div className="divide-y divide-white/10 text-sm">
              <div className="py-3 first:pt-0 flex justify-between">
                <span className="text-white/50">Between label and value</span>
                <code className="text-white/70">mt-1 / space-y-1</code>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-white/50">Between title and description</span>
                <code className="text-white/70">mt-1.5 / mt-2</code>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-white/50">Between list items</span>
                <code className="text-white/70">space-y-4 / space-y-5</code>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-white/50">Section header margin</span>
                <code className="text-white/70">mb-4</code>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-white/50">Grid gaps</span>
                <code className="text-white/70">gap-4 / gap-6</code>
              </div>
              <div className="py-3 last:pb-0 flex justify-between">
                <span className="text-white/50">Card padding</span>
                <code className="text-white/70">p-4 (padding="md")</code>
              </div>
            </div>
          </Card>
        </section>

        {/* Back link */}
        <div className="text-center pt-8 pb-12">
          <a href="/" className="text-white/50 hover:text-white text-sm">← Back to App</a>
        </div>
      </div>
    </div>
  )
}
