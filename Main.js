const { app, BrowserWindow } = require('electron')
const path = require("path")
const ProfileManager = require('./ProfileManager');
const Renderer = require('./Renderer');
const API = require('./API');
require('./ipcManager');

const paths = {
	icon: path.join(__dirname, "static/img/Logo_v1.png"),
	preload: path.join(__dirname, "Preload.js"),
}

const createWindow = () => {
	win = new BrowserWindow({
		width: 1200,
		height: 720,
		resizable: true,
		icon: paths.icon,
		webPreferences: {
			preload: paths.preload,
			partition: 'persist:infragistics'
		}
	})
	Renderer.win = win;
	if (!app.isPackaged) win.webContents.openDevTools()

	
}

app.whenReady().then( async () => {
	createWindow()
	await win.loadFile("templates/Loading.html");
	
	if ((await API.isSessionValid())["Valid"])
		Renderer.render("UserSpace.html")
	else
		Renderer.render("Login.html")
		
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().lenght === 0) createWindow()
	})
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit()
	
	if (! ProfileManager.load("Remember"))
		ProfileManager.delete();
})

app.on("browser-window-created", (e, win) => {
	win.removeMenu()
})