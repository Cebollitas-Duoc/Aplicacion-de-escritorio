document.addEventListener('DOMContentLoaded', async () =>{
    usermanager_cardsContainer = document.querySelector("#tab-userManager .cardContainer");
    usermanager_editMenu       = document.querySelector("#tab-userManager .popup-container");
    button_updateList          = document.querySelector("#tab-userManager .btn-update");

    UserManager.updateUserList();

    document.getElementById("updateUser-button-UpdateUser").addEventListener('click', async () =>{
        UserManager.updateUser();
    })

    button_updateList.addEventListener('click', async () =>{
        UserManager.updateUserList();
    })
})

class UserManager{
    static users = {}

    static cardTemplate = `
    <div class="card userRow">
        <div class="card-body">
            <div class="container text-center align-middle">
                <div class="row">
                    <div class="col-1 usrIcon">
                        <img src="<<imagen>>" alt="" class=" rounded-circle me-2">
                    </div>
                    <div class="col-4">
                        <<nombre>>
                    </div>
                    <div class="col-3">
                        Permiso: <<permiso>>
                    </div>
                    <div class="col-2">
                        Estado: <<estado>>
                    </div>
                    <div class="col-1 editIcon" onclick="UserManager.showEditUserMenu(<<userId>>)">
                        <img src="../static/img/edit.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
    `

    static async updateUserList(){
        this.users = await this.getUsers()

        usermanager_cardsContainer.innerHTML = ""
        this.users.forEach(async (user) => {
            var card = await this.createUserCard(user)
            appendStringElement(usermanager_cardsContainer, card)
        });
    }

    static async getUsers(){
        var formdata = new FormData();
        var r
        formdata.append("SessionKey", await window.api.getData("SessionKey"));
        var apidomain = await window.api.apiDomain()

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/admin/viewusers/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    } 

    static async createUserCard(user){
        var card = this.cardTemplate
        var webdomain = await window.api.webDomain()
        user = this.getUserFormattedData(user)

        card = card.replace("<<imagen>>",  `${webdomain}/static/${user.Rutafotoperfil}`)
        card = card.replace("<<nombre>>",  user.FullName)
        card = card.replace("<<permiso>>", user.Permission)
        card = card.replace("<<estado>>",  user.Status)
        card = card.replace("<<userId>>",  user.Id_usuario)

        return card.toString()
    }

    static showEditUserMenu(userId){
        var user = this.findUser(userId)
        if (user == undefined) return;

        var userId    = document.getElementById("updateUser-UserId")
        var nombres   = document.getElementById("updateUser-Nombres")
        var apellidos = document.getElementById("updateUser-Apellidos")
        var email     = document.getElementById("updateUser-Email")
        var direccion = document.getElementById("updateUser-Direccion")
        var telefono  = document.getElementById("updateUser-Telefono")
        var permiso   = document.getElementById("updateUser-Permiso")
        var estado    = document.getElementById("updateUser-Estado")

        userId.value    = user.Id_usuario
        nombres.value   = user.Names
        apellidos.value = user.Lastnames
        email.value     = user.Email
        direccion.value = user.Direccion
        telefono.value  = user.Telefono
        permiso.value   = user.Id_permiso
        estado.value    = user.Id_estadousuario

        usermanager_editMenu.classList.remove("d-none");
    }

    static findUser(userId){
        const user = this.users.filter(function (u){
            return u.Id_usuario==userId;
        });

        return this.getUserFormattedData(user[0])
    }

    static async updateUser(){
        const updateResponse = await this.updateUserRequest();

        if ("PerfilEditado" in updateResponse && updateResponse["PerfilEditado"]){
            printGlobalSuccessMessage("Usuario Editado correctamente")
            await this.updateUserList()
            hideAllPopUps()
        }
        else if ("Error" in updateResponse) 
            printGlobalErrorMessage(updateResponse["Error"])
        else
            printGlobalErrorMessage("Error desconocido")
    }

    static async updateUserRequest(){

        var formdata = new FormData();
        const SessionKey = await window.api.getData("SessionKey")
        const userId     = document.getElementById("updateUser-UserId").value
        const nombres    = document.getElementById("updateUser-Nombres").value
        const apellidos  = document.getElementById("updateUser-Apellidos").value
        const email      = document.getElementById("updateUser-Email").value
        const direccion  = document.getElementById("updateUser-Direccion").value
        const telefono   = document.getElementById("updateUser-Telefono").value
        const permiso    = document.getElementById("updateUser-Permiso").value
        const estado     = document.getElementById("updateUser-Estado").value

        const nombre    = nombres.split(/[ ]+/)[0]
        const nombre2   = nombres.split(/[ ]+/)[1]
        const apellido  = apellidos.split(/[ ]+/)[0]
        const apellido2 = apellidos.split(/[ ]+/)[1]

        if (nombre2 == undefined) nombre2 = " ";
        if (apellido2 == undefined) apellido2 = " ";

        
        formdata.append("SessionKey",      SessionKey)
        formdata.append("IdUsuario",       userId)
        formdata.append("IdPermiso",       permiso)
        formdata.append("IdEstado",        estado)
        formdata.append("Email",           email)
        formdata.append("PrimerNombre",    nombre)
        formdata.append("SegundoNombre",   nombre2)
        formdata.append("PrimerApellido",  apellido)
        formdata.append("SegundoApellido", apellido2)
        formdata.append("Direccion",       direccion)
        formdata.append("Telefono",        telefono)
        
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        await fetch(`${apiDomain}/admin/edituser/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));
        
        var r
        return JSON.parse(r)
    }

    static getUserFormattedData(user){
        function getUserFullName(user){
            var username = "" 
            if (user.Primernombre != undefined) username = `${username} ${user.Primernombre}`
            if (user.Segundonombre != undefined) username = `${username} ${user.Segundonombre}`
            if (user.Primerapellido != undefined) username = `${username} ${user.Primerapellido}`
            if (user.Segundoapellido != undefined) username = `${username} ${user.Segundoapellido}`
            return username
        }
        function getStatus(user){
            switch (user.Id_estadousuario) {
                case 0:
                    return "Por validar"
                case 1:
                    return "Validado"
                case 2:
                    return "Bloqueado"
                default:
                    return user.Id_estadousuario
            }
        }
        function getPermission(user){
            switch (user.Id_permiso) {
                case 0:
                    return "Usuario"
                case 1:
                    return "Empleado"
                case 2:
                    return "Administrador"
                default:
                    return user.Id_permiso
            }
        }
        function removeNulls(user){
            user.Segundonombre = user.Segundonombre == null ? "" : user.Segundonombre;
            user.Segundoapellido = user.Segundonombre == null ? "" : user.Segundonombre;
        }
        
        removeNulls(user)
        user.FullName  = getUserFullName(user)
        user.Status    = getStatus(user)
        user.Permission = getPermission(user)
        user.Names     = `${user.Primernombre} ${user.Segundonombre}`
        user.Lastnames = `${user.Primerapellido} ${user.Segundoapellido}`

        return user
    }
}