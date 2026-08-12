import type { ApiError } from '../types'

export function errorBody(message: string, code: string): ApiError {
  return { error: { message, code } }
}
