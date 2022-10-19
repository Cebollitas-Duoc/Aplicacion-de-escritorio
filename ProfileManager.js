const fs = require('fs-extra');

class ProfileManager {
    static profilePath = 'profile.json'
    static save(key, value){
        if (fs.existsSync(this.profilePath)){
            var profile = fs.readJsonSync(this.profilePath)
        }else{
            var profile = {}
        }
        profile[key] = value;
        fs.writeJSONSync(this.profilePath, profile);
    }

    static load(key){
        if (fs.existsSync(this.profilePath)){
            const packageObj = fs.readJsonSync(this.profilePath)
            return packageObj[key];
        }
        return undefined
    }

    static delete(){
        fs.removeSync(this.profilePath)
    }   
}

module.exports = ProfileManager;