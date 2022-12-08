document.addEventListener('DOMContentLoaded', async () =>{
    ServiceCategoryManager.initiate()
    AddServiceCategory.initiate()
})

class ServiceCategoryManager{
    static CategoryContainer;
    static ExtraCategoryContainer;
    static popup;
    
    static cardTemplate = `
        <div class="card userRow">
            <div class="card-body">
                <div class="container text-center align-middle">
                    <<category>>
                </div>
            </div>
        </div>
    `

    static initiate(){
        this.CategoryContainer      = document.querySelector("#tab-serviceCategory .cardContainer .serviceCategory");
        this.ExtraCategoryContainer = document.querySelector("#tab-serviceCategory .cardContainer .extraServiceCategory");
        this.popup = document.querySelector("#tab-serviceCategory .popup");

        this.listCategorys();
        this.listExtraCategorys();
    }

    static async listCategorys(){
        this.CategoryContainer.innerHTML = ""
        this.categorys = await this.getServiceCategorys()
        this.categorys.forEach(async (srv) => {
            var card = await this.createCatCard(srv)
            appendStringElement(this.CategoryContainer, card)
        });
    }

    static async listExtraCategorys(){
        this.ExtraCategoryContainer.innerHTML = ""
        this.extraCategorys = await this.getExtraServiceCategorys()
        this.extraCategorys.forEach(async (srv) => {
            var card = await this.createCatCard(srv)
            appendStringElement(this.ExtraCategoryContainer, card)
        });
    }

    static async createCatCard(cat){
        if (cat.Description == undefined) cat.Description = cat.Descripcion;

        var card = this.cardTemplate;
        card = card.replace("<<category>>", cat.Description)
        return card.toString()
    }

    static async getServiceCategorys(Id_Dpto){
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/departamentos/listservicecategories/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static async getExtraServiceCategorys(Id_Dpto){
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/departamentos/listextraservicecategories/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}

class AddServiceCategory{
    static button_add;
    static description;
    static type;

    static initiate(){
        this.button_add  = document.querySelector("#tab-serviceCategory .popup button.btn");
        this.description = document.querySelector("#tab-serviceCategory .popup input.description");
        this.type        = document.querySelector("#tab-serviceCategory .popup select.type");

        this.button_add.addEventListener("click", async ()=>{
            this.addCategory();
        })
    }

    static showPopUp(){
        ServiceCategoryManager.popup.classList.remove("d-none");
    }

    static async addCategory(){
        const description = this.description.value;
        const type        = this.type.value;
        const response = await this.addCategoryQuery(description, type)
        if ("category_added" in response && response["category_added"]){
            printGlobalSuccessMessage("Categoria agregada")
            ServiceCategoryManager.listCategorys();
            ServiceCategoryManager.listExtraCategorys();
            DptoCategoryExtraServiceManager.setCategorys();
            DptoCategoryServiceManager.setCategorys();
        }
        else if ("Error" in response) 
            printGlobalErrorMessage(response["Error"])
        else
            printGlobalErrorMessage("Error desconocido al agregar categoria")
    }

    static async addCategoryQuery(description, type){
        const SessionKey  = await window.api.getData("SessionKey");
        var formdata = new FormData();
        var r;
        var apidomain = await window.api.apiDomain();

        formdata.append("SessionKey",  SessionKey);
        formdata.append("Description", description);
        formdata.append("IsExtra",     type);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/admin/addservicecategory/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}
