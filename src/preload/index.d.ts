import { ElectronAPI } from '@electron-toolkit/preload'

type Project = {
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
      newProject: (project: Project) => void
      deleteProject: (contractNo: string) => void
      getProjects: (callback: (value: Project[]) => void) => void
    }
  }
}
