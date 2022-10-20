const { app, ipcMain, session} = require('electron')
const ProfileManager = require('./ProfileManager');
const SettingsManager = require('./SettingsManager');
const Renderer = require('./Renderer');

ipcMain.handle("apiDomain", async (event, args) => {
	return SettingsManager.getApiDomain();
})

ipcMain.handle("webDomain", async (event, args) => {
    return SettingsManager.getWebDomain();
})

ipcMain.handle("setData", async (event, key, value) => {
	ProfileManager.save(key, value)
})

ipcMain.handle("getData", async (event, key) => {
	return ProfileManager.load(key)
})

ipcMain.handle("setSettingsData", async (event, key, value) => {
	SettingsManager.save(key, value)
})

ipcMain.handle("getSettingsData", async (event, key) => {
	return SettingsManager.load(key)
})

ipcMain.handle("deleteSettingsData", async (event, args) => {
	SettingsManager.delete()
	app.quit()
})

ipcMain.handle("redirect", async (event, template) => {
	Renderer.render(template)
})

ipcMain.handle("logout", async (event, args) => {
	ProfileManager.delete()
	Renderer.render("Login.html")
})
