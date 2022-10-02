const { app, ipcMain, session} = require('electron')
const ProfileManager = require('./ProfileManager');

ipcMain.handle("apiDomain", async (event, args) => {
	if (app.isPackaged)
        return "http://api.mrmeme.cl";
	return "http://localhost:8081";
})

ipcMain.handle("setData", async (event, key, value) => {
	ProfileManager.save(key, value)
})

ipcMain.handle("getData", async (event, key) => {
	ProfileManager.load(key)
})
