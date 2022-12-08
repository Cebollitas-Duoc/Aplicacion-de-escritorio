document.addEventListener('DOMContentLoaded', async () =>{
    ReserveHiredServicesManager.initiate();
    ReserveHiredServicesEditor.initiate();
})

class ReserveHiredServicesManager{
    static cardContainer;
    static services;

    static cardTemplate = `
        <div class="card userRow" onclick="ReserveHiredServicesEditor.showPopup(<<id>>)">
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
                    <div class="row">
                        <div class="col-12">
                            <<description>>
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
        card = card.replaceAll("<<id>>", srv.Id_HiredExtSrv)
        card = card.replace("<<category>>", srv.Category)
        card = card.replace("<<value>>",    srv.Value)
        card = card.replace("<<estatus>>",  srv.Estate)
        card = card.replace("<<description>>",  srv.Description)

        return card.toString()
    }

    static findHiredService(id){
        const srv = this.services.filter(function (d){
            return d.Id_HiredExtSrv==id;
        });

        return srv[0]
    }
}

class ReserveHiredServicesEditor{
    static popup;
    static description;
    static selectedId;
    
    static initiate(){
        this.popup = document.querySelector("#tab-reserves .popup.hiredService");
        this.description = this.popup.querySelector("textarea.Comment");
    }

    static showPopup(id){
        this.selectedId = id;

        const srv = ReserveHiredServicesManager.findHiredService(id);
        this.description.value = srv.Comment;
        this.popup.classList.remove("d-none");
    }

    static close(){
        this.popup.classList.add("d-none");
    }

    static async edit(){
        const comment = this.description.value
        const editResponse = await this.editCommentRequest(comment);
        if ("CommentEdited" in editResponse && editResponse["CommentEdited"]){
            printGlobalSuccessMessage("Comentario editado");
            ReserveHiredServicesManager.setExtraServices();
            this.close()
        }
        else if ("Error" in editResponse) 
            printGlobalErrorMessage(editResponse["Error"])
        else
            printGlobalErrorMessage("Error desconocido")
    }

    static async editCommentRequest(comment){
        var formdata = new FormData();
        var apidomain = await window.api.apiDomain()

        formdata.append("Id_ExtSer", this.selectedId)
        formdata.append("Comment",   comment)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        var r
        await fetch(`${apidomain}/reservas/edithiredextraservicecomment/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}