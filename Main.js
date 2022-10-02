const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require("path")
const nunjucks = require('nunjucks')
const fs = require('fs-extra');
const ProfileManager = require('./ProfileManager');
require('./ipcManager');

const paths = {
	icon: path.join(__dirname, "static/img/Logo_v1.png"),
	preload: path.join(__dirname, "Preload.js"),
}

const createWindow = () => {
	win = new BrowserWindow({
		width: 1100,
		height: 600,
		resizable: true,
		icon: paths.icon,
		webPreferences: {
			preload: paths.preload,
			partition: 'persist:infragistics'
		}
	})

	if (!app.isPackaged) win.webContents.openDevTools()
}

app.whenReady().then(() => {
	createWindow()
	render("Login.html")
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

async function render(template, context = {}){
	const cacheFile = "templates/Cache.html"
	function writeCache(s){
		fs.readFile(cacheFile, 'utf8', function (err,data) {
			fs.writeFileSync(cacheFile, s, 'utf8', function (err) {
			   if (err) return console.log(err);
			});
		});
	}

	const universalContext = {}
	const html = nunjucks.render("templates/"+template, context + universalContext);
	
	writeCache(html)
	//await win.loadFile(cacheFile);
	await win.loadURL(`file://${__dirname}/${cacheFile}`)
	writeCache(" ")
	
}

