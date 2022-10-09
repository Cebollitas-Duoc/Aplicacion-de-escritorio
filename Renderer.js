const { app } = require('electron')
const fs = require('fs-extra');
const nunjucks = require('nunjucks')
const API = require('./API');

async function getMiniProfileData(){
    var webDomain = "http://localhost:8080";
    if (app.isPackaged)
        webDomain = "http://www.mrmeme.cl";
    profileData = await API.getSessionProfile()

    if (profileData["ValidSession"]){
        username = profileData["Name"]
        lastName = profileData["LastName"]
        data = {
            "isLogged": true,
            "usrName": `${username} ${lastName}`,
        }
        if (profileData["Picture"] != null)
            data["usrImg"] = `${webDomain}${profileData["Picture"]}`;
        else
            data["usrImg"] = `${webDomain}/static/img/profiles/default.png`;
    }
    else{
        data = {
            "isLogged": false,
            "usrName": "",
            "usrImg": "",
        }
    }
    
    return data
}

class Renderer {
    static win;

    static async render(template, context = {}){
        const cacheFile = "templates/Cache.html"
        function writeCache(s){
            fs.writeFileSync(cacheFile, s, 'utf8', function (err) {
               if (err) return console.log(err);
            });
        }
        
        const universalContext = await getMiniProfileData()
        const html = nunjucks.render("templates/"+template, Object.assign({}, context, universalContext));
        
        writeCache(html)
        await this.win.loadFile(cacheFile);
        writeCache(" ")
    }
}

module.exports = Renderer;