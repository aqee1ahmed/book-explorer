import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Rating from '@mui/material/Rating'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useBookDetail } from '../hooks/useBooks'
import { fonts } from '../theme'
import type { BookDetailDialogProps } from '../types'
import { BookCover } from './BookCover'

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontFamily: fonts.mono,
        fontSize: '0.62rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'text.secondary',
      }}
    >
      {children}
    </Typography>
  )
}

export function BookDetailDialog({ book, onClose }: BookDetailDialogProps) {
  const detail = useBookDetail(book?.id ?? null)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={book !== null}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="book-detail-title"
    >
      {book && (
        <>
          <Box
            sx={{
              height: 8,
              flexShrink: 0,
              bgcolor: 'primary.main',
              borderBottom: '2px solid',
              borderBottomColor: 'secondary.main',
            }}
          />
          <IconButton
            aria-label="Close"
            onClick={onClose}
            size="small"
            sx={{
              position: 'absolute',
              top: 18,
              right: 14,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': { bgcolor: 'background.default' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <DialogContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 4 }}>
              <Box
                sx={{
                  width: { xs: 170, sm: 200 },
                  flexShrink: 0,
                  alignSelf: { xs: 'center', sm: 'flex-start' },
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '6px 6px 0 rgba(38, 33, 27, 0.12)',
                }}
              >
                <BookCover
                  key={book.id}
                  src={book.coverUrl ? book.coverUrl.replace('-M.jpg', '-L.jpg') : null}
                  title={book.title}
                />
              </Box>
              <Stack spacing={2} sx={{ minWidth: 0, flexGrow: 1 }}>
                <Stack spacing={0.75}>
                  <SectionLabel>
                    {book.firstPublishYear ? `First published ${book.firstPublishYear}` : 'Publication year unknown'}
                  </SectionLabel>
                  <Typography id="book-detail-title" variant="h5" sx={{ pr: 5, lineHeight: 1.2 }}>
                    {book.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {book.authors.join(', ') || 'Unknown author'}
                  </Typography>
                </Stack>
                {book.averageRating !== null ? (
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Rating value={book.averageRating} precision={0.1} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {book.averageRating.toFixed(1)}
                      {book.ratingsCount ? ` · ${book.ratingsCount.toLocaleString()} ratings` : ''}
                      {book.ratingsSource ? ` · ${book.ratingsSource === 'google-books' ? 'Google Books' : 'Open Library'}` : ''}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No ratings yet
                  </Typography>
                )}
                <Divider />
                <Stack spacing={1}>
                  <SectionLabel>About this book</SectionLabel>
                  {detail.isLoading ? (
                    <Stack spacing={0.75}>
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" width="85%" />
                      <Skeleton animation="wave" width="60%" />
                    </Stack>
                  ) : detail.isError ? (
                    <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
                      <Typography variant="body2" color="text.secondary">
                        The description couldn't be loaded.
                      </Typography>
                      <Button size="small" variant="outlined" onClick={() => detail.refetch()}>
                        Try again
                      </Button>
                    </Stack>
                  ) : detail.data?.description ? (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                      {detail.data.description}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No description available.
                    </Typography>
                  )}
                </Stack>
                {detail.data && detail.data.subjects.length > 0 && (
                  <>
                    <Divider />
                    <Stack spacing={1}>
                      <SectionLabel>Subjects</SectionLabel>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                        {detail.data.subjects.slice(0, 8).map((subject) => (
                          <Chip key={subject} label={subject} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </Stack>
                  </>
                )}
              </Stack>
            </Stack>
          </DialogContent>
        </>
      )}
    </Dialog>
  )
}
