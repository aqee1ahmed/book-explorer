import { getRating } from '../clients/googleBooks'
import { getWorkDetail, searchBooks } from '../clients/openLibrary'
import { TtlCache } from '../lib/cache'
import { mapWithConcurrency } from '../lib/concurrency'
import type { BaseBook, Book, BookDetail, BookListResponse, BookQuery } from '../types'

const PAGE_SIZE = 20
const ENRICHMENT_CONCURRENCY = 5
const listCache = new TtlCache<BookListResponse>(10 * 60_000)
const detailCache = new TtlCache<BookDetail>(60 * 60_000)

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

async function enrichWithRating(book: BaseBook): Promise<Book> {
  const rating = await getRating(book.isbn, book.title, book.authors[0]).catch(() => null)
  return {
    ...book,
    averageRating: rating?.averageRating ?? null,
    ratingsCount: rating?.ratingsCount ?? null,
    ratingsSource: rating ? 'google-books' : null,
  }
}

function sortByRating(books: Book[]): Book[] {
  return [...books].sort((a, b) => (b.averageRating ?? -1) - (a.averageRating ?? -1))
}
