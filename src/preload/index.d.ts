import { ElectronAPI } from '@electron-toolkit/preload'

type Project = {
  contractNo: string
  poNo: string
  price: number
  customerName: string
  created: Date | string
  releaseDate: string | null
  notes: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      newProject: (project: Project) => void
      getProjects: () => void
      deleteProject: (directory: string) => void
      updateProjects: (callback: (value: Project[]) => void) => void
      updateProject: (project: Project) => void
    }
  }
}
