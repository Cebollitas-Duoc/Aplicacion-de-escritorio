const { app, ipcMain, session} = require('electron')

ipcMain.handle("apiDomain", async (event, args) => {
	if (app.isPackaged)
        return "http://api.mrmeme.cl";
	return "http://localhost:8081";
})

