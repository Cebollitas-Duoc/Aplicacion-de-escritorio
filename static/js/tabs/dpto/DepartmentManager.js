document.addEventListener('DOMContentLoaded', async () =>{
    departmentManager_cardsContainer     = document.querySelector("#tab-departmentManager .cardContainer");
    departmentManager_popup           = document.querySelector("#tab-departmentManager .popup.dpto");
    departmentManager_button_updateList  = document.querySelector("#tab-departmentManager nav .btn-update");
    departmentManager_button_addDpto     = document.querySelector("#tab-departmentManager nav .btn-add");
    departmentManager_popup_addButton    = document.querySelector("#tab-departmentManager .popup form .btn.add")
    departmentManager_popup_updateButton = document.querySelector("#tab-departmentManager .popup form .btn.update")

    DepartmentManager.setPopUpInputs()

    DepartmentManager.updateDptoList()
    departmentManager_button_addDpto.addEventListener('click', async () =>{
        DepartmentAdder.showAddDptoMenu()
    })

    departmentManager_popup_addButton.addEventListener('click', async () =>{
        DepartmentAdder.addDpto();
    })

    departmentManager_popup_updateButton.addEventListener('click', async () =>{
        DepartmentUpdater.updateDpto();
    })
})

class DepartmentManager{
    static input_id
    static input_address
    static input_latitud
    static input_longitud
    static input_rooms
    static input_bathrooms
    static input_size
    static input_Value
    static input_status
    static input_description
    static dptos = {}

    static setPopUpInputs(){

        this.input_id          = document.querySelector("#tab-departmentManager .popup.dpto .dptoId")
        this.input_address     = document.querySelector("#tab-departmentManager .popup.dpto .address")
        this.input_latitud     = document.querySelector("#tab-departmentManager .popup.dpto .latitud")
        this.input_longitud    = document.querySelector("#tab-departmentManager .popup.dpto .longitud")
        this.input_rooms       = document.querySelector("#tab-departmentManager .popup.dpto .rooms")
        this.input_bathrooms   = document.querySelector("#tab-departmentManager .popup.dpto .bathrooms")
        this.input_size        = document.querySelector("#tab-departmentManager .popup.dpto .size")
        this.input_Value       = document.querySelector("#tab-departmentManager .popup.dpto .value")
        this.input_status      = document.querySelector("#tab-departmentManager .popup.dpto .status")
        this.input_description = document.querySelector("#tab-departmentManager .popup.dpto .description")
    }

    static cardTemplate = `
    <div class="card userRow">
        <div class="card-body">
            <div class="container text-center align-middle">
                <div class="row">
                    <div class="col-1 mainIcon">
                        <img src="<<imagen>>" alt="" class=" rounded-circle me-2">
                    </div>
                    <div class="col-4">
                        <<address>>
                    </div>
                    <div class="col-2">
                        Estado: <<estado>>
                    </div>
                    <div class="col-2">
                        Valor: <<valor>>
                    </div>
                    <div class="col-1 editIcon" onclick="DepartmentUpdater.showEditDptoMenu(<<id>>)">
                        <img src="../static/img/edit.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    
    static async updateDptoList(){
        this.dptos = await this.getDptos()

        departmentManager_cardsContainer.innerHTML = ""
        this.dptos.forEach(async (user) => {
            var card = await this.createDptoCard(user)
            appendStringElement(departmentManager_cardsContainer, card)
        });
    }

    static async getDptos(){
        var formdata = new FormData();
        var r
        formdata.append("SessionKey", await window.api.getData("SessionKey"));
        var apidomain = await window.api.apiDomain()

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/departamentos/viewdptos/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
    
    static async createDptoCard(dpto){
        var card = this.cardTemplate
        dpto = await this.getDptoFormattedData(dpto)
        card = card.replace("<<imagen>>",  dpto.ImageUrl)
        card = card.replace("<<address>>", dpto.Address)
        card = card.replace("<<estado>>",  dpto.Status)
        card = card.replace("<<valor>>",   dpto.Value)
        card = card.replace("<<id>>",      dpto.Id_Dpto)

        return card.toString()
    }

    static async getDptoFormattedData(dpto){
        apiDomain = await window.api.apiDomain()
        function getStatus(dpto){
            switch (dpto.Id_State) {
                case 0:
                    return "Activo"
                case 1:
                    return "Inactivo"
                default:
                    return user.Id_State
            }
        }
        function getImg(dpto){
            if (dpto.Imagen != undefined)
                return `${apiDomain}/files/getimage/${dpto.Imagen }`
            return "../static/img/defaultDptoImg.jpg"
        } 
        dpto.Status   = getStatus(dpto)
        dpto.ImageUrl = getImg(dpto)

        return dpto
    }

    static findDpto(dptoId){
        const dpto = this.dptos.filter(function (d){
            return d.Id_Dpto==dptoId;
        });

        return dpto[0]
    }
}

class DepartmentAdder{
    static showAddDptoMenu(){
        DepartmentManager.input_id.value          = ""
        DepartmentManager.input_address.value     = ""
        DepartmentManager.input_latitud.value     = ""
        DepartmentManager.input_longitud.value    = ""
        DepartmentManager.input_rooms.value       = ""
        DepartmentManager.input_bathrooms.value   = ""
        DepartmentManager.input_Value.value       = ""
        DepartmentManager.input_size.value        = ""
        DepartmentManager.input_status.value      = 0
        DepartmentManager.input_description.value = ""

        hideAllElements("#tab-departmentManager .popup .update-ui")
        showAllElements("#tab-departmentManager .popup .add-ui")

        departmentManager_popup.classList.remove("d-none");
    }

    static async addDpto(){
        const updateResponse = await this.addDptoRequest();

        if ("Departamento agregado" in updateResponse && updateResponse["Departamento agregado"]){
            printGlobalSuccessMessage("Departamento agregado correctamente")
            await DepartmentManager.updateDptoList()
            hideAllPopUps()
        }
        else if ("Error" in updateResponse) 
            printGlobalErrorMessage(updateResponse["Error"])
        else
            printGlobalErrorMessage("Error desconocido al agregar departamento")
    }

    static async addDptoRequest(){

        var formdata = new FormData();
        const SessionKey  = await window.api.getData("SessionKey")
        const address     = DepartmentManager.input_address.value
        const latitud     = DepartmentManager.input_latitud.value
        const longitud    = DepartmentManager.input_longitud.value
        const rooms       = DepartmentManager.input_rooms.value
        const bathrooms   = DepartmentManager.input_bathrooms.value
        const size        = DepartmentManager.input_size.value
        const Value       = DepartmentManager.input_Value.value
        const status      = DepartmentManager.input_status.value
        const description = DepartmentManager.input_description.value

        
        formdata.append("SessionKey",  SessionKey)
        formdata.append("Address",     address)
        formdata.append("Latitud",     latitud)
        formdata.append("Longitud",    longitud)
        formdata.append("Rooms",       rooms)
        formdata.append("Bathrooms",   bathrooms)
        formdata.append("Size",        size)
        formdata.append("Value",       Value)
        formdata.append("IdState",     status)
        formdata.append("Description", description)
        
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        await fetch(`${apiDomain}/admin/createdpto/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));
        
        var r
        return JSON.parse(r)
    }

}

