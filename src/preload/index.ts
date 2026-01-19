import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  newProject: (project) => ipcRenderer.send('new-project', project),
  getProjects: () => ipcRenderer.send('get-projects'),
  deleteProject: (directory: string) => ipcRenderer.send('delete-project', directory),
  updateProject: (project) => ipcRenderer.send('update-project', project),
  updateProjects: (callback) =>
    ipcRenderer.on('update-projects', (_event, value) => callback(value))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
