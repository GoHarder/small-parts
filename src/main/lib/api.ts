// MARK: Imports
// -----------------------------------------------------------------------------
import { join } from 'node:path'

import { createDir, readFile, writeFile } from './file-system'

// MARK: Types
// -----------------------------------------------------------------------------
type NewProject = {
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

export async function newProject(proj: NewProject) {
  const path = join(runningFolder, `${proj.contractNo}`)
  await createDir(path)
  const data = JSON.stringify(proj)
  await writeFile(join(path, 'data.json'), data)

  const projects = await readFile(join(runningFolder, 'projects.json'))

  if (!projects) return

  const projectList = JSON.parse(projects)
  projectList.push(proj)
  await writeFile(join(runningFolder, 'projects.json'), JSON.stringify(projectList))
}

export async function getCurrentProjects() {
  const projects = await readFile(join(runningFolder, 'projects.json'))
  console.log(projects)
}
