const fs = require('fs-extra');
const nunjucks = require('nunjucks')

class Renderer {
    static win;

    static async render(template, context = {}){
        console.log("rendering")
        console.log(template)
        const cacheFile = "templates/Cache.html"
        function writeCache(s){
            fs.readFile(cacheFile, 'utf8', function (err,data) {
                fs.writeFileSync(cacheFile, s, 'utf8', function (err) {
                   if (err) return console.log(err);
                });
            });
        }
    
        const universalContext = {}
        const html = nunjucks.render("templates/"+template, context + universalContext);
        
        writeCache(html)
        //await win.loadFile(cacheFile);
        await this.win.loadURL(`file://${__dirname}/${cacheFile}`)
        writeCache(" ")
        
    }
}

module.exports = Renderer;