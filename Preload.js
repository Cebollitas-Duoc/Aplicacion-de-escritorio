const { app, contextBridge, ipcRenderer } = require('electron')

const WINDOW_API = {
        apiDomain: () => ipcRenderer.invoke('apiDomain'),
        setCookie: (cname, cvalue, exdays, remember) => ipcRenderer.invoke('setCookie', cname, cvalue, exdays, remember),
        getCookie: (cname) => ipcRenderer.invoke('getCookie', cname),
}

contextBridge.exposeInMainWorld('api', WINDOW_API)