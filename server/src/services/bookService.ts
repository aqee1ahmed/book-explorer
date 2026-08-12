import { getRating } from '../clients/googleBooks'
import { getWorkDetail, searchBooks } from '../clients/openLibrary'
import { DETAIL_CACHE_TTL_MS, ENRICHMENT_CONCURRENCY, LIST_CACHE_TTL_MS, PAGE_SIZE } from '../constants'
import { createTtlCache } from '../utils/cache'
import { mapWithConcurrency } from '../utils/concurrency'
import type { Book, BookDetail, BookListResponse, BookQuery, SearchResultBook } from '../types'

const listCache = createTtlCache<BookListResponse>(LIST_CACHE_TTL_MS)
const detailCache = createTtlCache<BookDetail>(DETAIL_CACHE_TTL_MS)

export async function getBooks(query: BookQuery): Promise<BookListResponse> {
  const cacheKey = JSON.stringify([query.q ?? '', query.subject ?? '', query.sort, query.page])
  const cached = listCache.get(cacheKey)
  if (cached) return cached

  const { books: baseBooks, totalResults } = await searchBooks(query)
  const enriched = await mapWithConcurrency(baseBooks, ENRICHMENT_CONCURRENCY, enrichWithRating)
  const books = query.sort === 'rating' ? sortByRating(enriched) : enriched

  const result: BookListResponse = {
    books,
    page: query.page,
    pageSize: PAGE_SIZE,
    totalResults,
    totalPages: Math.ceil(totalResults / PAGE_SIZE),
  }
  listCache.set(cacheKey, result)
  return result
}

export async function getBookDetail(workId: string): Promise<BookDetail> {
  const cached = detailCache.get(workId)
  if (cached) return cached
  const detail = await getWorkDetail(workId)
  detailCache.set(workId, detail)
  return detail
}

export function resetCaches(): void {
  listCache.clear()
  detailCache.clear()
}

async function enrichWithRating(book: SearchResultBook): Promise<Book> {
  const googleRating = await getRating(book.isbn, book.title, book.authors[0]).catch(() => null)
  const { openLibraryRating, ...base } = book
  const rating = googleRating ?? openLibraryRating
  return {
    ...base,
    averageRating: rating?.averageRating ?? null,
    ratingsCount: rating?.ratingsCount ?? null,
    ratingsSource: googleRating ? 'google-books' : openLibraryRating ? 'open-library' : null,
  }
}

function sortByRating(books: Book[]): Book[] {
  return [...books].sort((a, b) => (b.averageRating ?? -1) - (a.averageRating ?? -1))
}
