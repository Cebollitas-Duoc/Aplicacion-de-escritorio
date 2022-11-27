document.addEventListener('DOMContentLoaded', async () =>{
    rutInputs = document.querySelectorAll("input.rut")
    rutInputs.forEach(element => {
        element.addEventListener('input', async () =>{
            element.value = formatToRut(element.value)
        })
    });
})

function formatToRut(rut){
    const format = "XX.XXX.XXX-X"
    rut = rut.replaceAll(".", "");
    rut = rut.replace("-", "");

    var formatedRut = "";

    format.split("").reverse().forEach(e => {
        if (rut.length != 0){   
            if (e == "X"){
                formatedRut = rut[rut.length-1] + formatedRut
                rut = rut.substring(0, rut.length-1)
            }
            else{
                formatedRut = e +formatedRut
            } 
        }
    });
    
    return formatedRut
}
