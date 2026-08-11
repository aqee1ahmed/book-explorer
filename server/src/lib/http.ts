export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'UpstreamError'
  }
}

export async function fetchJson<T>(url: string, timeoutMs = 8_000): Promise<T> {
  const host = new URL(url).host
  let response: Response
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
  } catch {
    throw new UpstreamError(`Request to ${host} failed`)
  }
  if (!response.ok) {
    throw new UpstreamError(`Request to ${host} returned ${response.status}`, response.status)
  }
  return response.json() as Promise<T>
}
