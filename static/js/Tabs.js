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

    popupContainers = await document.querySelectorAll(".popup");
    popupContainers.forEach(element => {
        element.addEventListener("click", async (e) => {
            if (e.target == element)
                
                hideAllPopUps();
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

async function hideAllPopUps(element){
    popupContainers = await document.querySelectorAll(".popup");
    popupContainers.forEach (popup => {
        popup.classList.add("d-none");
    });
}

document.addEventListener("keydown", async (e) => {
    if (e.key == "F5"){
        console.log("Updating")
        UserManager.updateUserList();
        ServiceCategoryManager.listCategorys();
        ServiceCategoryManager.listExtraCategorys();
        ReserveManager.setReserves();
        DepartmentManager.updateDptoList();
        ExtraServiceWorker.listWorkers();
        DptoCategoryExtraServiceManager.setCategorys();
        DptoCategoryServiceManager.setCategorys();
    }
}, false);