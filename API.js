const ProfileManager = require('./ProfileManager');
const { app, ipcMain, session} = require('electron')
const axios = require('axios');

class API {
    static async isSessionValid(){
        if (app.isPackaged)
            var apiDomain = "http://api.mrmeme.cl";
        var apiDomain = "http://localhost:8081";

        var config = {
            method: 'get',
            url: `${apiDomain}/auth/ValidateSession/`,
            data : {
                "SessionKey": ProfileManager.load("SessionKey")
            }
        };

        const response = await axios(config)
        return JSON.stringify(response.data);
    }

}

module.exports = API;