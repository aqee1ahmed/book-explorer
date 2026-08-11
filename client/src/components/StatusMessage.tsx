import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface StatusMessageProps {
  title: string
  detail: string
  onRetry?: () => void
}

export function StatusMessage({ title, detail, onRetry }: StatusMessageProps) {
  return (
    <Stack spacing={1.5} sx={{ py: 10, textAlign: 'center', alignItems: 'center' }}>
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
