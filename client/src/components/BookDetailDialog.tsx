import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Rating from '@mui/material/Rating'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Book } from '../api/types'
import { useBookDetail } from '../hooks/useBooks'

interface BookDetailDialogProps {
  book: Book | null
  onClose: () => void
}

export function BookDetailDialog({ book, onClose }: BookDetailDialogProps) {
  const detail = useBookDetail(book?.id ?? null)

  return (
    <Dialog open={book !== null} onClose={onClose} maxWidth="sm" fullWidth>
      {book && (
        <DialogContent sx={{ p: 3 }}>
          <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            {book.coverUrl && (
              <Box
                component="img"
                src={book.coverUrl.replace('-M.jpg', '-L.jpg')}
                alt={`Cover of ${book.title}`}
                sx={{ width: 160, alignSelf: { xs: 'center', sm: 'flex-start' }, borderRadius: 1 }}
              />
            )}
            <Stack spacing={1.5} sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ pr: 4 }}>
                {book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {book.authors.join(', ') || 'Unknown author'}
                {book.firstPublishYear ? ` · ${book.firstPublishYear}` : ''}
              </Typography>
              {book.averageRating !== null ? (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Rating value={book.averageRating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {book.averageRating.toFixed(1)}
                    {book.ratingsCount ? ` · ${book.ratingsCount.toLocaleString()} ratings` : ''}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No ratings yet
                </Typography>
              )}
              {detail.isLoading && (
                <Stack spacing={1}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="70%" />
                </Stack>
              )}
              {detail.data?.description && (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {detail.data.description}
                </Typography>
              )}
              {detail.data && !detail.data.description && (
                <Typography variant="body2" color="text.secondary">
                  No description available.
                </Typography>
              )}
              {detail.data && detail.data.subjects.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                  {detail.data.subjects.slice(0, 8).map((subject) => (
                    <Chip key={subject} label={subject} size="small" variant="outlined" />
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </DialogContent>
      )}
    </Dialog>
  )
}
