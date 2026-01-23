// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join } from 'node:path'
// - NPM
import { net, ipcMain, type IpcMainEvent } from 'electron'
// - Local
import { createDir, readJsonFile, writeJsonFile, deleteDir } from '../lib/file-system'
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
  // await writeJsonFile(join(path, 'data.json'), proj)
  // const projects = await readJsonFile<Project[]>(join(runningFolder, 'projects.json'))
  // if (!projects) return

  // projects.push(proj)

  // await writeJsonFile(join(runningFolder, 'projects.json'), projects)

  event.reply('projects-listen', await getProjects())
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

  // const path = join(runningFolder, 'projects.json')
  // const projects = await readJsonFile<Project[]>(path)
  // if (!projects) return []
  // return projects

  return resBody
}

export async function deleteProject(directory: string) {
  const path = join(runningFolder, 'projects.json')
  let projects = await readJsonFile<Project[]>(path)
  if (!projects) return
  const contractNo = directory.split(' ')[0]
  projects = projects.filter((project) => project.contractNo !== contractNo)
  await writeJsonFile(join(runningFolder, 'projects.json'), projects)

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

  // const projectsPath = join(runningFolder, 'projects.json')
  // let projects = await readJsonFile<Project[]>(projectsPath)
  // if (!projects) return

  // const index = projects.findIndex((project) => project.contractNo === update.contractNo)
  // if (index === -1) return
  // projects[index] = update

  // await writeJsonFile(join(runningFolder, 'projects.json'), projects)

  const path = join(runningFolder, `${update.contractNo} ${update.customerName}`, 'data.json')

  await writeJsonFile(path, update)
}

export function getProjectPath(directory: string) {
  const path = join(runningFolder, directory)
  return path
}

export default function listen() {
  ipcMain.on('projects-new', newProject)
}
