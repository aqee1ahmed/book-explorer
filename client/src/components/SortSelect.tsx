import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { SORT_OPTIONS } from '../constants'
import type { SortOption } from '../types'
import { useFiltersStore } from '../store/filtersStore'

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
      {SORT_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
