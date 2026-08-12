import { config } from '../config'
import { UPSTREAM_TIMEOUT_MS } from '../constants'

export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'UpstreamError'
  }
}

export async function fetchJson<T>(url: string, timeoutMs = UPSTREAM_TIMEOUT_MS): Promise<T> {
  const host = new URL(url).host
  let response: Response
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'User-Agent': config.userAgent, Accept: 'application/json' },
    })
  } catch {
    throw new UpstreamError(`Request to ${host} failed`)
  }
  if (!response.ok) {
    throw new UpstreamError(`Request to ${host} returned ${response.status}`, response.status)
  }
  try {
    return (await response.json()) as T
  } catch {
    throw new UpstreamError(`Request to ${host} returned invalid JSON`)
  }
}
