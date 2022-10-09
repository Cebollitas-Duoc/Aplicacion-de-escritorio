const cardTemplate = `
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
                <div class="col-1 editIcon" onclick="showEditUserMenu(<<userId>>)">
                    <img src="../static/img/edit.png" alt="">
                </div>
            </div>
        </div>
    </div>
</div>
`

document.addEventListener('DOMContentLoaded', async () =>{
    cadsContainer = document.querySelector("#tab-userManager .cardContainer")
    editMenu      = document.querySelector("#tab-userManager .popup-container")

    users = await refreshUserCards()

    users.forEach(async (user) => {
        var card = await createUserCard(user)
        appendStringElement(cadsContainer, card)
    });
})

async function refreshUserCards(){
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

async function createUserCard(user){
    var card = cardTemplate
    var webdomain = await window.api.webDomain()
    
    card = card.replace("<<imagen>>",  `${webdomain}/static/${user.Rutafotoperfil}`)
    card = card.replace("<<nombre>>",  getUserName(user))
    card = card.replace("<<permiso>>", getPermission(user))
    card = card.replace("<<estado>>",  getStatus(user))
    card = card.replace("<<userId>>",  user.Id_usuario)

    return card.toString()
}

function showEditUserMenu(userId){
    user = findUser(userId)
    if (user == undefined) return;

    console.log(user)

    var nombres   = document.getElementById("updateUser-Nombres")
    var apellidos = document.getElementById("updateUser-Apellidos")
    var email     = document.getElementById("updateUser-Email")
    var direccion = document.getElementById("updateUser-Direccion")
    var telefono  = document.getElementById("updateUser-Telefono")
    var permiso   = document.getElementById("updateUser-Permiso")
    var estado    = document.getElementById("updateUser-Estado")

    //TODO: agregar id del usuario en campo escondido para luego poder ser tomado al usar la api
    nombres.value   = `${user.Primernombre} ${user.Segundonombre}`
    apellidos.value = `${user.Primerapellido} ${user.Segundoapellido}`
    email.value     = user.Email
    direccion.value = user.Direccion
    telefono.value  = user.Telefono
    permiso.value   = user.Id_permiso
    estado.value    = user.Id_estadousuario

    editMenu.classList.remove("d-none");
}

function getUserName(user){
    username = "" 
    if (user.Primernombre != undefined) username = `${username} ${user.Primernombre}`
    if (user.Segundonombre != undefined) username = `${username} ${user.Segundonombre}`
    if (user.Primerapellido != undefined) username = `${username} ${user.Primerapellido}`
    if (user.Segundoapellido != undefined) username = `${username} ${user.Segundoapellido}`
    return username
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

function findUser(userId){
    user = users.filter(function (u){
        return u.Id_usuario==userId;
    });

    return user[0]
}