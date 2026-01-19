// MARK: Imports
// -----------------------------------------------------------------------------
import {
  mkdir,
  readdir,
  readFile as nReadFile,
  writeFile as nWriteFile,
  rm
} from 'node:fs/promises'
import { isSystemError } from './error'

import { Json } from '@moss/types'

// MARK: Types
// -----------------------------------------------------------------------------
import { type PathLike } from 'node:fs'

// MARK: Library
// -----------------------------------------------------------------------------
export async function createDir(path: PathLike) {
  try {
    return await mkdir(path)
  } catch (error) {
    if (isSystemError(error) && error.code === 'EEXIST') {
      return {
        code: 'EEXIST',
        message: `The directory ${path} already exists.`
      }
    }
    console.log(error)
    return
  }
}

/**
 * Reads the contents of a directory.
 * @param path The path to the directory
 */
export async function readDir(path: PathLike) {
  try {
    const entries = await readdir(path)
    for (const entry of entries) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export async function writeFile(path: PathLike, data: string) {
  try {
    await nWriteFile(path, data)
  } catch (error) {
    console.log(error)
  }
}

export async function readFile(path: PathLike) {
  try {
    const data = await nReadFile(path, 'utf8')
    return data
  } catch (error) {
    console.log(error)
    return ''
  }
}

export async function deleteDir(path: PathLike) {
  // ENOENT
  // ENOTEMPTY

  try {
    await rm(path, { recursive: true, force: true })
  } catch (error) {
    console.log(error)
  }
}

export async function writeJsonFile<D = Json>(path: PathLike, data: D) {
  try {
    const dataString = JSON.stringify(data, null, 2)
    await nWriteFile(path, dataString)
  } catch (error) {
    console.log(error)
  }
}

export async function readJsonFile<R>(path: PathLike) {
  try {
    const dataString = await readFile(path)
    return JSON.parse(dataString) as R
  } catch (error) {
    console.log(error)
    return
  }
}
