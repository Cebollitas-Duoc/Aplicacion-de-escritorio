document.addEventListener('DOMContentLoaded', async () =>{
    Settings.initiate();
})

class Settings{
    static input_apidomain;
    static input_webdomain;
    static button_save;

    static initiate(){
        console.log("asdasd")
        this.input_apidomain = document.querySelector("#tab-settings input.dominio-api");
        this.input_webdomain = document.querySelector("#tab-settings input.dominio-web");
        this.button_save = document.querySelector("#tab-settings button.save");

        this.loadValues();

        this.button_save.addEventListener('click', async () =>{
            this.saveSettings()
        })
        
    }

    static async loadValues(){
        const apidomain =  await window.api.apiDomain()
        const webdomain =  await window.api.webDomain()

        this.input_apidomain.value = apidomain
        this.input_webdomain.value = webdomain
    }

    static saveSettings(){
        const apidomain = this.input_apidomain.value
        const webdomain = this.input_webdomain.value

        window.api.setSettingsData("apidomain", apidomain)
        window.api.setSettingsData("webdomain", webdomain)

        printGlobalSuccessMessage("Configuracion guardada")
    }
}