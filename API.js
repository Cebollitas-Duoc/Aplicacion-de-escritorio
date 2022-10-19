const ProfileManager = require('./ProfileManager');
const SettingsManager = require('./SettingsManager');
const { app, ipcMain, session} = require('electron')
const axios = require('axios');

class API {
    static async isSessionValid(){
        var apiDomain = SettingsManager.getApiDomain()

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
        var apiDomain = SettingsManager.getApiDomain()

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