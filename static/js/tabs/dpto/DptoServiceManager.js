document.addEventListener('DOMContentLoaded', async () =>{
    DptoServiceManager.initiate();
})

class DptoServiceManager{
    static popup;
    static serviceContainer;
    static dd_categoryAdd;
    static dd_categoryEdit;
    static services = {}
    static selectedSrv;
    static selectedSrvId;
    
    static initiate(){
        this.popup = document.querySelector("#tab-departmentManager .popup.service");
        this.serviceContainer = document.querySelector("#tab-departmentManager .popup.service .service-container");
        this.dd_categoryAdd   = document.querySelector("#tab-departmentManager .popup.service .serviceCategory.addService");
        this.dd_categoryEdit  = document.querySelector("#tab-departmentManager .popup.service .serviceCategory.editService");

        DptoCategoryServiceManager.setCategorys()
    }

    static cardTemplate = `
    <div id="dptosrv-<<id>>" class="card" onclick="DptoServiceManager.selectSrv(<<id>>)">
        <div class="card-body">
            <div class="container text-center align-middle">
                <div class="row">
                    <div class="col-4">
                        <<category>>
                    </div>
                    <div class="col-4">
                        Estado: <<state>>
                    </div>
                    <div class="col-4">
                        Cantidad: <<cantidad>>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `

    static async showPopup(){
        this.setServices();
        await hideAllPopUps();
        this.popup.classList.remove("d-none");
    }

    static async setServices(){
        this.serviceContainer.innerHTML = ""
        this.services = await this.getDptoService(DepartmentManager.input_id.value)
        this.services.forEach(async (srv) => {
            var card = await this.createSrvCard(srv)
            appendStringElement(this.serviceContainer, card)
        });
    }

    static async getDptoService(Id_Dpto){
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/departamentos/listservices/${Id_Dpto}/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static async createSrvCard(srv){
        srv = await this.getSrvFormattedData(srv);
        var card = this.cardTemplate;
        card = card.replaceAll("<<id>>", srv.Id_Service)
        card = card.replace("<<category>>", srv.category)
        card = card.replace("<<state>>",    srv.status)
        card = card.replace("<<cantidad>>", srv.Cantidad)

        return card.toString()
    }

    static async getSrvFormattedData(srv){
        function getStatus(srv){
            switch (srv.Id_Estado) {
                case 0:
                    return "Activo"
                case 1:
                    return "Inactivo"
                default:
                    return srv.Id_Estado
            }
        }
        function getCategorys(srv){
            const catid = srv.Id_ServiceCategory
            const category = DptoCategoryServiceManager.categorys.find(
                cat => cat.Id_Categoria == catid);
            if (category == undefined) return undefined;
            return category.Descripcion;
        }

        if (DptoCategoryServiceManager.categorys == {})
            await DptoCategoryServiceManager.setCategorys();

        srv.status   = getStatus(srv)
        srv.category = getCategorys(srv)

        return srv
    }

    static selectSrv(dptosrvid){
        if (this.selectedSrv != undefined)
        this.selectedSrv.classList.remove("selected");

        this.selectedSrvId = dptosrvid
        this.selectedSrv = document.querySelector(`#dptosrv-${dptosrvid}`);

        this.selectedSrv.classList.add("selected");
    }
}

class DptoCategoryServiceManager{
    static categorys = {}
    static async setCategorys(){
        this.categorys = await this.getCategorys()
        DptoServiceManager.dd_categoryAdd.innerHTML = ""
        DptoServiceManager.dd_categoryEdit.innerHTML = ""
        this.categorys.forEach(async (category) => {
            var option = `<option value="${category.Id_Categoria}">${category.Descripcion}</option>`
            appendStringElement(DptoServiceManager.dd_categoryAdd, option)
            appendStringElement(DptoServiceManager.dd_categoryEdit, option)
        });
    }

    static async getCategorys(){
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
}