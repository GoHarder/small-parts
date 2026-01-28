import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

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

type Settings = {
  firstName: string
  lastName: string
  email: string
  server: string
}

import projects, { getProjectPath, getProjects, deleteProject, updateProject } from './app/projects'

import { getSettings, initSettings, updateSettings } from './app/settings'
import { buildEml } from './app/eml'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('did-finish-load', async () => {
    await initSettings()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  projects()

  ipcMain.on('projects-get', async (event) => {
    event.reply('projects-listen', await getProjects())
  })

  ipcMain.on('projects-update', async (event, project: Project) => {
    await updateProject(project)
    event.reply('projects-listen', await getProjects())
  })

  ipcMain.on('projects-delete', async (event, directory: string) => {
    await deleteProject(directory)
    event.reply('projects-listen', await getProjects())
  })

  ipcMain.on('folders-open', async (_event, directory: string) => {
    const path = getProjectPath(directory)
    shell.openPath(path)
  })

  ipcMain.on('settings-get', async (event) => {
    event.reply('settings-listen', await getSettings())
  })

  ipcMain.on('settings-update', async (event, settings: Settings) => {
    await updateSettings(settings)
    event.reply('settings-listen', settings)
  })

  ipcMain.on('email-send', async (_event, project: Project, settings: EmailOptions) => {
    buildEml(project, settings)

    // console.log(emlData)

    // await updateSettings(settings)
    // event.reply('settings-listen', settings)
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
