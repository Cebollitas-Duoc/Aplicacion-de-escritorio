const fs = require('fs-extra');
const nunjucks = require('nunjucks')

class Renderer {
    static win;

    static async render(template, context = {}){
        console.log("rendering")
        console.log(template)
        const cacheFile = "templates/Cache.html"
        function writeCache(s){
            fs.writeFileSync(cacheFile, s, 'utf8', function (err) {
               if (err) return console.log(err);
            });
        }
    
        const universalContext = {}
        const html = nunjucks.render("templates/"+template, context + universalContext);
        
        writeCache(html)
        await this.win.loadFile(cacheFile);
        writeCache(" ")
    }
}

module.exports = Renderer;