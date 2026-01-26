// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join } from 'node:path'
// - NPM
import { net, ipcMain, type IpcMainEvent } from 'electron'
// - Local
import { createDir, writeJsonFile, deleteDir } from '../lib/file-system'
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

// MARK: Globals
// -----------------------------------------------------------------------------
const runningFolder = 'R:\\ENGINEERING JOBS_FINAL\\53xxxx\\536XXX\\_greg-running-folder'

// MARK: Helpers
// -----------------------------------------------------------------------------

async function newProject(event: IpcMainEvent, proj: Project) {
  const settings = await getSettings()
  // TODO: Handle error in UI
  if (!settings) return

  const reqBody = {
    customerName: proj.customerName,
    contractNo: proj.contractNo,
    poNo: proj.poNo,
    user: settings.email,
    price: proj.price
  }

  let res: Response
  let resBody: any

  try {
    res = await net.fetch(`${settings.server}/api/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    })

    if (res.body && res.status !== 204) resBody = await res.json()
    if (!res.ok) throw new Error(resBody.message)
  } catch (error) {
    // TODO: Handle error in UI
    console.log(error)
    return
  }

  const path = join(runningFolder, `${proj.contractNo} ${proj.customerName}`)
  let err = await createDir(path)
  if (err) {
    // TODO: Handle error in UI
    console.log(err)
    return
  }
  await writeJsonFile(join(path, 'data.json'), proj)

  event.reply('projects-listen', await getProjects())
}

async function getReport() {
  const settings = await getSettings()
  // TODO: Handle error in UI
  if (!settings) return

  let res: Response
  let resBody: any

  try {
    res = await net.fetch(`${settings.server}/api/contracts/report`)

    if (res.body && res.status !== 204) resBody = await res.json()
    if (!res.ok) throw new Error(resBody.message)
  } catch (error) {
    // TODO: Handle error in UI
    console.log(error)
    return
  }

  return resBody as Report
}

// MARK: Library
// -----------------------------------------------------------------------------

export async function getProjects() {
  const settings = await getSettings()
  // TODO: Handle error in UI
  if (!settings) return

  let res: Response
  let resBody: any

  try {
    res = await net.fetch(`${settings.server}/api/contracts/eng/${settings.email}`)

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
  if (!settings) return

  const contractNo = directory.split(' ')[0]

  let res: Response
  let resBody: any

  try {
    res = await net.fetch(`${settings.server}/api/contracts/contract/${contractNo}`, {
      method: 'DELETE'
    })

    if (res.body && res.status !== 204) resBody = await res.json()
    if (!res.ok) throw new Error(resBody.message)
  } catch (error) {
    // TODO: Handle error in UI
    console.log(error)
    return
  }

  const projectPath = join(runningFolder, directory)
  await deleteDir(projectPath)
}

export async function updateProject(update: Project) {
  const settings = await getSettings()
  // TODO: Handle error in UI
  if (!settings) return

  let res: Response
  let resBody: any

  try {
    res = await net.fetch(`${settings.server}/api/contracts`, {
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

  const path = join(runningFolder, `${update.contractNo} ${update.customerName}`, 'data.json')

  await writeJsonFile(path, update)
}

export function getProjectPath(directory: string) {
  const path = join(runningFolder, directory)
  return path
}

export default function listen() {
  ipcMain.on('projects-new', newProject)
  ipcMain.handle('projects-get-report', getReport)
}
