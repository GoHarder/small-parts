// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join } from 'node:path'
// - NPM
import { net, ipcMain, type IpcMainEvent } from 'electron'
// - Local
import { getProjectDir, createDir, writeJsonFile, deleteDir } from '../lib/file-system'
import { getSettings } from './settings'

// MARK: Types
// -----------------------------------------------------------------------------
type Project = {
  contractNo: string
  poNo: string
  price: number
  customerName: string
  created: Date
  releaseDate: Date | null
  notes: string
}

type Report = {
  thisWeek: {
    monday: string
    projects: Project[]
    total: number
  }
  lastWeek: {
    monday: string
    projects: Project[]
    total: number
  }
}

// MARK: Helpers
// -----------------------------------------------------------------------------

async function newProject(event: IpcMainEvent, proj: Project) {
  const settings = await getSettings()
  // TODO: Handle error in UI
  if (!settings.success) return
  const { data } = settings

  const reqBody = {
    customerName: proj.customerName,
    contractNo: proj.contractNo,
    poNo: proj.poNo,
    user: data.email,
    price: proj.price
  }

  let res: Response
  let resBody: any

  try {
    res = await net.fetch(`${data.server}/api/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    })

    if (res.body && res.status !== 204) resBody = await res.json()
    if (!res.ok) {
      event.reply('error-listen', {
        code: res.status,
        message: resBody.message
      })
      return
    }
  } catch (error) {
    event.reply('error-listen', {
      code: 'UNKNOWN',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    return
  }

  const path = join(getProjectDir(proj.contractNo), `${proj.contractNo} ${proj.customerName}`)

  const created = await createDir(path)
  if (!created.success) {
    event.reply('error-listen', created.error)
    return
  }

  const written = await writeJsonFile(join(path, 'data.json'), proj)
  if (!written.success) {
    event.reply('error-listen', written.error)
    return
  }

  event.reply('projects-listen', await getProjects())
}

async function getReport() {
  const settings = await getSettings()
  // TODO: Handle error in UI
  if (!settings.success) return
  const { data } = settings

  let res: Response
  let resBody: any

  try {
    res = await net.fetch(`${data.server}/api/contracts/report`)

    if (res.body && res.status !== 204) resBody = await res.json()
    if (!res.ok) {
      return {
        code: resBody.code,
        message: resBody.message
      }
    }
  } catch (error) {
    return {
      code: 'UNKNOWN',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  return resBody as Report
}

// MARK: Library
// -----------------------------------------------------------------------------

export async function getProjects() {
  const settings = await getSettings()
  // TODO: Handle error in UI
  if (!settings.success) return
  const { data } = settings

  let res: Response
  let resBody: any

  try {
    res = await net.fetch(`${data.server}/api/contracts/eng/${data.email}`)

    if (res.body && res.status !== 204) resBody = await res.json()
    if (!res.ok) throw new Error(resBody.message)
  } catch (error) {
    // TODO: Handle error in UI
    console.log(error)
    return []
  }

  return resBody
}

export async function deleteProject(directory: string) {
  const settings = await getSettings()
  // TODO: Handle error in UI
  if (!settings.success) return
  const { data } = settings

  const contractNo = directory.split(' ')[0]

  let res: Response
  let resBody: any

  try {
    res = await net.fetch(`${data.server}/api/contracts/contract/${contractNo}`, {
      method: 'DELETE'
    })

    if (res.body && res.status !== 204) resBody = await res.json()
    if (!res.ok) throw new Error(resBody.message)
  } catch (error) {
    // TODO: Handle error in UI
    console.log(error)
    return
  }

  const projectPath = join(getProjectDir(contractNo), directory)
  await deleteDir(projectPath)
}

export async function updateProject(update: Project) {
  const settings = await getSettings()
  // TODO: Handle error in UI
  if (!settings.success) return
  const { data } = settings

  let res: Response
  let resBody: any

  try {
    res = await net.fetch(`${data.server}/api/contracts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    })

    if (res.body && res.status !== 204) resBody = await res.json()
    if (!res.ok) throw new Error(resBody.message)
  } catch (error) {
    // TODO: Handle error in UI
    console.log(error)
    return
  }

  const path = join(
    getProjectDir(update.contractNo),
    `${update.contractNo} ${update.customerName}`,
    'data.json'
  )

  await writeJsonFile(path, update)
}

export function getProjectPath(directory: string) {
  const contractNo = directory.split(' ')[0]
  const path = join(getProjectDir(contractNo), directory)
  return path
}

export default function listen() {
  ipcMain.on('projects-new', newProject)
  ipcMain.handle('projects-get-report', getReport)
}
