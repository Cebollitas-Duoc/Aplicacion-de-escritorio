document.addEventListener('DOMContentLoaded', async () =>{
    ReserveDocumentsManager.initiate();
})

class ReserveDocumentsManager{
    static cardContainer;
    static documents;
    static popup;

    static cardTemplate = `
        <div class="card userRow" onclick="ReserveDocumentsManager.showDocument('<<id>>')">
            <div class="card-body">
                <div class="container text-center align-middle">
                    <div class="row">
                        <div class="col-12">
                            <<category>>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    static initiate(){
        this.cardContainer = ReserveManager.popup.querySelector(".reserveFiles");
        this.popup = document.querySelector("#tab-reserves .popup.document");
    }

    static async setDocuments(){
        this.cardContainer.innerHTML = ""
        this.documents = await this.getDocuments()
        this.documents.forEach(async (doc) => {
            var card = await this.createDocumentCard(doc)
            appendStringElement(this.cardContainer, card)
        });
    }

    static async getDocuments(){
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
        await fetch(`${apidomain}/files/listdocs/${reservePopUpManager.reserveId}/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static async createDocumentCard(srv){
        var card = this.cardTemplate;
        card = card.replaceAll("<<id>>", srv.Id_Document)
        card = card.replace("<<category>>", srv.Category)

        return card.toString()
    }

    static async showDocument(id){
        const url = `${apidomain}/files/getdoc/${id}`
        window.api.openBrowser(url)
    }
}