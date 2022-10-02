const fs = require('fs-extra');

class ProfileManager {
    static save(key, value){
        const profilePath = 'profile.json'

        if (fs.existsSync(profilePath)){
            var profile = fs.readJsonSync(profilePath)
        }else{
            var profile = {}
        }
        profile[key] = value;
        fs.writeJSONSync(profilePath, profile);
    }

    static load(key){
        const profilePath = 'profile.json'
        
        if (fs.existsSync(profilePath)){
            const packageObj = fs.readJsonSync(profilePath)
            return packageObj[key];
        }
    }
}

module.exports = ProfileManager;