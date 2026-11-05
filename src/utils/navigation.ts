function readStringField(state: unknown, field: string): string | null {
  if (typeof state !== 'object' || state === null) {
    return null
  }

  const value = (state as Record<string, unknown>)[field]

  return typeof value === 'string' ? value : null
}

export function getRedirectPath(state: unknown): string | null {
  return readStringField(state, 'from')
}

export function getStateMessage(state: unknown): string | null {
  return readStringField(state, 'message')
}
