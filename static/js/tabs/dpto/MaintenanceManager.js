document.addEventListener('DOMContentLoaded', async () =>{
    MaintenanceManager.initiate()
})

class MaintenanceManager{
    static popup;
    static container;
    static maintenance;
    
    static cardTemplate = `
    <div id="maintenance-<<id>>" class="card" onclick="">
        <div class="card-body">
            <div class="container text-center align-middle">
                <div class="row">
                    <div class="col-4">
                        <<category>>
                    </div>
                    <div class="col-2">
                        <<startDate>>
                    </div>
                    <div class="col-4">
                        <<endDate>>
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
}