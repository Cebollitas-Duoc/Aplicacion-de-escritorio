const { contextBridge, ipcRenderer } = require('electron')
const platform = process.platform

const paths = {
        linux:  process.env.HOME + "/.minecraft",
        darwin: process.env.HOME + "/Library/Application Support/minecraft",
        win32:  process.env.APPDATA + "\.minecraft",
        win64:  process.env.APPDATA + "\.minecraft",

}

const WINDOW_API = {
        test: () => ipcRenderer.send('test'),
}

contextBridge.exposeInMainWorld('api', WINDOW_API)

window.addEventListener("DOMContentLoaded", () => {
        document.querySelector("#pathSelector input").value = paths[platform];
})
