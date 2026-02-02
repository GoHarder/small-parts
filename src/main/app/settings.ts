// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join, dirname } from 'node:path'
// - NPM
import { app, ipcMain, type IpcMainEvent } from 'electron'
// - Local
import { access, createDir, writeJsonFile, readJsonFile } from '../lib/file-system'

// MARK: Types
// -----------------------------------------------------------------------------
type Settings = {
  firstName: string | null
  lastName: string | null
  email: string | null
  server: string
}

// MARK: Globals
// -----------------------------------------------------------------------------
let loadedSettings: Settings | undefined

// MARK: Helpers
// -----------------------------------------------------------------------------
async function updateSettings(event: IpcMainEvent, settings: Settings) {
  const settingsPath = join(app.getPath('appData'), 'project-manager', 'user-settings.json')
  const updated = await writeJsonFile(settingsPath, settings)
  if (!updated.success) event.reply('error-listen', updated.error)
  event.reply('settings-listen', settings)
}

async function getSettingsMain(event: IpcMainEvent) {
  event.reply('settings-listen', await getSettings())
}

// MARK: Library
// -----------------------------------------------------------------------------
export async function initSettings() {
  // C:\Users\<user>\AppData\Roaming\project-manager\user-settings.json
  const settingsPath = join(app.getPath('appData'), 'project-manager', 'user-settings.json')

  const exists = await access(settingsPath)
  if (exists) return { success: true } as const

  const initSettings = {
    firstName: null,
    lastName: null,
    email: null,
    server: 'https://staging-hwcalc.vantage-link.com'
  }

  const created = await createDir(dirname(settingsPath))
  if (!created.success) return created

  return await writeJsonFile(settingsPath, initSettings)
}

export async function getSettings() {
  if (loadedSettings) return { success: true, data: loadedSettings }

  const settingsPath = join(app.getPath('appData'), 'project-manager', 'user-settings.json')
  const read = await readJsonFile<Settings>(settingsPath)

  if (!read.success) return read

  loadedSettings = read.data

  for (const key in loadedSettings) {
    if (loadedSettings[key] !== null) continue
    loadedSettings[key] = ''
  }

  return { success: true, data: loadedSettings } as const
}

export default function listen() {
  ipcMain.on('settings-update', updateSettings)
  ipcMain.on('settings-get', getSettingsMain)
}
