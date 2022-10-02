const button_login     = document.getElementById("LoginButton");
const input_email      = document.getElementById("inputEmail");
const input_password   = document.getElementById("inputPassword");
const check_rememberMe = document.getElementById("checkRememberMe");

button_login.addEventListener("click", async ()=>{
    if (!validateInputs()) return
    email    = getValue(input_email)
    password = getValue(input_password)
    response = JSON.parse(await login(email, password))

    if ("SessionKey" in response){
        console.log("Valid user")
        saveSessionData(response)
        alert("Logeado correctamente")
        window.api.redirect("UserSpace.html")
    }
    else{
        console.log("Invalid credentials")
        window.api.setData("LogedIn", false)
        window.api.setData("SessionKey", "")
        if ("Error" in response)
            printErrorMessage(response["Error"])
        else
            printErrorMessage("Credenciales invalidas")
    }
})

async function login(email, password){
    var formdata = new FormData();
    var r
    formdata.append("Email", email);
    formdata.append("Password", password);
    console.log(email)
    console.log(password)
    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    await fetch(`${apiDomain}/auth/AdminLogin/`, requestOptions)
    .then(response => response.text())
    .then(result => r=result)
    .catch(error => console.log('error', error));

    return r
}

function validateInputs(){
    email    = getValue(input_email)
    password = getValue(input_password)

    if (email == ""){
        printErrorMessage("Falta ingresar email"); return false;   
    }
    if (password == ""){
        printErrorMessage("Falta ingresar contraseña"); return false;
    }

    return true
}

function saveSessionData(sessionData){
    window.api.setData("Remember", check_rememberMe.checked)
    window.api.setData("SessionKey", sessionData["SessionKey"])
    window.api.setData("UsrName", sessionData["Nombre"])
    window.api.setData("UsrImg", sessionData["Foto"])
    window.api.setData("LogedIn", true)
}
