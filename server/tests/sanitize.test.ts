import { describe, expect, it } from 'vitest'
import { cleanDescription, cleanSubjects } from '../src/utils/sanitize'

describe('cleanDescription', () => {
  it('drops markdown heading lines including spam links', () => {
    const raw = '## [The Silent Patient PDF](https://spam.example/doc/x)\r\n\r\n\\\r\nAlicia never speaks another word.'
    expect(cleanDescription(raw)).toBe('Alicia never speaks another word.')
  })

  it('unwraps inline links and strips emphasis markers', () => {
    const raw = '**GUARD YOUR MORTAL HEART.**\r\n\r\nFrom *New York Times* bestselling author [Holly Black](https://example.com/holly).'
    expect(cleanDescription(raw)).toBe('GUARD YOUR MORTAL HEART.\n\nFrom New York Times bestselling author Holly Black.')
  })

  it('removes bare urls, source attributions, and separator lines', () => {
    const raw = 'A fine book.\r\n([source](https://example.com/about))\r\n\r\n---\r\n\r\nMore text.'
    const cleaned = cleanDescription(raw)
    expect(cleaned).toContain('A fine book.')
    expect(cleaned).toContain('More text.')
    expect(cleaned).not.toContain('https://')
    expect(cleaned).not.toContain('source')
    expect(cleaned).not.toContain('---')
  })

  it('truncates catalog trailers like "Also contained in:"', () => {
    const raw = 'Poirot investigates.\r\n\r\n---\r\n\r\nAlso contained in:\r\n\r\n- [Five Classic Murder Mysteries](https://openlibrary.org/works/OL471533W)\r\n- [Masterpieces of Murder](https://openlibrary.org/works/OL471974W)'
    expect(cleanDescription(raw)).toBe('Poirot investigates.')
  })

  it('returns null when nothing survives cleaning', () => {
    expect(cleanDescription('## [spam](https://spam.example)')).toBeNull()
    expect(cleanDescription(null)).toBeNull()
  })

  it('preserves plain multi-paragraph text', () => {
    const raw = 'First paragraph.\n\nSecond paragraph.'
    expect(cleanDescription(raw)).toBe(raw)
  })
})

describe('cleanSubjects', () => {
  it('drops catalog artifacts, machine tags, and format noise', () => {
    expect(
      cleanSubjects([
        'Fairies--Fiction.',
        'FICTION / Thrillers / Psychological',
        'nyt:young-adult-hardcover=2018-01-21',
        'Large type books',
        'Translations into Russian',
        'general',
        'Family violence',
      ]),
    ).toEqual(['Family violence'])
  })

  it('normalizes fiction prefixes and suffixes and dedupes case-insensitively', () => {
    expect(
      cleanSubjects([
        'Fiction, thrillers',
        'Fiction, thrillers, general',
        'Sisters, fiction',
        'Sisters',
        'THRILLERS',
        'New York Times bestseller',
      ]),
    ).toEqual(['Thrillers', 'Sisters', 'New York Times bestseller'])
  })

  it('capitalizes the first letter and strips trailing periods', () => {
    expect(cleanSubjects(['fantasy fiction.', 'detective fiction'])).toEqual(['Fantasy fiction', 'Detective fiction'])
  })
})
