import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Book } from '../types'
import { BookCard } from './BookCard'

const book: Book = {
  id: 'OL1W',
  title: 'Dune',
  authors: ['Frank Herbert'],
  firstPublishYear: 1965,
  coverUrl: null,
  isbn: null,
  averageRating: 4.2,
  ratingsCount: 1234,
  ratingsSource: 'google-books',
}

describe('BookCard', () => {
  it('shows the rating when present', () => {
    render(<BookCard book={book} onSelect={() => {}} />)
    expect(screen.getAllByText('Dune').length).toBeGreaterThan(0)
    expect(screen.getByText('Frank Herbert')).toBeInTheDocument()
    expect(screen.getByText(/4\.2/)).toBeInTheDocument()
    expect(screen.getByText(/1,234/)).toBeInTheDocument()
  })

  it('shows a fallback when there is no rating', () => {
    render(
      <BookCard
        book={{ ...book, averageRating: null, ratingsCount: null, ratingsSource: null }}
        onSelect={() => {}}
      />,
    )
    expect(screen.getByText('No ratings yet')).toBeInTheDocument()
  })

  it('notifies selection on click', () => {
    const onSelect = vi.fn()
    render(<BookCard book={book} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(book)
  })
})
