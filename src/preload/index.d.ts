import { ElectronAPI } from '@electron-toolkit/preload'

type Project = {
  _id: string
  customerName: string
  contractNo: string
  poNo: string
  user: string
  price: number
  created: Date | string
  released: string | null
  bookmarked: boolean
  // notes: string
}

type NewProject = Omit<Project, '_id' | 'created' | 'user' | 'released' | 'bookmarked'>

// type Project = {
//   contractNo: string
//   poNo: string
//   price: number
//   customerName: string
//   created: Date | string
//   releaseDate: string | null
//   notes: string
// }

type Settings = {
  firstName: string | null
  lastName: string | null
  email: string | null
  server: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      projects: {
        new: (project: NewProject) => void
        get: () => void
        update: (project: Project) => void
        delete: (directory: string) => void
        listen: (callback: (value: Project[]) => void) => void
      }
      folders: {
        open: (directory: string) => void
      }
      settings: {
        update: (settings: Settings) => void
        listen: (callback: (valid: boolean, value: Settings) => void) => void
      }

      // newProject: (project: Project) => void
      // getProjects: () => void
      // deleteProject: (directory: string) => void
      // listenToProjects: (callback: (value: Project[]) => void) => void
      // updateProject: (project: Project) => void
      // openFolder: (directory: string) => void
    }
  }
}
