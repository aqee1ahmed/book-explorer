import type { BookDetail, BookListParams, BookListResponse } from '../types'

export async function fetchBooks(params: BookListParams): Promise<BookListResponse> {
  const search = new URLSearchParams({ sort: params.sort, page: String(params.page) })
  if (params.query) search.set('q', params.query)
  else search.set('subject', params.subject)
  return getJson(`/api/books?${search}`)
}

export async function fetchBookDetail(id: string): Promise<BookDetail> {
  return getJson(`/api/books/${id}`)
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
  return response.json() as Promise<T>
}
