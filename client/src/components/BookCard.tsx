import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Book } from '../api/types'

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
        {book.coverUrl ? (
          <CardMedia
            component="img"
            image={book.coverUrl}
            alt={`Cover of ${book.title}`}
            sx={{ aspectRatio: '2 / 3', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              aspectRatio: '2 / 3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2,
              textAlign: 'center',
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            <Typography variant="subtitle2">{book.title}</Typography>
          </Box>
        )}
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
