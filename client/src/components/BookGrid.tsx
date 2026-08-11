import Grid from '@mui/material/Grid'
import type { Book } from '../api/types'
import { BookCard } from './BookCard'

interface BookGridProps {
  books: Book[]
  onSelect: (book: Book) => void
}

export function BookGrid({ books, onSelect }: BookGridProps) {
  return (
    <Grid container spacing={2.5} columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
      {books.map((book) => (
        <Grid key={book.id} size={1}>
          <BookCard book={book} onSelect={onSelect} />
        </Grid>
      ))}
    </Grid>
  )
}
