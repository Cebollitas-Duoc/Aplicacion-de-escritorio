document.addEventListener('DOMContentLoaded', async () =>{
    apidomain = await window.api.apiDomain()
    webdomain = await window.api.webDomain()

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