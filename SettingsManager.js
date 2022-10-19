const fs = require('fs-extra');

class SettingsManager {
    static settingsPath = 'settings.json'
    static save(key, value){
        if (fs.existsSync(this.settingsPath)){
            var profile = fs.readJsonSync(this.settingsPath)
        }else{
            var profile = {}
        }
        profile[key] = value;
        fs.writeJSONSync(this.settingsPath, profile);
    }

    static load(key){
        if (fs.existsSync(this.settingsPath)){
            const packageObj = fs.readJsonSync(this.settingsPath)
            return packageObj[key];
        }
        return undefined
    }

    static delete(){
        fs.removeSync(this.settingsPath)
    }

    static getApiDomain() {
        const savedDomain = this.load("apidomain")
        if (savedDomain == undefined) return "http://api.mrmeme.cl";
        else return savedDomain
    }

    static getWebDomain() {
        const savedDomain = this.load("apidomain")
        if (savedDomain == undefined) return "http://www.mrmeme.cl";
        else return savedDomain
    }
}

module.exports = SettingsManager;