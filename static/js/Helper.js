document.addEventListener('DOMContentLoaded', async () =>{
    apidomain = await window.api.apiDomain()
    webdomain = await window.api.webDomain()

})

function hideAllElements(query){
    elements = document.querySelectorAll(query)
    elements.forEach(element => {
        element.classList.add("d-none");
    });
}

function showAllElements(query){
    elements = document.querySelectorAll(query)
    elements.forEach(element => {
        element.classList.remove("d-none");
    });
}