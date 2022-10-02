const { app, ipcMain, session} = require('electron')

ipcMain.handle("apiDomain", async (event, args) => {
	if (app.isPackaged)
        return "http://api.mrmeme.cl";
	return "http://localhost:8081";
})

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
