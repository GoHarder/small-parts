// MARK: Imports
// -----------------------------------------------------------------------------
// - Node
import { join } from 'node:path'
// - NPM
import { dialog } from 'electron'
// - Local
import { getSettings } from './settings'
import { getProjectDir, readFile, writeFile } from '../lib/file-system'

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
  changes: string
}

// MARK: Globals
// -----------------------------------------------------------------------------
const boundary = '--boundary_area_0'

// MARK: Helpers
// -----------------------------------------------------------------------------

async function getHeader(subject: string) {
  const settings = await getSettings()

  // TODO: Handle error in UI
  if (!settings.success) return ''
  const { data } = settings
  const { firstName, lastName, email } = data
  return `From: ${firstName} ${lastName} <${email}>\nSubject: ${subject}\nX-Unsent: 1\nContent-Type: multipart/mixed; boundary=${boundary}\n\n`
}

async function loadHtml(template: string, changes: string) {
  const lines = changes.split('\n').map((line) => {
    return `<li><span class="bold">${line}</span></li>`
  })
  const path = join(import.meta.dirname, '../..', 'email-templates', template)
  const html = await readFile(path, 'utf8')

  if (!html.success) {
    // TODO: Handle error in UI
    console.log(html)
    return ''
  }

  html.data = html.data.replace('{changes}', lines.join('\n'))

  return `--${boundary}\nContent-Type: text/html; charset=UTF-8\n\n${html.data}\n`
}

async function loadPdf(dirName: string, contractNo: string) {
  const root = getProjectDir(contractNo)

  const res = await dialog.showOpenDialog({
    title: 'Select drawings',
    properties: ['openFile'],
    defaultPath: join(root, dirName),
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  })

  if (res.canceled) return ''

  const path = res.filePaths[0]
  const fileName = `Customer ${contractNo} dwgs`
  const pdf = await readFile(path, 'base64')

  if (!pdf.success) {
    // TODO: Handle error in UI
    console.log(pdf)
    return ''
  }

  return `--${boundary}\nContent-Type: application/pdf; name=${fileName}.pdf\nContent-Transfer-Encoding: base64\nContent-Disposition: attachment\n\n${pdf.data}\n`
}

const templates = [
  { drawings: true, orderChange: true, hasSheave: false, file: 'dwgs-changes-spl.html' },
  { drawings: false, orderChange: true, hasSheave: false, file: 'no-dwgs-changes-spl.html' },
  { drawings: true, orderChange: false, hasSheave: false, file: 'dwgs-no-changes-gen.html' },
  { drawings: false, orderChange: false, hasSheave: false, file: 'no-dwgs-no-changes-gen.html' }
]

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
    // console.log(template.file)
    emlData += await loadHtml(template.file, options.changes)
  }

  if (options.customerDrawings) {
    emlData += await loadPdf(folder, project.contractNo)
  }

  emlData += end

  const path = join(getProjectDir(project.contractNo), folder)
  await writeFile(`${path}/${subject}.eml`, emlData)
}
