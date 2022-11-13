document.addEventListener('DOMContentLoaded', async () =>{
    ServiceCategoryManager.initiate()
})

class ServiceCategoryManager{
    static CategoryContainer;
    static ExtraCategoryContainer;
    
    static cardTemplate = `
        <div class="card userRow">
            <div class="card-body">
                <div class="container text-center align-middle">
                    <<category>>"
                </div>
            </div>
        </div>
    `

    static initiate(){
        this.CategoryContainer      = document.querySelector("#tab-serviceCategory .cardContainer .serviceCategory");
        this.ExtraCategoryContainer = document.querySelector("#tab-serviceCategory .cardContainer .extraServiceCategory");

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