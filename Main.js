const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require("path")
const nunjucks = require('nunjucks')
const fs = require('fs-extra');

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
		//frame: false,
		webPreferences: {
			preload: paths.preload
		}
	})

	render('templates/Login.html')
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

function render(htmlPath, context = {}){
	const universalContext = {
	}

	var myData = "foo\nbar\nfoo\nbaz";

	const html = nunjucks.render(htmlPath, context + universalContext);
	win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
}

ipcMain.on("test", (event, args) => {
	console.log(`test` )
})