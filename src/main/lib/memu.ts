const { Menu } = require('electron/main')

const isMac = process.platform === 'darwin'

export const menu = Menu.buildFromTemplate([
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          console.log('new')
        }
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  }
])
