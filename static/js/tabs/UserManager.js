document.addEventListener('DOMContentLoaded', async () =>{
    usermanager_cardsContainer      = document.querySelector("#tab-userManager .cardContainer");
    usermanager_editMenu            = document.querySelector("#tab-userManager .popup");
    usermanager_button_updateList   = document.querySelector("#tab-userManager nav .btn-update");
    


    UserManager.setPopUpInputs();
    UserManager.updateUserList();

    document.querySelector("#tab-userManager .popup form .btn").addEventListener('click', async () =>{
        UserManager.updateUser();
    })

    usermanager_button_updateList.addEventListener('click', async () =>{
        UserManager.updateUserList();
    })
})

class UserManager{
    static users = {}
    static input_userId
    static input_nombres
    static input_apellidos
    static input_rut
    static input_email
    static input_direccion
    static input_telefono
    static input_permiso
    static input_estado
    static input_imagen
    static imagen

    static cardTemplate = `
    <div class="card userRow">
        <div class="card-body">
            <div class="container text-center align-middle">
                <div class="row">
                    <div class="col-1 mainIcon">
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
                    <div class="col-1 editIcon" onclick="UserManager.showEditUserMenu(<<id>>)">
                        <img src="../static/img/edit.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
    `

    static setPopUpInputs(){
        this.input_userId     = document.querySelector("#tab-userManager .popup .UserId")
        this.input_nombres    = document.querySelector("#tab-userManager .popup .Nombres")
        this.input_apellidos  = document.querySelector("#tab-userManager .popup .Apellidos")
        this.input_rut        = document.querySelector("#tab-userManager .popup .Rut")
        this.input_email      = document.querySelector("#tab-userManager .popup .Email")
        this.input_direccion  = document.querySelector("#tab-userManager .popup .Direccion")
        this.input_telefono   = document.querySelector("#tab-userManager .popup .Telefono")
        this.input_permiso    = document.querySelector("#tab-userManager .popup .Permiso")
        this.input_estado     = document.querySelector("#tab-userManager .popup .Estado")
        this.input_imagen     = document.querySelector("#tab-userManager .popup .ImagenInput")
        this.imagen           = document.querySelector("#tab-userManager .popup .Imagen")

        this.input_imagen.addEventListener('change', async () =>{
            const file = this.input_imagen.files[0]
            if (file) {
                this.imagen.src = URL.createObjectURL(file)
            }
        })

        this.imagen.addEventListener('click', async () =>{
            this.input_imagen.click()
        })
    }

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
        user = this.getUserFormattedData(user)

        card = card.replace("<<imagen>>",  user.ImgUrl)
        card = card.replace("<<nombre>>",  user.FullName)
        card = card.replace("<<permiso>>", user.Permission)
        card = card.replace("<<estado>>",  user.Status)
        card = card.replace("<<id>>",  user.Id_usuario)

        return card.toString()
    }

    static showEditUserMenu(userId){
        var user = this.findUser(userId)
        if (user == undefined) return;

        this.input_userId.value    = user.Id_usuario;
        this.input_nombres.value   = user.Names;
        this.input_apellidos.value = user.Lastnames;
        this.input_rut.value       = user.Rut;
        this.input_email.value     = user.Email;
        this.input_direccion.value = user.Direccion;
        this.input_telefono.value  = user.Telefono;
        this.input_permiso.value   = user.Id_permiso;
        this.input_estado.value    = user.Id_estadousuario;
        this.input_imagen.value    = ""
        this.imagen.src            = user.ImgUrl;

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
        const userId     = this.input_userId.value    
        const nombres    = this.input_nombres.value   
        const apellidos  = this.input_apellidos.value 
        const rut        = this.input_rut.value 
        const email      = this.input_email.value     
        const direccion  = this.input_direccion.value 
        const telefono   = this.input_telefono.value  
        const permiso    = this.input_permiso.value   
        const estado     = this.input_estado.value    
        const imagen     = this.input_imagen.files[0]

        var nombre    = nombres.split(/[ ]+/)[0]
        var nombre2   = nombres.split(/[ ]+/)[1]
        var apellido  = apellidos.split(/[ ]+/)[0]
        var apellido2 = apellidos.split(/[ ]+/)[1]

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
        formdata.append("Rut",             rut)
        formdata.append("Direccion",       direccion)
        formdata.append("Telefono",        telefono)
        formdata.append("Imagen",          imagen)
        
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
            user.Segundoapellido = user.Segundoapellido == null ? "" : user.Segundoapellido;
        }
        function getImgUrl(usr){
            if (user.Rutafotoperfil){
                return `${apidomain}/files/getimage/${user.Rutafotoperfil}`
            }
            else{
                return "../static/img/defaultProfileImg.png"
            }
        }
        
        removeNulls(user)
        user.FullName   = getUserFullName(user)
        user.Status     = getStatus(user)
        user.Permission = getPermission(user)
        user.ImgUrl     = getImgUrl(user)
        user.Names      = `${user.Primernombre} ${user.Segundonombre}`
        user.Lastnames  = `${user.Primerapellido} ${user.Segundoapellido}`

        return user
    }
}