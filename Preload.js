const { app, contextBridge, ipcRenderer } = require('electron')

const WINDOW_API = {
        apiDomain: () => ipcRenderer.invoke('apiDomain'),
        webDomain: () => ipcRenderer.invoke('webDomain'),
        setData: (cname, cvalue) => ipcRenderer.invoke('setData', cname, cvalue),
        getData: (cname) => ipcRenderer.invoke('getData', cname),
        setSettingsData: (cname, cvalue) => ipcRenderer.invoke('setSettingsData', cname, cvalue),
        getSettingsData: (cname) => ipcRenderer.invoke('getSettingsData', cname),
        deleteSettingsData: () => ipcRenderer.invoke('deleteSettingsData'),
        redirect: (template) => ipcRenderer.invoke('redirect', template),
        logout: () => ipcRenderer.invoke('logout'),
        openBrowser: (url) => ipcRenderer.invoke('openBrowser', url),
        useLocalServer: () => ipcRenderer.invoke('useLocalServer'),
        getUsername: () => ipcRenderer.invoke('getUsername'),
}

contextBridge.exposeInMainWorld('api', WINDOW_API)