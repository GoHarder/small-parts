import { isNativeError } from 'node:util/types'

export interface SystemError extends Error {
  code?: string
  errno?: number
  syscall?: string
  path?: string
  address?: string
  port?: number
}

export function isSystemError(value: unknown): value is SystemError {
  if (!isNativeError(value)) return false
  return ['code', 'errno', 'syscall'].every(
    (key) => typeof (value as any)[key] === 'string' || typeof (value as any)[key] === 'number'
  )
}
