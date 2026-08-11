import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { SUBJECTS } from '../constants'
import { useFiltersStore } from '../store/filtersStore'

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
