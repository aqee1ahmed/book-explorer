import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { SKELETON_COUNT } from '../constants'

interface SkeletonGridProps {
  count?: number
}

export function SkeletonGrid({ count = SKELETON_COUNT }: SkeletonGridProps) {
  return (
    <Grid container spacing={2.5} columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
      {Array.from({ length: count }, (_, index) => (
        <Grid key={index} size={1}>
          <Stack spacing={1} data-testid="skeleton-card">
            <Skeleton variant="rounded" sx={{ aspectRatio: '2 / 3', height: 'auto', transform: 'none' }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Stack>
        </Grid>
      ))}
    </Grid>
  )
}
