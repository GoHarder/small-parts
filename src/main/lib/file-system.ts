// MARK: Imports
// -----------------------------------------------------------------------------
import { mkdir, readdir, readFile as nReadFile, writeFile as nWriteFile } from 'node:fs/promises'

// MARK: Types
// -----------------------------------------------------------------------------
import { PathLike } from 'node:fs'

// MARK: Library
// -----------------------------------------------------------------------------
export async function createDir(path: PathLike) {
  try {
    await mkdir(path)
  } catch (error) {
    console.log(error)
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
  }
}
