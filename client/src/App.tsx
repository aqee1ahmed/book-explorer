import { useState } from 'react'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import type { Book } from './types'
import { BookDetailDialog } from './components/BookDetailDialog'
import { BookGrid } from './components/BookGrid'
import { SearchBar } from './components/SearchBar'
import { SkeletonGrid } from './components/SkeletonGrid'
import { SortSelect } from './components/SortSelect'
import { StatusMessage } from './components/StatusMessage'
import { SubjectChips } from './components/SubjectChips'
import { MAX_PAGES } from './constants'
import { useBooks } from './hooks/useBooks'
import { useFiltersStore } from './store/filtersStore'
import { fonts } from './theme'

export default function App() {
  const { data, isError, isPending, isPlaceholderData, refetch } = useBooks()
  const page = useFiltersStore((state) => state.page)
  const setPage = useFiltersStore((state) => state.setPage)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const changePage = (value: number) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderBottom: '3px solid',
          borderBottomColor: 'secondary.main',
        }}
      >
        <Toolbar sx={{ gap: 2, py: 0.75 }}>
          <Stack direction="row" spacing={1.25} sx={{ flexShrink: 0, alignItems: 'center' }}>
            <AutoStoriesRoundedIcon sx={{ color: 'secondary.main' }} />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                component="h1"
                sx={{
                  fontFamily: fonts.display,
                  fontVariationSettings: "'WONK' 1, 'SOFT' 30",
                  fontWeight: 600,
                  fontSize: '1.35rem',
                  lineHeight: 1.15,
                }}
              >
                Book Explorer
              </Typography>
              <Typography
                sx={{
                  fontFamily: fonts.mono,
                  fontSize: '0.58rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'secondary.main',
                }}
              >
                Open Library × Google Books
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ flexGrow: 1, maxWidth: 560, mx: 'auto' }}>
            <SearchBar />
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 3, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' } }}
        >
          <SubjectChips />
          <SortSelect />
        </Stack>
        {isError ? (
          <StatusMessage
            title="Something went wrong"
            detail="We couldn't load books right now. Please try again."
            onRetry={() => refetch()}
          />
        ) : isPending || !data ? (
          <SkeletonGrid />
        ) : data.books.length === 0 ? (
          <StatusMessage title="No books found" detail="Try a different search term or subject." />
        ) : (
          <Stack spacing={3} sx={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
            <Stack spacing={1.25}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                {data.totalResults.toLocaleString()} {data.totalResults === 1 ? 'result' : 'results'} · page{' '}
                {data.page} of {Math.min(data.totalPages, MAX_PAGES).toLocaleString()}
              </Typography>
              <BookGrid books={data.books} onSelect={setSelectedBook} />
            </Stack>
            <Pagination
              count={Math.min(data.totalPages, MAX_PAGES)}
              page={page}
              onChange={(_event, value) => changePage(value)}
              color="primary"
              sx={{ alignSelf: 'center' }}
            />
          </Stack>
        )}
      </Container>
      <BookDetailDialog book={selectedBook} onClose={() => setSelectedBook(null)} />
    </Box>
  )
}
