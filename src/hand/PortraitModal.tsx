import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { warmGlass, RADIUS_MENU } from '../design-system/tokens/surfaces'
import { springs } from '../design-system/tokens/animations'
import { typeSubtitle } from '../ui/typography'
import { GameButton } from '../ui/GameButton'
import { useCharacterStore } from '../store/character-store'
import { useIsDesktop } from './useIsDesktop'
import type { Character } from '../types/character'

interface PortraitModalProps {
  character: Character
  fallbackImage?: string
  onClose: () => void
}

const MAX_SIZE = 256
const JPEG_QUALITY = 0.8

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height

        if (w > MAX_SIZE || h > MAX_SIZE) {
          const ratio = Math.min(MAX_SIZE / w, MAX_SIZE / h)
          w = Math.round(w * ratio)
          h = Math.round(h * ratio)
        }

        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context unavailable'))
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function PortraitModal({ character, fallbackImage, onClose }: PortraitModalProps) {
  const setPortrait = useCharacterStore((s) => s.setPortrait)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputId = useRef(`portrait-upload-${character.id}`).current
  const isDesktop = useIsDesktop()

  const imgSrc = preview || character.portrait || fallbackImage

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      try {
        const dataUrl = await resizeImage(file)
        setPreview(dataUrl)
        setPortrait(character.id, dataUrl)
      } catch {
        // Silently fail — user can retry
      }
      e.target.value = ''
    },
    [character.id, setPortrait]
  )

  const handleRemove = useCallback(() => {
    setPortrait(character.id, '')
    onClose()
  }, [character.id, setPortrait, onClose])

  const hasCustomPortrait = !!(preview || character.portrait)

  const sharedContent = (
    <>
      {/* Portrait preview */}
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: 12,
          border: '1px solid var(--gold-muted)',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
          flexShrink: 0,
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="Character portrait"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-tertiary)',
              fontSize: 40,
            }}
          >
            ?
          </div>
        )}
      </div>

      {/* Hidden file input — label-based trigger is more reliable than programmatic .click() */}
      <input
        id={fileInputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      />

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <label
          htmlFor={fileInputId}
          style={{
            ...typeSubtitle,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 44,
            padding: '10px 24px',
            borderRadius: 6,
            cursor: 'pointer',
            background: 'linear-gradient(180deg, #8a8d93 0%, #6b6e74 40%, #5a5d63 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)',
            color: 'var(--gold)',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 38,
              padding: '10px 24px',
              background: 'linear-gradient(180deg, #1a1f2e 0%, #151a24 50%, #0d1018 100%)',
              borderRadius: 3,
              border: '1px solid #0a0d14',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.04)',
            }}
          >
            <span
              style={{
                ...typeSubtitle,
                fontSize: 13,
                background: 'linear-gradient(180deg, #c8c0b4 0%, #9e978b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.7))',
              }}
            >
              Choose Photo
            </span>
          </span>
        </label>

        {hasCustomPortrait && (
          <GameButton variant="ghost" onClick={handleRemove}>
            Remove Photo
          </GameButton>
        )}
      </div>
    </>
  )

  if (isDesktop) {
    // ─── Desktop: centered modal with overlay ───
    return (
      <AnimatePresence>
        <motion.div
          key="portrait-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            key="portrait-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', ...springs.smooth }}
            onClick={(e) => e.stopPropagation()}
            style={{
              ...warmGlass,
              borderRadius: RADIUS_MENU,
              padding: 24,
              width: 280,
              maxWidth: '90vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: 16,
                border: 'none',
                background: 'rgba(255,255,255,0.08)',
                color: 'var(--text-secondary)',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>Portrait</span>
            {sharedContent}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // ─── Mobile: iOS-style bottom sheet ───
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="portrait-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Bottom sheet */}
      <motion.div
        key="portrait-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          ...warmGlass,
          borderRadius: '20px 20px 0 0',
          padding: '12px 24px calc(24px + env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.2)',
            flexShrink: 0,
          }}
        />

        <span style={{ ...typeSubtitle, color: 'var(--gold)' }}>Portrait</span>
        {sharedContent}
      </motion.div>
    </AnimatePresence>
  )
}
