import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Book } from '../api/types'
import { BookCover } from './BookCover'

interface BookCardProps {
  book: Book
  onSelect: (book: Book) => void
}

export function BookCard({ book, onSelect }: BookCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        onClick={() => onSelect(book)}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <BookCover src={book.coverUrl} title={book.title} />
        <CardContent sx={{ flexGrow: 1, width: '100%' }}>
          <Typography variant="subtitle2" noWrap title={book.title}>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {book.authors.join(', ') || 'Unknown author'}
          </Typography>
          {book.averageRating !== null ? (
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, alignItems: 'center' }}>
              <Rating value={book.averageRating} precision={0.1} size="small" readOnly />
              <Typography variant="caption" color="text.secondary">
                {book.averageRating.toFixed(1)}
                {book.ratingsCount ? ` (${book.ratingsCount.toLocaleString()})` : ''}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              No ratings yet
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
