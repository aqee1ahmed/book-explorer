import type { SpineColors } from '../types'

const SPINE_PALETTE: SpineColors[] = [
  { bg: '#D9622B', fg: '#F9F3E4' },
  { bg: '#0F5E63', fg: '#F9F3E4' },
  { bg: '#C7902B', fg: '#26211B' },
  { bg: '#4E7A5A', fg: '#F9F3E4' },
  { bg: '#7C3F3A', fg: '#F9F3E4' },
  { bg: '#46647A', fg: '#F9F3E4' },
]

export function spineFor(title: string): SpineColors {
  let hash = 0
  for (const char of title) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) | 0
  return SPINE_PALETTE[Math.abs(hash) % SPINE_PALETTE.length]
}
