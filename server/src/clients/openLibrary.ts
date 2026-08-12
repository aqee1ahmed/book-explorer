import { config } from '../config'
import { COVERS_URL, DEFAULT_SUBJECT, PAGE_SIZE, SEARCH_FIELDS } from '../constants'
import { fetchJson } from '../lib/http'
import { cleanDescription, cleanSubjects } from '../lib/sanitize'
import type {
  BookDetail,
  BookQuery,
  OpenLibrarySearchDoc,
  OpenLibrarySearchResponse,
  OpenLibraryWorkResponse,
  RatingInfo,
  SearchResultBook,
  SortOption,
} from '../types'

const SORT_PARAMS: Record<SortOption, string | undefined> = {
  relevance: undefined,
  rating: 'rating',
  new: 'new',
}

export async function searchBooks(query: BookQuery): Promise<{ books: SearchResultBook[]; totalResults: number }> {
  const params = new URLSearchParams({
    fields: SEARCH_FIELDS,
    limit: String(PAGE_SIZE),
    page: String(query.page),
  })
  if (query.q) params.set('q', query.q)
  else params.set('subject', query.subject ?? DEFAULT_SUBJECT)
  const sort = SORT_PARAMS[query.sort]
  if (sort) params.set('sort', sort)

  const response = await fetchJson<OpenLibrarySearchResponse>(`${config.openLibraryUrl}/search.json?${params}`)
  return {
    books: response.docs.filter(isCompleteDoc).map(toSearchResultBook),
    totalResults: response.numFound,
  }
}

export async function getWorkDetail(workId: string): Promise<BookDetail> {
  const work = await fetchJson<OpenLibraryWorkResponse>(`${config.openLibraryUrl}/works/${workId}.json`)
  const rawDescription = typeof work.description === 'string' ? work.description : (work.description?.value ?? null)
  return {
    id: workId,
    description: cleanDescription(rawDescription),
    subjects: cleanSubjects(work.subjects ?? []),
  }
}

function isCompleteDoc(doc: OpenLibrarySearchDoc): doc is OpenLibrarySearchDoc & { key: string; title: string } {
  return Boolean(doc.key && doc.title)
}

function toSearchResultBook(doc: OpenLibrarySearchDoc & { key: string; title: string }): SearchResultBook {
  return {
    id: doc.key.replace('/works/', ''),
    title: doc.title,
    authors: doc.author_name ?? [],
    firstPublishYear: doc.first_publish_year ?? null,
    coverUrl: doc.cover_i ? `${COVERS_URL}/${doc.cover_i}-M.jpg` : null,
    isbn: pickIsbn(doc.isbn),
    openLibraryRating: toOpenLibraryRating(doc),
  }
}

function toOpenLibraryRating(doc: OpenLibrarySearchDoc): RatingInfo | null {
  if (doc.ratings_average === undefined || !doc.ratings_count) return null
  return {
    averageRating: Math.round(doc.ratings_average * 100) / 100,
    ratingsCount: doc.ratings_count,
  }
}

function pickIsbn(isbns?: string[]): string | null {
  if (!isbns?.length) return null
  return isbns.find((value) => value.length === 13) ?? isbns[0]
}
