const { contextBridge, ipcRenderer } = require('electron')

const WINDOW_API = {
        test: () => ipcRenderer.send('test'),
}

contextBridge.exposeInMainWorld('api', WINDOW_API)

