const { app, ipcMain, session} = require('electron')
const ProfileManager = require('./ProfileManager');
const Renderer = require('./Renderer');

ipcMain.handle("apiDomain", async (event, args) => {
	if (app.isPackaged)
        return "http://api.mrmeme.cl";
	return "http://localhost:8081";
})

ipcMain.handle("setData", async (event, key, value) => {
	ProfileManager.save(key, value)
})

ipcMain.handle("getData", async (event, args) => {
	return ProfileManager.load(key)
})

ipcMain.handle("redirect", async (event, template) => {
	Renderer.render(template)
})
