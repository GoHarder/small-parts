import { ElectronAPI } from '@electron-toolkit/preload'

type Project = {
  _id: string
  customerName: string
  contractNo: string
  poNo: string
  user: string
  price: number
  created: Date | string
  completed: string | null
  released: string | null
  bookmarked: boolean
}

type NewProject = Omit<
  Project,
  '_id' | 'created' | 'user' | 'released' | 'completed' | 'bookmarked'
>

type Settings = {
  firstName: string | null
  lastName: string | null
  email: string | null
  server: string
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

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      projects: {
        new: (project: NewProject) => void
        get: () => void
        getReport: () => Report
        update: (project: Project) => void
        delete: (directory: string) => void
        listen: (callback: (value: Project[]) => void) => void
      }
      folders: {
        open: (directory: string) => void
      }
      settings: {
        get: () => void
        update: (settings: Settings) => void
        listen: (callback: (value: Settings) => void) => void
      }
    }
  }
}
