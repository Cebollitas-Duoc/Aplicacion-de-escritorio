document.addEventListener('DOMContentLoaded', async () =>{
    tabs = await document.querySelectorAll("#sideBar a.nav-link");
    tabs.forEach(element => {
        element.addEventListener("click", async () => {
            currentTab = await document.querySelector("#sideBar a.active");
            currentTab.classList.remove("active");
            element.classList.add("active");
            showTab(element.getAttribute("tab"))
        });
    });

    popupContainers = await document.querySelectorAll(".popup-container");
    popupContainers.forEach(element => {
        element.addEventListener("click", async (e) => {
            if (e.target == element)
                element.classList.add("d-none");
        });
    });
})

async function showTab(tabid){
    currentTab = await document.querySelector(".tab:not(.d-none)");
    currentTab.classList.add("d-none");
    tab = await document.getElementById(tabid);
    tab.classList.remove("d-none");
    console.log(tabid)
}

function appendStringElement(parent, element){
    parent.innerHTML = parent.innerHTML + element
}

function clickOutsidePopup(element){
    console.log(element.target)
}