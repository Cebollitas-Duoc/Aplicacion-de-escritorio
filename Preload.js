const { app, contextBridge, ipcRenderer } = require('electron')

const WINDOW_API = {
        apiDomain: () => ipcRenderer.invoke('apiDomain'),
        setData: (cname, cvalue) => ipcRenderer.invoke('setData', cname, cvalue),
        getData: (cname) => ipcRenderer.invoke('getData', cname),
        redirect: (template) => ipcRenderer.invoke('redirect', template),
        logout: () => ipcRenderer.invoke('logout'),
}

contextBridge.exposeInMainWorld('api', WINDOW_API)