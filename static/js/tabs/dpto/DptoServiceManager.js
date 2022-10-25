document.addEventListener('DOMContentLoaded', async () =>{
    DptoServiceManager.initiate();
})

class DptoServiceManager{
    static popup;
    static dd_category;
    static services = {}
    
    
    static initiate(){
        this.popup = document.querySelector("#tab-departmentManager .popup.service");
        this.dd_category = document.querySelector("#tab-departmentManager .popup.service .serviceCategory");

        DptoCategoryServiceManager.setCategorys()
    }

    static async showPopup(){
        this.setServices();
        await hideAllPopUps();
        this.popup.classList.remove("d-none");
    }

    static async setServices(){
        this.services = await this.getDptoService(DepartmentManager.input_id.value)
    }

    static async getDptoService(Id_Dpto){
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/departamentos/listservices/${Id_Dpto}/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}

class DptoCategoryServiceManager{
    static categorys = {}
    static async setCategorys(){
        this.categorys = await this.getCategorys()
        DptoServiceManager.dd_category.innerHTML = ""
        this.categorys.forEach(async (category) => {
            var option = `<option value="${category.Id_Categoria}">${category.Descripcion}</option>`
            appendStringElement(DptoServiceManager.dd_category, option)
        });
    }

    static async getCategorys(){
        var formdata = new FormData();
        var r
        var apidomain = await window.api.apiDomain()

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/departamentos/listservicecategories/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }
}