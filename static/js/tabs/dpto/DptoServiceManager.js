document.addEventListener('DOMContentLoaded', async () =>{
    DptoServiceManager.initiate();
    AddDptoService.initiate();
    EditDptoService.initiate();
})

class DptoServiceManager{
    static popup;
    static serviceContainer;
    static services = {}
    
    static initiate(){
        this.popup = document.querySelector("#tab-departmentManager .popup.service");
        this.serviceContainer = document.querySelector("#tab-departmentManager .popup.service .service-container");

        DptoCategoryServiceManager.setCategorys()
    }

    static cardTemplate = `
    <div id="dptosrv-<<id>>" class="card" onclick="EditDptoService.selectSrv(<<id>>)">
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
        EditDptoService.selectedSrv = undefined
        EditDptoService.selectedSrvId = undefined
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

    
}

class DptoCategoryServiceManager{
    static categorys = {}
    static async setCategorys(){
        this.categorys = await this.getCategorys()
        AddDptoService.dd_category.innerHTML = ""
        this.categorys.forEach(async (category) => {
            var option = `<option value="${category.Id_Categoria}">${category.Descripcion}</option>`
            appendStringElement(AddDptoService.dd_category, option)
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

class AddDptoService{
    static dd_category;

    static initiate(){
        this.dd_category = document.querySelector("#tab-departmentManager .popup.service .serviceCategory.addService");
    }

    static addService(){
        const idService = this.dd_category.value
        const idDpto = DepartmentManager.input_id.value
        console.log(idService, idDpto)
    }
}

class EditDptoService{
    static selectedSrv;
    static selectedSrvId;
    static dd_estado;
    static input_cantidad;

    static initiate(){
        this.dd_estado = document.querySelector("#tab-departmentManager .popup.service .cantidad");
        this.input_cantidad = document.querySelector("#tab-departmentManager .popup.service .estado");
    }

    static editService(){
        const cantidad = this.input_cantidad.value
        const estado = this.dd_estado.value

        if (this.selectedSrvId == undefined){
            printGlobalErrorMessage("no hay un servicio seleccionado");
            return;
        }

        console.log(this.selectedSrvId, cantidad, estado)
    }

    static selectSrv(dptosrvid){
        if (this.selectedSrv != undefined)
        this.selectedSrv.classList.remove("selected");

        this.selectedSrvId = dptosrvid
        this.selectedSrv = document.querySelector(`#dptosrv-${dptosrvid}`);

        this.selectedSrv.classList.add("selected");
    }
}