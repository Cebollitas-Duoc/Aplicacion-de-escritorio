document.addEventListener('DOMContentLoaded', async () =>{
    apidomain = await window.api.apiDomain()
    webdomain = await window.api.webDomain()
    username = await window.api.getUsername()
    sessionKey  = await window.api.getData("SessionKey");

    closeButtons = document.querySelectorAll(".closeButton")
    closeButtons.forEach(btn => {
        btn.addEventListener('click', async () =>{
            hideAllElements(".popup")
        })
    });
})

function hideAllElements(query, parent=document){
    elements = parent.querySelectorAll(query)
    elements.forEach(element => {
        element.classList.add("d-none");
    });
}

function showAllElements(query, parent=document){
    elements = parent.querySelectorAll(query)
    elements.forEach(element => {
        element.classList.remove("d-none");
    });
}

function getValue(element){
    return element.value.trim()
}

document.addEventListener('DOMContentLoaded', async () =>{
    apiDomain = await window.api.apiDomain()
})

function currencyParseInt(value){
    return parseInt(value.replaceAll(".","").replace("$","").replace(" ",""))
}

const formatterPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0})