class DepartmentUpdater{
    static showEditDptoMenu(dptoId){
        var dpto = DepartmentManager.findDpto(dptoId)
        if (dpto == undefined) return;

        DepartmentManager.input_id.value          = dpto.Id_Dpto
        DepartmentManager.input_address.value     = dpto.Address
        DepartmentManager.input_latitud.value     = dpto.Latitud
        DepartmentManager.input_longitud.value    = dpto.Longitud
        DepartmentManager.input_rooms.value       = dpto.Rooms
        DepartmentManager.input_bathrooms.value   = dpto.Bathrooms
        DepartmentManager.input_size.value        = dpto.Size
        DepartmentManager.input_Value.value       = dpto.Value
        DepartmentManager.input_status.value      = dpto.Id_State
        DepartmentManager.input_description.value = dpto.Description

        hideAllElements("#tab-departmentManager .popup .add-ui")
        showAllElements("#tab-departmentManager .popup .update-ui") 
        departmentManager_popup.classList.remove("d-none");
    }

    static async updateDpto(){
        const updateResponse = await this.updateDptoRequest();

        if ("DepartamentoEditado" in updateResponse && updateResponse["DepartamentoEditado"]){
            printGlobalSuccessMessage("Departamento editado correctamente")
            await DepartmentManager.updateDptoList()
            hideAllPopUps()
        }
        else if ("Error" in updateResponse) 
            printGlobalErrorMessage(updateResponse["Error"])
        else
            printGlobalErrorMessage("Error desconocido al editar departamento")
    }

    static async updateDptoRequest(){

        var formdata = new FormData();
        const SessionKey  = await window.api.getData("SessionKey")
        const id          = DepartmentManager.input_id.value
        const address     = DepartmentManager.input_address.value
        const latitud     = DepartmentManager.input_latitud.value
        const longitud    = DepartmentManager.input_longitud.value
        const rooms       = DepartmentManager.input_rooms.value
        const bathrooms   = DepartmentManager.input_bathrooms.value
        const size        = DepartmentManager.input_size.value
        const Value       = DepartmentManager.input_Value.value
        const status      = DepartmentManager.input_status.value
        const description = DepartmentManager.input_description.value

        
        formdata.append("SessionKey",  SessionKey)
        formdata.append("IdDpto",      id)
        formdata.append("Address",     address)
        formdata.append("Latitud",     latitud)
        formdata.append("Longitud",    longitud)
        formdata.append("Rooms",       rooms)
        formdata.append("Bathrooms",   bathrooms)
        formdata.append("Size",        size)
        formdata.append("Value",       Value)
        formdata.append("IdState",     status)
        formdata.append("Description", description)
        
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        await fetch(`${apiDomain}/admin/editdptos/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));
        
        var r
        return JSON.parse(r)
    }
}