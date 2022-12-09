document.addEventListener('DOMContentLoaded', async () =>{
    moneyInputs = document.querySelectorAll("input.money")
    moneyInputs.forEach(element => {
        element.addEventListener('input', async () =>{
            element.value = currencyFormat(element.value)
        })
    });
})

function currencyFormat(value){
    valueRaw = value.replaceAll(".","").replace("$","");
    valueRaw = parseInt(valueRaw)
    if (isNaN(valueRaw)) valueRaw = 0;
    return formatterPeso.format(parseInt(valueRaw))
}