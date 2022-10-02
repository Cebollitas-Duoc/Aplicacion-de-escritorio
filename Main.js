const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require("path")
const nunjucks = require('nunjucks')
const fs = require('fs');
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
})

app.on("browser-window-created", (e, win) => {
	win.removeMenu()
})

async function render(template, context = {}){
	const cacheFile = "templates/Cache.html"
	function writeCache(s){
		fs.readFile(cacheFile, 'utf8', function (err,data) {
			fs.writeFile(cacheFile, s, 'utf8', function (err) {
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

ipcMain.handle("setCookie", async (event, cname, cvalue, exdays, remember) => {
	session = win.webContents.session
    var expires;
    if (remember){
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        expires = d.toUTCString();
    }
    else{
        expires = "Session";
    }

    const cookie = {
        url: "http://www.mrmeme.cl",
        name: cname, 
        value: cvalue,
        expirationDate: expires,
        //domain: ".mrmeme.cl",
    }

    session.cookies.set(cookie).then(() => {
        console.log("cookie saved")
    }, (error) => {
        console.error(error)
    })

	session.cookies.get({}).then((cookies) => {
        console.log(cookies)
      }).catch((error) => {
        console.log(error)
      })

})

ipcMain.handle("getCookie", async (event, cname) => {
	session = win.webContents.session
    
	const cookie = {name: cname}

    session.cookies.get(cookie).then((cookies) => {
        return cookies;
      }).catch((error) => {
        console.log(error)
      })

})