import { Router } from 'express'
import { getBookDetail, getBooks } from '../services/bookService'
import type { SortOption } from '../types'
import { errorBody } from '../utils/responses'

const SORT_OPTIONS: SortOption[] = ['relevance', 'rating', 'new']
const WORK_ID_PATTERN = /^OL\d+W$/

export const booksRouter = Router()

booksRouter.get('/', async (req, res) => {
  const page = Number(req.query.page ?? 1)
  const sort = (req.query.sort ?? 'relevance') as SortOption
  if (!Number.isInteger(page) || page < 1) {
    res.status(400).json(errorBody('page must be a positive integer', 'INVALID_PARAMETER'))
    return
  }
  if (!SORT_OPTIONS.includes(sort)) {
    res.status(400).json(errorBody(`sort must be one of: ${SORT_OPTIONS.join(', ')}`, 'INVALID_PARAMETER'))
    return
  }
  const result = await getBooks({
    q: asTrimmedString(req.query.q),
    subject: asTrimmedString(req.query.subject),
    sort,
    page,
  })
  res.json(result)
})

booksRouter.get('/:workId', async (req, res) => {
  if (!WORK_ID_PATTERN.test(req.params.workId)) {
    res.status(400).json(errorBody('workId must match OL<number>W', 'INVALID_PARAMETER'))
    return
  }
  res.json(await getBookDetail(req.params.workId))
})

function asTrimmedString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}
