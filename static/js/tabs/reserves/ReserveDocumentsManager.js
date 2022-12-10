document.addEventListener('DOMContentLoaded', async () =>{
    ReserveDocumentsManager.initiate();
    ReserveDocumentAdder.initiate()
})

class ReserveDocumentsManager{
    static cardContainer;
    static documents;
    static checkoutButton;

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
        this.checkoutButton = ReserveManager.popup.querySelector(".checkout");
    }

    static async setDocuments(){
        this.cardContainer.innerHTML = ""
        this.checkoutButton.classList.remove("d-none");
        this.documents = await this.getDocuments()
        this.documents.forEach(async (doc) => {
            var card = await this.createDocumentCard(doc);
            appendStringElement(this.cardContainer, card);
            if (doc.Id_Category == 2) this.checkoutButton.classList.add("d-none");
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

class ReserveDocumentAdder{
    static input;
    static popup;
    static categorySelector;
    
    static initiate(){
        this.input = ReserveManager.popup.querySelector("input.documentInput");
        this.popup = document.querySelector("#tab-reserves .popup.upload");
        this.categorySelector  = this.popup.querySelector("select.category");

        this.input.addEventListener("change", function () {
            if (ReserveDocumentAdder.input.files.length > 0) {
                ReserveDocumentAdder.popup.classList.remove("d-none");
            }
        });
    }

    static selectDocument(){
        this.input.click();
    }

    static closePopup(){
        this.popup.classList.add("d-none");
    }

    static async uploadDocument(){
        
        if (this.input.files.length == 0){
            printGlobalErrorMessage("Debes seleccionar un documento");
            return;
        }
        if (this.categorySelector.value == ""){
            printGlobalErrorMessage("Debes seleccionar un tipo de documento");
            return;
        } 

        const document = this.input.files[0];
        const idCategory = this.categorySelector.value;
        const idReserve = reservePopUpManager.reserveId;

        const uploadDocumentResponse = await this.uploadDocumentRequest(document, idCategory, idReserve);
        if ("FileSaved" in uploadDocumentResponse && uploadDocumentResponse["FileSaved"]){
            printGlobalSuccessMessage("Documento subido")
            this.closePopup()
            await ReserveDocumentsManager.setDocuments()
        }
        else if ("Error" in uploadDocumentResponse) 
            printGlobalErrorMessage(uploadDocumentResponse["Error"])
        else
            printGlobalErrorMessage("Error desconocido")
    }

    static async uploadDocumentRequest(document, idCategory, idReserve){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var apidomain = await window.api.apiDomain()

        formdata.append("SessionKey",  SessionKey)
        formdata.append("Document",    document)
        formdata.append("Id_Category", idCategory)
        formdata.append("Id_Reserve",  idReserve)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        var r
        await fetch(`${apidomain}/files/savedoc/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}

class DocumentCheckOut{
    static async crearCheckOut(){
        const idReserve = reservePopUpManager.reserveId;

        const crearCheckOutResponse = await this.crearCheckOutRequest(idReserve);
        if ("FileSaved" in crearCheckOutResponse && crearCheckOutResponse["FileSaved"]){
            printGlobalSuccessMessage("Documento subido")
            await ReserveDocumentsManager.setDocuments()
        }
        else if ("Error" in uploadDocumentResponse) 
            printGlobalErrorMessage(uploadDocumentResponse["Error"])
        else
            printGlobalErrorMessage("Error desconocido")
    }

    static async crearCheckOutRequest(idRsv){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var apidomain = await window.api.apiDomain()

        formdata.append("SessionKey",  SessionKey)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        var r
        await fetch(`${apidomain}/files/createcheckout/${idRsv}/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}