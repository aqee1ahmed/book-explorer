import { useEffect, useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { DEBOUNCE_MS } from '../constants'
import { useFiltersStore } from '../store/filtersStore'

export function SearchBar() {
  const storeQuery = useFiltersStore((state) => state.query)
  const setQuery = useFiltersStore((state) => state.setQuery)
  const [value, setValue] = useState(storeQuery)

  useEffect(() => {
    setValue(storeQuery)
  }, [storeQuery])

  useEffect(() => {
    if (value === storeQuery) return
    const handle = setTimeout(() => setQuery(value), DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [value, storeQuery, setQuery])

  const clear = () => {
    setValue('')
    setQuery('')
  }

  return (
    <TextField
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Search books by title or author"
      size="small"
      fullWidth
      slotProps={{
        htmlInput: { 'aria-label': 'Search books' },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton aria-label="Clear search" size="small" onClick={clear}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  )
}
