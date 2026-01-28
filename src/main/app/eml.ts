// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
// - NPM
import { dialog } from 'electron'
// - Local
import { getSettings } from './settings'
import { writeFile } from '../lib/file-system'

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

type EmailOptions = {
  customerDrawings: boolean
  orderChange: boolean
  hasSheave: boolean
}

// MARK: Globals
// -----------------------------------------------------------------------------
const runningFolder = 'R:\\ENGINEERING JOBS_FINAL\\53xxxx\\536XXX\\_greg-running-folder'

const boundary = '--boundary_area_0'

// MARK: Helpers
// -----------------------------------------------------------------------------

async function getHeader(subject: string) {
  const settings = await getSettings()
  if (!settings) return ''
  const { firstName, lastName, email } = settings
  return `From: ${firstName} ${lastName} <${email}>\nSubject: ${subject}\nX-Unsent: 1\nContent-Type: multipart/mixed; boundary=${boundary}\n\n`
}

async function loadHtml(template: string) {
  const path = join(import.meta.dirname, '../..', 'src/main/email-templates', template)
  const html = await readFile(path, 'utf8')
  return `--${boundary}\nContent-Type: text/html; charset=UTF-8\n\n${html}\n`
}

async function loadPdf(dirName: string, contractNo: string) {
  const res = await dialog.showOpenDialog({
    title: 'Select drawings',
    properties: ['openFile'],
    defaultPath: join(runningFolder, dirName),
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  })

  if (res.canceled) return ''

  const path = res.filePaths[0]
  const fileName = `Customer ${contractNo} dwgs`
  const pdf = await readFile(path, 'base64')

  return `--${boundary}\nContent-Type: application/pdf; name=${fileName}.pdf\nContent-Transfer-Encoding: base64\nContent-Disposition: attachment\n\n${pdf}\n`
}

const templates = [
  { drawings: true, orderChange: false, hasSheave: false, file: 'dwgs-no-changes-gen.html' },
  { drawings: false, orderChange: false, hasSheave: false, file: 'no-dwgs-no-changes-gen.html' }
]

// const specialCustomers = ['schindler', 'tk', 'otis', 'fujitec']

// MARK: Library
// -----------------------------------------------------------------------------

export async function buildEml(project: Project, options: EmailOptions) {
  const subject = `${project.customerName} PO ${project.poNo} - HW ${project.contractNo}`
  const folder = `${project.contractNo} ${project.customerName}`
  const end = `--${boundary}--`

  let emlData = await getHeader(subject)

  const template = templates.find((row) => {
    if (row.drawings !== options.customerDrawings) return false
    if (row.orderChange !== options.orderChange) return false
    if (row.hasSheave !== options.hasSheave) return false
    return true
  })

  if (template) {
    emlData += await loadHtml(template.file)
  }

  if (options.customerDrawings) {
    emlData += await loadPdf(folder, project.contractNo)
  }

  emlData += end

  const path = join(runningFolder, folder)
  await writeFile(`${path}/${subject}.eml`, emlData)
}
