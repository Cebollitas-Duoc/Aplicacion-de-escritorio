
document.addEventListener('DOMContentLoaded', async () =>{
    globalMessageCard = document.getElementById("GlobalMessage");
    globalMessage = document.querySelector("#GlobalMessage span");

    globalMessageCard.addEventListener("click", async ()=>{
        globalMessageCard.classList.add("d-none");
    })
})

function printGlobalErrorMessage(message){
    globalMessageCard.classList.add("error");
    globalMessageCard.classList.remove("success");
    globalMessageCard.classList.remove("d-none");
    globalMessage.innerHTML = message
}

function printGlobalSuccessMessage(message){
    globalMessageCard.classList.add("success");
    globalMessageCard.classList.remove("error");
    globalMessageCard.classList.remove("d-none");
    globalMessage.innerHTML = message
}