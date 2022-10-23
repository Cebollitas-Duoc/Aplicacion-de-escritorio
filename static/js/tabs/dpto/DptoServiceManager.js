document.addEventListener('DOMContentLoaded', async () =>{
    DptoServiceManager.initiate();
})

class DptoServiceManager{
    static popup;
    
    static initiate(){
        this.popup = document.querySelector("#tab-departmentManager .popup.service");
    }

    static async showPopup(){
        await hideAllPopUps();
        this.popup.classList.remove("d-none");
    }
}