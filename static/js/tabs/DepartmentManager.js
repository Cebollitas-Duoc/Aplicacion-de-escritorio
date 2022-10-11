document.addEventListener('DOMContentLoaded', async () =>{
    departmentManager_cardsContainer    = document.querySelector("#tab-departmentManager .cardContainer");
    departmentManager_editMenu          = document.querySelector("#tab-departmentManager .popup-container");
    departmentManager_button_updateList = document.querySelector("#tab-departmentManager .btn-update");
    departmentManager_button_addDpto    = document.querySelector("#tab-userManager .btn-add");

    DepartmentManager.updateDptoList()
    departmentManager_button_updateList.addEventListener('click', async () =>{
        DepartmentManager.updateDptoList()
    })
})

class DepartmentManager{
    static dptos = {}

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
                    <div class="col-1 editIcon" onclick="UserManager.showEditUserMenu(<<id>>)">
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

        await fetch(`${apidomain}/admin/viewdptos/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
    
    static async createDptoCard(dpto){
        var card = this.cardTemplate
        dpto = this.getDptoFormattedData(dpto)
        card = card.replace("<<imagen>>",   "https://www.hogares.cl/wp-content/uploads/2018/05/losleones-render.jpg")
        card = card.replace("<<address>>",  dpto.Address)
        card = card.replace("<<estado>>",   dpto.Status)
        card = card.replace("<<valor>>",    dpto.Value)
        card = card.replace("<<id>>",       dpto.Id_Dpto)

        return card.toString()
    }

    static getDptoFormattedData(dpto){
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
        dpto.Status  = getStatus(dpto)

        return dpto
    }
}