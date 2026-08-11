import { fetchJson } from '../lib/http'
import type { BaseBook, BookDetail, BookQuery } from '../types'

const BASE_URL = process.env.OPEN_LIBRARY_URL ?? 'https://openlibrary.org'
const COVERS_URL = 'https://covers.openlibrary.org/b/id'
const PAGE_SIZE = 20
const SEARCH_FIELDS = 'key,title,author_name,first_publish_year,cover_i,isbn'
const DEFAULT_SUBJECT = 'fiction'

interface SearchDoc {
  key?: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  isbn?: string[]
}

interface SearchResponse {
  numFound: number
  docs: SearchDoc[]
}

interface WorkResponse {
  description?: string | { value: string }
  subjects?: string[]
}

const SORT_PARAMS: Record<string, string | undefined> = {
  relevance: undefined,
  rating: 'rating',
  new: 'new',
}

export async function searchBooks(query: BookQuery): Promise<{ books: BaseBook[]; totalResults: number }> {
  const params = new URLSearchParams({
    fields: SEARCH_FIELDS,
    limit: String(PAGE_SIZE),
    page: String(query.page),
  })
  if (query.q) params.set('q', query.q)
  else params.set('subject', query.subject ?? DEFAULT_SUBJECT)
  const sort = SORT_PARAMS[query.sort]
  if (sort) params.set('sort', sort)

  const response = await fetchJson<SearchResponse>(`${BASE_URL}/search.json?${params}`)
  return {
    books: response.docs.filter(isCompleteDoc).map(toBaseBook),
    totalResults: response.numFound,
  }
}

export async function getWorkDetail(workId: string): Promise<BookDetail> {
  const work = await fetchJson<WorkResponse>(`${BASE_URL}/works/${workId}.json`)
  return {
    id: workId,
    description: typeof work.description === 'string' ? work.description : (work.description?.value ?? null),
    subjects: work.subjects ?? [],
  }
}

function isCompleteDoc(doc: SearchDoc): doc is SearchDoc & { key: string; title: string } {
  return Boolean(doc.key && doc.title)
}

function toBaseBook(doc: SearchDoc & { key: string; title: string }): BaseBook {
  return {
    id: doc.key.replace('/works/', ''),
    title: doc.title,
    authors: doc.author_name ?? [],
    firstPublishYear: doc.first_publish_year ?? null,
    coverUrl: doc.cover_i ? `${COVERS_URL}/${doc.cover_i}-M.jpg` : null,
    isbn: pickIsbn(doc.isbn),
  }
}

function pickIsbn(isbns?: string[]): string | null {
  if (!isbns?.length) return null
  return isbns.find((value) => value.length === 13) ?? isbns[0]
}
