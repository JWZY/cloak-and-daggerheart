// Visual effect tokens for the design system
// Liquid Glass parameters extracted from index.css

/**
 * Liquid Glass blur and saturation values
 */
export const liquidGlassBlur = {
  default: '2px',
  strong: '4px',
} as const

export const liquidGlassSaturate = {
  default: '150%',
  strong: '160%',
} as const

/**
 * Liquid Glass gradient opacities
 */
export const liquidGlassGradient = {
  topOpacity: 0.05,
  midOpacity: 0.02,
  bottomOpacity: 0.01,
} as const

/**
 * Liquid Glass specular highlight values
 */
export const liquidGlassSpecular = {
  primary: 0.375,
  secondary: 0.09,
  hoverPrimary: 0.45,
  hoverSecondary: 0.12,
} as const

/**
 * Liquid Glass shadow values
 */
export const liquidGlassShadow = {
  primary: 0.1,
  secondary: 0.05,
  dropShadow: 0.25,
  dropShadowHover: 0.3,
} as const

/**
 * Sizing tokens for Liquid Glass components
 */
export const liquidGlassSizing = {
  buttonSize: '48px',
  pillHeight: '56px',
  inputHeight: '48px',
  cardRadius: '16px',
} as const

/**
 * Build the Liquid Glass background gradient CSS
 */
export function buildGlassGradient(
  specularColor = '255, 255, 255',
  shadowColor = '0, 0, 0'
): string {
  return `linear-gradient(
    180deg,
    rgba(${specularColor}, ${liquidGlassGradient.topOpacity}) 0%,
    rgba(${specularColor}, ${liquidGlassGradient.midOpacity}) 50%,
    rgba(${shadowColor}, ${liquidGlassGradient.bottomOpacity}) 100%
  )`
}

/**
 * Build the Liquid Glass box-shadow CSS
 */
export function buildGlassBoxShadow(
  specularColor = '255, 255, 255',
  shadowColor = '0, 0, 0',
  hover = false
): string {
  const spec = hover ? liquidGlassSpecular.hoverPrimary : liquidGlassSpecular.primary
  const specSecondary = hover ? liquidGlassSpecular.hoverSecondary : liquidGlassSpecular.secondary
  const drop = hover ? liquidGlassShadow.dropShadowHover : liquidGlassShadow.dropShadow

  return `
    inset 0 1px 1px rgba(${specularColor}, ${spec}),
    inset 0 1.5px 3px rgba(${specularColor}, ${specSecondary}),
    inset 0 -1px 1px rgba(${shadowColor}, ${liquidGlassShadow.primary}),
    inset 0 -1.5px 3px rgba(${shadowColor}, ${liquidGlassShadow.secondary}),
    0 ${hover ? '6px 20px' : '4px 16px'} rgba(${shadowColor}, ${drop})
  `.trim()
}
