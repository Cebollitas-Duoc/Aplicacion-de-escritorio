document.addEventListener('DOMContentLoaded', async () =>{
    ReserveExtraServicesManager.initiate();
})

class ReserveExtraServicesManager{
    static cardContainer;
    static services;

    static cardTemplate = `
        <div class="card userRow">
            <div class="card-body">
                <div class="container text-center align-middle">
                    <div class="row">
                        <div class="col-4">
                            <<category>>
                        </div>
                        <div class="col-4">
                            <<value>>
                        </div>
                        <div class="col-4">
                            <<estatus>>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    static initiate(){
        this.cardContainer = ReserveManager.popup.querySelector(".reserveExtraService");
    }

    static async setExtraServices(){
        this.cardContainer.innerHTML = ""
        this.services = await this.getExtraServices()
        this.services.forEach(async (srv) => {
            var card = await this.createExtSrvCard(srv)
            appendStringElement(this.cardContainer, card)
        });
    }

    static async getExtraServices(){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var apidomain = await window.api.apiDomain()
        
        formdata.append("SessionKey",   SessionKey)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        var r
        await fetch(`${apidomain}/reservas/listReserveExtraServices/${reservePopUpManager.reserveId}/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static async createExtSrvCard(srv){
        var card = this.cardTemplate;
        card = card.replace("<<category>>", srv.Category)
        card = card.replace("<<value>>",    srv.Value)
        card = card.replace("<<estatus>>",  srv.Estate)

        return card.toString()
    }
}