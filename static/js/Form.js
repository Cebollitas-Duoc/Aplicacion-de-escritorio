function getValue(element){
    return element.value.trim()
}

document.addEventListener('DOMContentLoaded', async () =>{
    apiDomain = await window.api.apiDomain()
})
