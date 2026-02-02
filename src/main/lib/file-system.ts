// MARK: Imports
// -----------------------------------------------------------------------------
import {
  access as nAccess,
  mkdir,
  readdir,
  readFile as nReadFile,
  rm,
  writeFile as nWriteFile
} from 'node:fs/promises'
import { join } from 'node:path'

import { isSystemError } from './error.ts'

import { type Json } from '@moss/types'

// MARK: Types
// -----------------------------------------------------------------------------
import { type PathLike } from 'node:fs'

type MainError = {
  success: false
  error: {
    code: string
    message: string
  }
}

type ReadResult = {
  success: true
  data: string | Buffer<ArrayBuffer>
}

// MARK: Helpers
// -----------------------------------------------------------------------------
function handleError(error: unknown) {
  return {
    success: false,
    error: {
      code: isSystemError(error) ? error.code || 'UNKNOWN' : 'UNKNOWN',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  } as MainError
}

// MARK: Library
// -----------------------------------------------------------------------------
export async function access(path: PathLike) {
  try {
    await nAccess(path)
    return true
  } catch {
    return false
  }
}

/**
 * Asynchronously creates a directory.
 * @param path The path to the directory
 */
export async function createDir(path: PathLike) {
  try {
    await mkdir(path, { recursive: true })
    return { success: true } as const
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Reads the contents of a directory.
 * @param path The path to the directory
 */
export async function readDir(path: PathLike) {
  try {
    await readdir(path)
    return { success: true } as const
  } catch (error) {
    return handleError(error)
  }
}

export async function writeFile(path: PathLike, data: string | Uint8Array) {
  try {
    await nWriteFile(path, data)
    return { success: true } as const
  } catch (error) {
    return handleError(error)
  }
}

export async function readFile(
  path: PathLike,
  options: BufferEncoding
): Promise<{ success: true; data: string } | MainError>
export async function readFile(
  path: PathLike,
  options?: BufferEncoding
): Promise<ReadResult | MainError> {
  try {
    const data = await nReadFile(path, options)
    return { success: true, data } as const
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteDir(path: PathLike) {
  try {
    await rm(path, { recursive: true, force: true })
    return { success: true }
  } catch (error) {
    return handleError(error)
  }
}

export async function writeJsonFile<D = Json>(path: PathLike, data: D) {
  try {
    const dataString = JSON.stringify(data, null, 2)
    const result = await writeFile(path, dataString as string)
    if (!result.success) return result
    return { success: true } as const
  } catch (error) {
    return handleError(error)
  }
}

export async function readJsonFile<R>(path: PathLike) {
  try {
    const dataString = await readFile(path, 'utf8')
    if (!dataString.success) return dataString
    return { success: true, data: JSON.parse(dataString.data) as R } as const
  } catch (error) {
    return handleError(error)
  }
}

export function getProjectDir(contractNo: string) {
  const root = 'R:\\ENGINEERING JOBS_FINAL'
  const dirk1 = contractNo.replace(/\d{4}$/, 'xxxx')
  const dir2 = contractNo.replace(/\d{3}$/, 'xxx')
  return join(root, dirk1, dir2)
}
