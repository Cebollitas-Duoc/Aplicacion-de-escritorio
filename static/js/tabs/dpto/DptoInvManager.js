document.addEventListener('DOMContentLoaded', async () =>{
    DptoInvManager.initiate();
})

class DptoInvManager{
    static popup;
    static inventory;
    static invContainer;
    static name;
    static ammount;

    
    static cardTemplate = `
        <div id="invObj-<<id>>" class="card" onclick="InventorySelector.selectObj(<<id>>)">
            <div class="card-body">
                <div class="container text-center align-middle">
                    <div class="row">
                        <div class="col-10">
                            <<name>>
                        </div>
                        <div class="col-2">
                            <<ammount>>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    static initiate(){
        this.popup = document.querySelector("#tab-departmentManager .popup.inventory");
        this.invContainer = this.popup.querySelector(".item-container");
        this.name    = this.popup.querySelector(".inputs .name");
        this.ammount = this.popup.querySelector(".inputs .ammount");
    }

    static async showPopup(){
        await hideAllPopUps();
        this.popup.classList.remove("d-none");

        this.setInventory();
    }

    static async setInventory(){
        this.invContainer.innerHTML = ""
        this.inventory = await this.getDptoInventory(DepartmentManager.input_id.value)
        this.inventory.forEach(async (obj) => {
            var card = await this.createObjCard(obj)
            appendStringElement(this.invContainer, card)
        });
    }

    static async createObjCard(obj){
        var card = this.cardTemplate;
        card = card.replaceAll("<<id>>",   obj.Id_Item)
        card = card.replace("<<name>>",    obj.Name)
        card = card.replace("<<ammount>>", obj.Ammount)

        return card.toString()
    }

    static async getDptoInventory(Id_Dpto){
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

        await fetch(`${apidomain}/admin/listitems/${Id_Dpto}/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static resetInputs(){
        this.name.value = ""
        this.ammount.value = 1
    }
}

class EditInventoryObject{
    static async editItem(){
        const name    = DptoInvManager.name.value;
        const ammount = DptoInvManager.ammount.value;

        const response = await this.editItemRequest(InventorySelector.selectedObjId, name, ammount)
        if ("ObjetoEditado" in response && response["ObjetoEditado"]){
            printGlobalSuccessMessage("Objeto editado")
            DptoInvManager.setInventory()
        }
        else if ("Error" in response) 
            printGlobalErrorMessage(response["Error"])
        else
            printGlobalErrorMessage("Error desconocido al editar objeto")
    }

    static async editItemRequest(id, name, ammount){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        formdata.append("SessionKey",   SessionKey)
        formdata.append("IdItem",  id)
        formdata.append("Name",    name)
        formdata.append("Ammount", ammount)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/admin/edititem/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}

class AddInventoryObject{
    static async addObject(){
        const idDpto  = DepartmentManager.input_id.value
        const name    = DptoInvManager.name.value
        const ammount = DptoInvManager.ammount.value
        
        const response = await this.addObjectQuery(idDpto, name, ammount)
        if ("ObjetoAgregado" in response && response["ObjetoAgregado"]){
            printGlobalSuccessMessage("Objeto agregado");
            DptoInvManager.resetInputs();
            DptoInvManager.setInventory();
        }
        else if ("Error" in response) 
            printGlobalErrorMessage(response["Error"])
        else
            printGlobalErrorMessage("Error desconocido al agregar objeto")
    }

    static async addObjectQuery(idDpto, name, ammount){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        formdata.append("SessionKey", SessionKey)
        formdata.append("IdDpto",     idDpto)
        formdata.append("Name",       name)
        formdata.append("Ammount",    ammount)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/admin/additem/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}
class InventorySelector{
    static selectedObj;
    static selectedObjId;

    static selectObj(id){
        if (this.selectedObj != undefined)
        this.selectedObj.classList.remove("selected");

        this.selectedObjId = id
        this.selectedObj = document.querySelector(`#invObj-${id}`);

        this.selectedObj.classList.add("selected");

        this.setObjData(id)
    }

    static setObjData(id){
        const obj = DptoInvManager.inventory.find(
            obj => obj.Id_Item == id);
        if (obj == undefined) return;
        DptoInvManager.name.value    = obj.Name;
        DptoInvManager.ammount.value = obj.Ammount;
    }
}