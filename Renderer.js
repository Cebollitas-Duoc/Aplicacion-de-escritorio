const { app } = require('electron')
const fs = require('fs-extra');
const nunjucks = require('nunjucks')
const API = require('./API');
const SettingsManager = require('./SettingsManager');

async function createUniversalContext(){
    const basepath = app.getAppPath();
    var apiDomain = SettingsManager.getApiDomain()
    profileData = await API.getSessionProfile()

    if (profileData["ValidSession"]){
        username = profileData["Name"]
        lastName = profileData["LastName"]
        data = {
            "isLogged": true,
            "usrName": `${username} ${lastName}`,
        }
        if (profileData["Picture"] != "")
            data["usrImg"] = `${apiDomain}/files/getimage/${profileData["Picture"]}`;
        else
            data["usrImg"] = `${basepath}/static/img/defaultProfileImg.png`;
    }
    else{
        data = {
            "isLogged": false,
            "usrName": "",
            "usrImg": "",
        }
    }
    data["basepath"] = basepath
    return data
}

class Renderer {
    static win;

    static async render(template, context = {}){
        const basepath = app.getAppPath();
        const cacheFile = basepath + "/templates/Cache.html"
        function writeCache(s){
            fs.writeFileSync(cacheFile, s, 'utf8', function (err) {
               if (err) return console.log(err);
            });
        }
        
        const universalContext = await createUniversalContext()
        const html = nunjucks.render(basepath + "/templates/"+template, Object.assign({}, context, universalContext));
        
        writeCache(html)
        await this.win.loadFile(cacheFile);
        writeCache(" ")
    }
}

module.exports = Renderer;