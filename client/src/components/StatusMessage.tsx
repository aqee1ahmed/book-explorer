import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { StatusMessageProps } from '../types'

export function StatusMessage({ title, detail, onRetry }: StatusMessageProps) {
  return (
    <Stack spacing={1.5} sx={{ py: 10, textAlign: 'center', alignItems: 'center' }}>
      <Box sx={{ width: 40, borderTop: '3px solid', borderColor: 'secondary.main' }} />
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {detail}
      </Typography>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Stack>
  )
}
