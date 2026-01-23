import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Counter } from '../components/ui/Counter'
import { Sheet } from '../components/ui/Sheet'
import { Markdown } from '../components/ui/Markdown'
import { DomainCard } from '../components/character/DomainCard'
import { wizard, ancestries, communities, wizardLevel1Cards, schoolOfKnowledge, leatherArmor } from '../data/srd'

export function ComponentsLibrary() {
  const [counterValue, setCounterValue] = useState(3)
  const [slotValue, setSlotValue] = useState(2)
  const [sheetOpen, setSheetOpen] = useState(false)

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

  return (
    <div className="min-h-screen h-screen overflow-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center pt-8">
          <h1 className="text-3xl font-bold text-white mb-2">Liquid Glass</h1>
          <p className="text-white/50">Design System Components</p>
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
