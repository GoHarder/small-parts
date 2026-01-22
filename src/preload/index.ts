import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  projects: {
    new: (project) => ipcRenderer.send('projects-new', project),
    get: () => ipcRenderer.send('projects-get'),
    update: (project) => ipcRenderer.send('projects-update', project),
    delete: (directory: string) => ipcRenderer.send('projects-delete', directory),
    listen: (callback) => ipcRenderer.on('projects-listen', (_event, update) => callback(update))
  },
  folders: {
    open: (directory: string) => ipcRenderer.send('folders-open', directory)
  },
  settings: {
    update: (settings) => ipcRenderer.send('settings-update', settings),
    listen: (callback) =>
      ipcRenderer.on('settings-listen', (_event, setup, update) => callback(setup, update))
  }
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
