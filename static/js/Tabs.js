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
})

async function showTab(tabid){
    currentTab = await document.querySelector(".tab:not(.d-none)");
    currentTab.classList.add("d-none");
    tab = await document.getElementById(tabid);
    tab.classList.remove("d-none");
    console.log(tabid)
}