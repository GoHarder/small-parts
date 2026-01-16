import { ElectronAPI } from '@electron-toolkit/preload'

type NewProject = {
  contractNo: string
  poNo: string
  price: number
  customerName: string
  created: Date
  releaseDate: Date | null
  notes: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      newProject: (project: NewProject) => void
      getCurrentProjects: (callback: (value: NewProject[]) => void) => void
    }
  }
}
