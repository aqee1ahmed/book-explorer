import { useState } from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { fonts } from '../theme'
import { spineFor } from '../utils/spine'

interface BookCoverProps {
  src: string | null
  title: string
}

export function BookCover({ src, title }: BookCoverProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const spine = spineFor(title)

  if (!src || status === 'failed') {
    return (
      <Box
        sx={{
          aspectRatio: '2 / 3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.25,
          px: 2.5,
          py: 2,
          textAlign: 'center',
          bgcolor: spine.bg,
          color: spine.fg,
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: '1.02rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>
        <Box sx={{ width: 32, borderTop: '2px solid', opacity: 0.7 }} />
      </Box>
    )
  }

  return (
    <Box sx={{ position: 'relative', aspectRatio: '2 / 3' }}>
      {status === 'loading' && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      )}
      <Box
        component="img"
        src={src}
        alt={`Cover of ${title}`}
        loading="lazy"
        onLoad={() => setStatus('ready')}
        onError={() => setStatus('failed')}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: status === 'ready' ? 1 : 0,
          transition: 'opacity 200ms ease',
        }}
      />
    </Box>
  )
}
