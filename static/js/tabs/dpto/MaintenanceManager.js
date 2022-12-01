document.addEventListener('DOMContentLoaded', async () =>{
    MaintenanceManager.initiate()
})

class MaintenanceManager{
    static popup;
    static container;
    static maintenance;

    static category;
    static description;
    static value;
    static startDate;
    static endDate;
    
    static cardTemplate = `
    <div id="maintenance-<<id>>" class="card" onclick="MaintenanceSelector.select(<<id>>)">
        <div class="card-body">
            <div class="container text-center align-middle">
                <div class="row">
                    <div class="col-4">
                        <<category>>
                    </div>
                    <div class="col-4">
                        <<startDate>> / <<endDate>>
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
        this.popup = document.querySelector("#tab-departmentManager .popup.maintenance");
        this.container = this.popup.querySelector(".item-container");

        this.category    = this.popup.querySelector("select.category");
        this.description = this.popup.querySelector("textarea.description");
        this.value       = this.popup.querySelector("input.value");
        this.startDate   = this.popup.querySelector("input.startDate");
        this.endDate     = this.popup.querySelector("input.endDate");
    }

    static async showPopup(){
        this.setList();
        await hideAllPopUps();
        this.popup.classList.remove("d-none");
    }

    static async setList(){
        this.container.innerHTML = ""
        this.maintenance = await this.getDptoMaintenances(DepartmentManager.input_id.value)
        this.maintenance.forEach(async (obj) => {
            var card = await this.createmaintenanceCard(obj)
            appendStringElement(this.container, card)
        });
    }

    static async createmaintenanceCard(obj){
        var card = this.cardTemplate;
        card = card.replaceAll("<<id>>",     obj.Id_Maintenance)
        card = card.replace("<<category>>",  obj.Category)
        card = card.replace("<<startDate>>", obj.StartDate)
        card = card.replace("<<endDate>>",   obj.EndDate)
        card = card.replace("<<value>>",     obj.Value)

        return card.toString()
    }

    static async getDptoMaintenances(Id_Dpto){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        formdata.append("SessionKey",   SessionKey)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/admin/listmaintenance/${Id_Dpto}/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static resetInputs(){
        const today = new Date().toISOString().slice(0, 10);
        this.category.value    = 0
        this.value.value       = 1
        this.description.value = ""
        this.startDate.value   = today
        this.endDate.value     = today
    }
}

class addMaintenance{
    static async add(){
        const idDpto      = DepartmentManager.input_id.value
        const idCategory  = MaintenanceManager.category.value
        const value       = MaintenanceManager.value.value
        const description = MaintenanceManager.description.value
        const startDate   = new Date(MaintenanceManager.startDate.value).getTime();
        const endDate     = new Date(MaintenanceManager.endDate.value).getTime();
        
        if (idCategory == 0){
            printGlobalErrorMessage("Debe seleccionar una categoria");
            return;
        }

        const response = await this.addMaintenanceQuery(idDpto, idCategory, value, description, startDate, endDate);
        if ("MaintenanceAgregado" in response && response["MaintenanceAgregado"]){
            printGlobalSuccessMessage("Mantencion agregada");
            MaintenanceManager.resetInputs();
            MaintenanceManager.setList();
        }
        else if ("Error" in response) 
            printGlobalErrorMessage(response["Error"])
        else
            printGlobalErrorMessage("Error desconocido al agregar objeto")
    }

    static async addMaintenanceQuery(idDpto, idCategory, value, description, startDate, endDate){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        formdata.append("SessionKey",  SessionKey)
        formdata.append("IdDpto",      idDpto)
        formdata.append("IdCategory",  idCategory)
        formdata.append("Value",       value)
        formdata.append("Description", description)
        formdata.append("StartDate",   startDate)
        formdata.append("EndDate",     endDate)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/admin/addmaintenance/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}

class MaintenanceSelector{
    static selectedObj;
    static selectedObjId;

    static select(id){
        if (this.selectedObj != undefined)
            this.selectedObj.classList.remove("selected");

        if (id == this.selectedObjId){
            this.unselect();
            return;
        }

        this.selectedObjId = id
        this.selectedObj = document.querySelector(`#maintenance-${id}`);

        this.selectedObj.classList.add("selected");

        this.setObjData(id);
        this.updateButtons();
    }

    static unselect(){
        if (this.selectedObj != undefined)
        this.selectedObj.classList.remove("selected");

        this.selectedObjId = undefined;
        this.selectedObj = undefined;

        MaintenanceManager.resetInputs();
        this.updateButtons();
    }

    static setObjData(id){
        const obj = MaintenanceManager.maintenance.find(
            obj => obj.Id_Maintenance == id);
        if (obj == undefined) return;

        MaintenanceManager.category.value    = obj.Id_Cat;
        MaintenanceManager.description.value = obj.Description;
        MaintenanceManager.value.value       = obj.Value;
        MaintenanceManager.startDate.value   = new Date(obj.RawStartDate).toISOString().split('T')[0]
        MaintenanceManager.endDate.value     = new Date(obj.RawEndDate).toISOString().split('T')[0]
    }

    static updateButtons(){
        if (this.selectedObj == undefined){
            hideAllElements("button.edit", MaintenanceManager.popup)
            showAllElements("button.add", MaintenanceManager.popup)
        }
        else {
            hideAllElements("button.add", MaintenanceManager.popup)
            showAllElements("button.edit", MaintenanceManager.popup)
        }
    }
}