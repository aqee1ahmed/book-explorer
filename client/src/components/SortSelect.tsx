import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import type { SortOption } from '../api/types'
import { useFiltersStore } from '../store/filtersStore'

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Rating' },
  { value: 'new', label: 'Newest' },
]

export function SortSelect() {
  const sort = useFiltersStore((state) => state.sort)
  const setSort = useFiltersStore((state) => state.setSort)

  return (
    <TextField
      select
      size="small"
      label="Sort by"
      value={sort}
      onChange={(event) => setSort(event.target.value as SortOption)}
      sx={{ minWidth: 140 }}
    >
      {OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
