const TRAILER_PATTERN = /^(also contained in|contained in|see also)[:.]?\s*$/i
const SUBJECT_STOPWORDS = new Set(['general', 'large type books'])

export function cleanDescription(raw: string | null): string | null {
  if (!raw) return null
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const trailerIndex = lines.findIndex((line) => TRAILER_PATTERN.test(line.trim()))
  const body = trailerIndex === -1 ? lines : lines.slice(0, trailerIndex)
  const kept = body.filter((line) => {
    const trimmed = line.trim()
    if (/^#{1,6}\s/.test(trimmed)) return false
    if (trimmed && /^[-_*\\\s]+$/.test(trimmed)) return false
    return true
  })
  const text = kept
    .join('\n')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(^|\s)[*_]([^*_\n]+)[*_](?=[\s.,;:!?)]|$)/g, '$1$2')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\(\s*source\s*\)/gi, '')
    .replace(/ {2,}/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return text || null
}

export function cleanSubjects(subjects: string[]): string[] {
  const seen = new Set<string>()
  const cleaned: string[] = []
  for (const raw of subjects) {
    const subject = raw.trim().replace(/\.$/, '')
    if (!subject || /--|\/|=|:/.test(subject)) continue
    if (/^translations into /i.test(subject)) continue
    const display = subject
      .replace(/^fiction,\s*/i, '')
      .replace(/,\s*(fiction|general)\s*$/i, '')
      .trim()
    if (!display) continue
    const key = display.toLowerCase()
    if (SUBJECT_STOPWORDS.has(key) || seen.has(key)) continue
    seen.add(key)
    cleaned.push(display[0].toUpperCase() + display.slice(1))
  }
  return cleaned
}
