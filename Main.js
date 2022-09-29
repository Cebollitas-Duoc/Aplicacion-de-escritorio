const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require("path")
const fs = require('fs-extra');

const paths = {
	modsSource: path.join(__dirname, "minecraftFiles/mods"),
	icon: path.join(__dirname, "static/img/Logo_v1.png"),
	preload: path.join(__dirname, "Preload.js"),
	versionSource: path.join(__dirname, "minecraftFiles/version"),
	profileSource: path.join(__dirname, "minecraftFiles/profile.json"),
}

const createWindow = () => {
	const win = new BrowserWindow({
		width: 480,
		height: 270,
		resizable: true,
		icon: paths.icon,
		//frame: false,
		webPreferences: {
			preload: paths.preload
		}
	})

	win.loadFile('templates/Login.html')
	if (!app.isPackaged) win.webContents.openDevTools()
}


app.whenReady().then(() => {
	createWindow()

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().lenght === 0) createWindow()
	})
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit()
})

app.on("browser-window-created", (e, win) => {
	win.removeMenu()
})
