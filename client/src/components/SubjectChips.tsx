import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { useFiltersStore } from '../store/filtersStore'

const SUBJECTS = [
  { label: 'Fiction', value: 'fiction' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'Mystery', value: 'mystery' },
  { label: 'Sci-Fi', value: 'science fiction' },
  { label: 'History', value: 'history' },
  { label: 'Biography', value: 'biography' },
  { label: 'Romance', value: 'romance' },
]

export function SubjectChips() {
  const query = useFiltersStore((state) => state.query)
  const subject = useFiltersStore((state) => state.subject)
  const setSubject = useFiltersStore((state) => state.setSubject)

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
      {SUBJECTS.map((item) => {
        const selected = !query && subject === item.value
        return (
          <Chip
            key={item.value}
            label={item.label}
            color={selected ? 'primary' : 'default'}
            variant={selected ? 'filled' : 'outlined'}
            onClick={() => setSubject(item.value)}
          />
        )
      })}
    </Stack>
  )
}
