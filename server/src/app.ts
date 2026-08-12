import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import { booksRouter } from './routes/books'
import { UpstreamError } from './utils/http'
import { errorBody } from './utils/responses'

export function createApp() {
  const app = express()

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/books', booksRouter)

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof UpstreamError) {
      res.status(502).json(errorBody('Upstream book data is temporarily unavailable', 'UPSTREAM_ERROR'))
      return
    }
    res.status(500).json(errorBody('Unexpected server error', 'INTERNAL_ERROR'))
  })

  return app
}
