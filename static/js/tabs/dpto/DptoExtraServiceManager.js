document.addEventListener('DOMContentLoaded', async () =>{
    DptoExtraServiceManager.initiate();
    DptoCategoryExtraServiceManager.setCategorys()
})

class DptoExtraServiceManager{
    static services;
    static popup;
    static serviceContainer;
    static category;
    static status;
    static worker;
    static value;

    static cardTemplate = `
        <div id="dptoextsrv-<<id>>" class="card" onclick="EditDptoExtraService.selectSrv(<<id>>)">
            <div class="card-body">
                <div class="container text-center align-middle">
                    <div class="row">
                        <div class="col-4">
                            <<category>>
                        </div>
                        <div class="col-2">
                            <<state>>
                        </div>
                        <div class="col-4">
                            <<worker>>
                        </div>
                        <div class="col-2">
                            <<value>>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    static initiate(){
        this.popup = document.querySelector("#tab-departmentManager .popup.extraservice");
        this.serviceContainer = document.querySelector("#tab-departmentManager .popup.extraservice .extraservice-container");
        this.category = document.querySelector("#tab-departmentManager .popup.extraservice div.inputs .category");
        this.status   = document.querySelector("#tab-departmentManager .popup.extraservice div.inputs .status");
        this.worker   = document.querySelector("#tab-departmentManager .popup.extraservice div.inputs .worker");
        this.value    = document.querySelector("#tab-departmentManager .popup.extraservice div.inputs .value");
    }

    static async showPopup(){
        this.setServices();
        await hideAllPopUps();
        this.popup.classList.remove("d-none");
    }

    static async setServices(){
        this.serviceContainer.innerHTML = ""
        this.services = await this.getDptoExtraService(DepartmentManager.input_id.value)
        this.services.forEach(async (srv) => {
            var card = await this.createSrvCard(srv)
            appendStringElement(this.serviceContainer, card)
        });
    }

    static async getDptoExtraService(Id_Dpto){
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/departamentos/listextraservices/${Id_Dpto}/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static async createSrvCard(srv){
        srv = await this.getExtSrvFormattedData(srv);
        var card = this.cardTemplate;
        card = card.replaceAll("<<id>>", srv.Id_ExtraService)
        card = card.replace("<<category>>", srv.category)
        card = card.replace("<<state>>",    srv.status)
        card = card.replace("<<worker>>", srv.worker)
        card = card.replace("<<value>>", srv.Valor)

        return card.toString()
    }

    static async getExtSrvFormattedData(srv){
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
            const catid = srv.Id_Category
            const category = DptoCategoryExtraServiceManager.categorys.find(
                cat => cat.Id_Category == catid);
            if (category == undefined) return undefined;
            return category.Description;
        }
        //TODO
        function getWorker(srv){
            const workerId = srv.Id_Trabajador
            return workerId;
        }

        if (DptoCategoryExtraServiceManager.categorys == {})
            await DptoCategoryExtraServiceManager.setCategorys();

        srv.status   = getStatus(srv)
        srv.category = getCategorys(srv)
        srv.worker   = getWorker(srv)

        return srv
    }
}

class DptoCategoryExtraServiceManager{
    static categorys = {}
    static async setCategorys(){
        this.categorys = await this.getCategorys()
        AddDptoService.dd_category.innerHTML = ""
        this.categorys.forEach(async (category) => {
            var option = `<option value="${category.Id_Category}">${category.Description}</option>`
            appendStringElement(DptoExtraServiceManager.category, option)
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

        await fetch(`${apidomain}/departamentos/listextraservicecategories/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}

class EditDptoExtraService{
    static selectedExtSrv;
    static selectedExtSrvId;

    static async editService(){
        const idStatus = parseInt(DptoExtraServiceManager.status.value)
        const value    = parseInt(DptoExtraServiceManager.value.value)
        var idWorker   = DptoExtraServiceManager.worker.value
        if (idWorker == "null") idWorker = undefined;
        else idWorker = parseInt(idWorker);

        if (this.selectedExtSrvId == undefined){
            printGlobalErrorMessage("no hay un servicio seleccionado");
            return;
        }

        const response = await this.editServiceQuery(this.selectedExtSrvId, idStatus, idWorker, value)
        if ("Servicio_Modificado" in response && response["Servicio_Modificado"]){
            printGlobalSuccessMessage("Servicio modificado")
            DptoExtraServiceManager.setServices()
        }
        else if ("Error" in response) 
            printGlobalErrorMessage(response["Error"])
        else
            printGlobalErrorMessage("Error desconocido al editar servicio")
    }

    static async editServiceQuery(extSrvId, idStatus, idWorker, value){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        formdata.append("SessionKey",   SessionKey)
        formdata.append("IdExtraSrv",   extSrvId)
        formdata.append("IdState",      idStatus)
        formdata.append("IdTrabajador", idWorker)
        formdata.append("Valor",        value)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/admin/editextraservice/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static selectSrv(dptoExtSrvid){
        if (this.selectedExtSrv != undefined)
        this.selectedExtSrv.classList.remove("selected");

        this.selectedExtSrvId = dptoExtSrvid
        this.selectedExtSrv = document.querySelector(`#dptoextsrv-${dptoExtSrvid}`);

        this.selectedExtSrv.classList.add("selected");

        this.setServiceData(dptoExtSrvid)
    }

    static setServiceData(idExtSrv){
        const extSrv = DptoExtraServiceManager.services.find(
            srv => srv.Id_ExtraService == idExtSrv);
        if (extSrv == undefined) return;
        DptoExtraServiceManager.category.value = extSrv.Id_Category;
        DptoExtraServiceManager.status.value   = extSrv.Id_Estado;
        DptoExtraServiceManager.worker.value   = extSrv.Id_Trabajador;
        DptoExtraServiceManager.value.value    = extSrv.Valor;
    }
}

class AddDptoExtraService{
    static async addService(){
        const idDpto     = DepartmentManager.input_id.value
        const idCategory = DptoExtraServiceManager.category.value
        const idStatus   = DptoExtraServiceManager.status.value
        const idWorker   = DptoExtraServiceManager.worker.value
        const value      = DptoExtraServiceManager.value.value
        
        const response = await this.addExtraServiceQuery(idDpto, idCategory, idStatus, idWorker, value)
        if ("ServicioExtra_Agregado" in response && response["ServicioExtra_Agregado"]){
            printGlobalSuccessMessage("Servicio extra agregado")
            DptoExtraServiceManager.setServices()
        }
        else if ("Error" in response) 
            printGlobalErrorMessage(response["Error"])
        else
            printGlobalErrorMessage("Error desconocido al agregar servicio extra")
    }

    static async addExtraServiceQuery(idDpto, idCategory, idStatus, idWorker, value){
        if (idWorker == "null") idWorker = undefined;
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        formdata.append("SessionKey",   SessionKey)
        formdata.append("IdDpto",       idDpto)
        formdata.append("IdCategory",   idCategory)
        formdata.append("IdState",      idStatus)
        formdata.append("IdTrabajador", idWorker)
        formdata.append("Valor",        value)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/admin/addextraservice/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}