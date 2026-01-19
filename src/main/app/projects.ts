// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join } from 'node:path'
// - Local
import { createDir, readJsonFile, writeJsonFile, deleteDir } from '../lib/file-system'

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

// MARK: Library
// -----------------------------------------------------------------------------

export async function newProject(proj: Project) {
  const path = join(runningFolder, `${proj.contractNo}`)
  let err = await createDir(path)

  if (err) {
    // TODO: Handle error in UI
    console.log(err)
    return
  }

  await writeJsonFile(join(path, 'data.json'), proj)
  const projects = await readJsonFile<Project[]>(join(runningFolder, 'projects.json'))
  if (!projects) return
  projects.push(proj)
  await writeJsonFile(join(runningFolder, 'projects.json'), projects)
}

export async function getProjects() {
  const path = join(runningFolder, 'projects.json')
  const projects = await readJsonFile<Project[]>(path)
  if (!projects) return []
  return projects
}

export async function deleteProject(contractNo: string) {
  const path = join(runningFolder, 'projects.json')
  let projects = await readJsonFile<Project[]>(path)
  if (!projects) return
  projects = projects.filter((project) => project.contractNo !== contractNo)
  await writeJsonFile(join(runningFolder, 'projects.json'), projects)

  const projectPath = join(runningFolder, contractNo)
  await deleteDir(projectPath)
}
