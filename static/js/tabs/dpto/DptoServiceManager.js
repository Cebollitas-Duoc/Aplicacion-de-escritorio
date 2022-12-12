document.addEventListener('DOMContentLoaded', async () =>{
    DptoServiceManager.initiate();
})

class DptoServiceManager{
    static popup;
    static serviceContainer;
    static services = {}
    static dd_category;
    static dd_estado;
    static input_cantidad;
    
    static initiate(){
        this.popup = document.querySelector("#tab-departmentManager .popup.service");
        this.serviceContainer = document.querySelector("#tab-departmentManager .popup.service .service-container");
        this.dd_category = document.querySelector("#tab-departmentManager .popup.service .serviceCategory");
        this.dd_estado = document.querySelector("#tab-departmentManager .popup.service .estado");
        this.input_cantidad = document.querySelector("#tab-departmentManager .popup.service .cantidad");

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
        EditDptoService.unSelect();
        EditDptoService.updateButtons();
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
        DptoServiceManager.dd_category.innerHTML = "<option value='0'>Categoria de servicio</option>"
        this.categorys.forEach(async (category) => {
            var option = `<option value="${category.Id_Categoria}">${category.Descripcion}</option>`
            appendStringElement(DptoServiceManager.dd_category, option)
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
    
    static async addService(){
        const idCategory = DptoServiceManager.dd_category.value
        const idEstado   = DptoServiceManager.dd_estado.value
        const cantidad   = DptoServiceManager.input_cantidad.value
        const idDpto = DepartmentManager.input_id.value
        
        if (idCategory == 0){
            printGlobalErrorMessage("Debe seleccionar una categoria");
            return;
        }

        const response = await this.addServiceQuery(idDpto, idCategory, idEstado, cantidad)
        if ("Servicio_Agregado" in response && response["Servicio_Agregado"]){
            printGlobalSuccessMessage("Servicio agregado")
            DptoServiceManager.setServices();
            EditDptoService.cleanValues();
        }
        else if ("Error" in response) 
            printGlobalErrorMessage(response["Error"])
        else
            printGlobalErrorMessage("Error desconocido al agregar servicio")
    }

    static async addServiceQuery(idDpto, idCategory, idEstado, cantidad){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        formdata.append("SessionKey", SessionKey)
        formdata.append("IdDpto",     idDpto)
        formdata.append("IdCategory", idCategory)
        formdata.append("IdState",    idEstado)
        formdata.append("Ammount",    cantidad)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/admin/addservice/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}

class EditDptoService{
    static selectedSrv;
    static selectedSrvId;

    static async editService(){
        const cantidad = parseInt(DptoServiceManager.input_cantidad.value)
        const estado = parseInt(DptoServiceManager.dd_estado.value)
        const idService = this.selectedSrvId
        if (idService == undefined){
            printGlobalErrorMessage("no hay un servicio seleccionado");
            return;
        }

        const response = await this.editServiceQuery(idService, estado, cantidad)
        if ("Servicio_Modificado" in response && response["Servicio_Modificado"]){
            printGlobalSuccessMessage("Servicio modificado")
            await Promise.all([ 
                DptoServiceManager.setServices(),
                this.unSelect()
            ])
            this.selectSrv(idService);
        }
        else if ("Error" in response) 
            printGlobalErrorMessage(response["Error"])
        else
            printGlobalErrorMessage("Error desconocido al editar servicio")
    }

    static async editServiceQuery(idSrv, idEstado, cantidad){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        formdata.append("SessionKey", SessionKey)
        formdata.append("IdSrv",      idSrv)
        formdata.append("IdEstado",   idEstado)
        formdata.append("Cantidad",   cantidad)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/admin/editservice/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static selectSrv(id){
        if (this.selectedSrv != undefined)
        this.selectedSrv.classList.remove("selected");

        if (id == this.selectedSrvId){
            this.unSelect();
            return;
        }

        this.setServiceData(id);

        this.selectedSrvId = id
        this.selectedSrv = document.querySelector(`#dptosrv-${id}`);

        this.selectedSrv.classList.add("selected");
        this.updateButtons();
    }

    static unSelect(changeCat=true){
        if (this.selectedSrv != undefined)
            this.selectedSrv.classList.remove("selected");

        this.selectedSrvId = undefined;
        this.selectedSrv   = undefined;

        this.cleanValues(changeCat);
        this.updateButtons();
    }

    static cleanValues(changeCat=true){
        if (changeCat)
            DptoServiceManager.dd_category.value = 0;
        DptoServiceManager.dd_estado.value       = 0;
        DptoServiceManager.input_cantidad.value  = 1;
    }

    static updateButtons(){
        if (this.selectedSrvId == undefined){
            hideAllElements("button.edit", DptoServiceManager.popup)
            showAllElements("button.add", DptoServiceManager.popup)
        }
        else {
            hideAllElements("button.add", DptoServiceManager.popup)
            showAllElements("button.edit", DptoServiceManager.popup)
        }
    }

    static setServiceData(id){
        const srv = DptoServiceManager.services.find(
            srv => srv.Id_Service == id);
        if (srv == undefined) return;
        DptoServiceManager.dd_category.value    = srv.Id_ServiceCategory;
        DptoServiceManager.dd_estado.value      = srv.Id_Estado;
        DptoServiceManager.input_cantidad.value = srv.Cantidad;
    }
}