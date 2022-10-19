document.addEventListener('DOMContentLoaded', async () =>{
    departmentImgManager_popup = document.querySelector("#tab-departmentManager .popup.image");

    DptoImgManager.setPopUpInputs();
})

class DptoImgManager{
    static imageContainer;
    
    static setPopUpInputs(){
        this.imageContainer = document.querySelector("#tab-departmentManager .popup.image .image-container");
    }

    static cardTemplate = `
    <div class="card dpto-image <<main>>">
            <img class="card-img-top" src="<<image>>">
    </div>
    `

    static async showDptoImgPopup(){
        await hideAllPopUps();
        departmentImgManager_popup.classList.remove("d-none");
        
        this.fillImages()
    }

    static async getImages(dptoId){
        var formdata = new FormData();
        var r
        formdata.append("IdApartment", dptoId);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/departamentos/viewfotosdpto/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static async fillImages(){
        const dptoId = DepartmentManager.input_id.value
        const images = await this.getImages(dptoId);
        DptoImgManager.imageContainer.innerHTML = ""
        images.forEach(async (img) => {
            console.log(img)
            var card = await this.createImgCard(img)
            appendStringElement(this.imageContainer, card)
        });
    }

    static async createImgCard(img){
        var card = this.cardTemplate

        card = card.replace("<<image>>",  `${apidomain}/files/getimage/${img.Path}`)
        if (img.Main == 1)
            card = card.replace("<<main>>",  "main")
        else
            card = card.replace("<<main>>",  "")

        return card.toString()
    }
}