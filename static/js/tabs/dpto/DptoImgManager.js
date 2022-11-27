document.addEventListener('DOMContentLoaded', async () =>{
    departmentImgManager_popup = document.querySelector("#tab-departmentManager .popup.image");

    DptoImgManager.initiate();
})

class DptoImgManager{
    static imageContainer;
    static selectedImg;
    static selectedImgId;
    static input_imagen;
    
    static initiate(){
        this.imageContainer = document.querySelector("#tab-departmentManager .popup.image .image-container");
        this.input_imagen   = document.querySelector("#tab-departmentManager .popup.image  input.ImagenInput");
    }

    static cardTemplate = `
    <div id="dptoimg-<<id>>" class="card dpto-image <<main>>" onclick="DptoImgManager.selectImg(<<id>>)">
            <img class="card-img-top" src="<<image>>">
    </div>
    `

    static async showPopup(){
        await hideAllPopUps();
        departmentImgManager_popup.classList.remove("d-none");
        
        this.fillImages()
    }

    static async getImages(dptoId){
        var formdata = new FormData();
        var r

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/departamentos/viewfotosdpto/${dptoId}/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static async fillImages(){
        this.selectedImg = undefined;
        this.selectedImgId = undefined;
        const dptoId = DepartmentManager.input_id.value
        const images = await this.getImages(dptoId);
        DptoImgManager.imageContainer.innerHTML = ""
        images.forEach(async (img) => {
            var card = await this.createImgCard(img)
            appendStringElement(this.imageContainer, card)
        });
    }

    static async createImgCard(img){
        var card = this.cardTemplate

        card = card.replaceAll("<<id>>", img.Id_FotoDpto)
        card = card.replace("<<image>>",  `${apidomain}/files/getimage/${img.Path}`)
        if (img.Main == 1)
            card = card.replace("<<main>>",  "main")
        else
            card = card.replace("<<main>>",  "")

        return card.toString()
    }
    
    static selectImg(dptoimgid){
        if (this.selectedImg != undefined)
        this.selectedImg.classList.remove("selected");

        this.selectedImgId = dptoimgid
        this.selectedImg = document.querySelector(`#dptoimg-${dptoimgid}`);

        this.selectedImg.classList.add("selected");
    }

    static async addImage(){
        const response = await this.addimgRequest();
        if ("Error" in response)
            printGlobalErrorMessage(response.Error)
        else if ("ImagenAgregada" in response && response.ImagenAgregada){
            printGlobalSuccessMessage("Imagen agregada")
            this.input_imagen.value = ""
            DepartmentManager.updateDptoList()
            this.fillImages();
        }
        else
            printGlobalErrorMessage("Error desconocido")
    }
    static async makeMainImage(){
        if (this.selectedImgId == undefined) return;

        const response = await this.updateimgRequest(1, 0);
        if ("Error" in response)
            printGlobalErrorMessage(response.Error)
        else if ("ImagenModificada" in response && response["ImagenModificada"]){
            printGlobalSuccessMessage("Imagen modificada")
            this.fillImages();
            DepartmentManager.updateDptoList()
        }
        else
            printGlobalErrorMessage("Error desconocido")
    }
    static async deleteImage(){
        if (this.selectedImgId == undefined) return;

        const response = await this.deleteimgRequest();
        if ("Error" in response)
            printGlobalErrorMessage(response.Error)
        else if ("Imagen borrada" in response && response["Imagen borrada"]){
            printGlobalSuccessMessage("Imagen borrada")
            this.fillImages();
            DepartmentManager.updateDptoList()
        }
        else
            printGlobalErrorMessage("Error desconocido")
    }
    
    static async addimgRequest(){
        if (this.input_imagen.files.length == 0)
            return {"Error": "No hay una imagen seleccionada para ser enviada."}

        var formdata = new FormData();
        const SessionKey = await window.api.getData("SessionKey")
        const imagen     = this.input_imagen.files[0]
        const dptoId     = DepartmentManager.input_id.value
        
        formdata.append("SessionKey",  SessionKey)
        formdata.append("IdApartment", dptoId)
        formdata.append("Main",        0)
        formdata.append("Imagen",      imagen)
        
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        await fetch(`${apiDomain}/admin/createfotodpto/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));
        
        var r
        return JSON.parse(r)
    }

    static async updateimgRequest(main, order){
        var formdata = new FormData();
        const SessionKey = await window.api.getData("SessionKey")
        
        formdata.append("SessionKey", SessionKey)
        formdata.append("IdImgDpto",  this.selectedImgId)
        formdata.append("Main",       main)
        formdata.append("Order",      order)
        
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        await fetch(`${apiDomain}/admin/updatefotodpto/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));
        
        var r
        return JSON.parse(r)
    }

    static async deleteimgRequest(){
        var formdata = new FormData();
        const SessionKey = await window.api.getData("SessionKey")
        
        formdata.append("SessionKey", SessionKey)
        formdata.append("IdDptoImg",  this.selectedImgId)
        
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        await fetch(`${apiDomain}/admin/deletefotodpto/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));
        
        var r
        return JSON.parse(r)
    }

}