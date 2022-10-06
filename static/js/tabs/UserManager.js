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
                <div class="col-1 editIcon">
                    <img src="../static/img/edit.png" alt="">
                </div>
            </div>
        </div>
    </div>
</div>
`

document.addEventListener('DOMContentLoaded', async () =>{
    cadsContainer = document.getElementById("tab-userManager")

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

    return card.toString()
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