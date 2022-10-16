const ProfileManager = require('./ProfileManager');
const { app, ipcMain, session} = require('electron')
const axios = require('axios');

class API {
    static async isSessionValid(){
        var apiDomain = "http://localhost:8081";
        if (app.isPackaged)
            apiDomain = "http://api.mrmeme.cl";

        var config = {
            method: 'get',
            url: `${apiDomain}/auth/ValidateSession/`,
            data : {
                "SessionKey": ProfileManager.load("SessionKey")
            }
        };

        const response = await axios(config)
        return response.data;
    }

    static async getSessionProfile(){
        if (app.isPackaged)
            var apiDomain = "http://api.mrmeme.cl";
        var apiDomain = "http://localhost:8081";

        var config = {
            method: 'get',
            url: `${apiDomain}/profile/getsessionprofile/`,
            data : {
                "SessionKey": ProfileManager.load("SessionKey")
            }
        };

        const response = await axios(config)
        return response.data;
    }
}

module.exports = API;