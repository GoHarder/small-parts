// MARK: Imports
// -----------------------------------------------------------------------------
import { app } from 'electron'

// MARK: Types
// -----------------------------------------------------------------------------

type Settings = {
  firstName: string | null
  lastName: string | null
  email: string | null
  server: string
}

// MARK: Library
// -----------------------------------------------------------------------------
// - Node
import { join, dirname } from 'node:path'
// - Local
import { access, createDir, writeJsonFile, readJsonFile } from '../lib/file-system'

export async function initSettings() {
  const settingsPath = join(app.getPath('appData'), 'project-manager', 'user-settings.json')

  // console.log(settingsPath)

  const exists = await access(settingsPath)
  if (exists) return

  const initSettings = {
    firstName: null,
    lastName: null,
    email: null,
    server: 'http://localhost:5000'
  }

  await createDir(dirname(settingsPath))

  await writeJsonFile(settingsPath, initSettings)
}

let loadedSettings: Settings | undefined

export async function getSettings() {
  if (loadedSettings) return loadedSettings

  const settingsPath = join(app.getPath('appData'), 'project-manager', 'user-settings.json')
  const exists = await access(settingsPath)
  if (!exists) return

  loadedSettings = await readJsonFile<Settings>(settingsPath)

  return loadedSettings
}

export async function updateSettings(settings: Settings) {
  const settingsPath = join(app.getPath('appData'), 'project-manager', 'user-settings.json')
  await writeJsonFile(settingsPath, settings)
}
