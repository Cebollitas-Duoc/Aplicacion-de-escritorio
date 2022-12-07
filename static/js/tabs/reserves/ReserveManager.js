document.addEventListener('DOMContentLoaded', async () =>{
    ReserveManager.initiate();
})

class ReserveManager{
    static cardContainer;

    static reserves;

    static cardTemplate = `
        <div class="card userRow">
            <div class="card-body">
                <div class="container text-center align-middle">
                    <div class="row">
                        <div class="col-3">
                            <<address>>
                        </div>
                        <div class="col-2">
                            <<user>>
                        </div>
                        <div class="col-2">
                            <<date>>
                        </div>
                        <div class="col-2">
                            <<value>>
                        </div>
                        <div class="col-2">
                            <<estatus>>
                        </div>
                        <div class="col-1 editIcon" onclick="ReserveManager.showPopup(<<id>>)">
                            <img src="../static/img/eye.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `

    static initiate(){
        this.cardContainer = document.querySelector("#tab-reserves .cardContainer");
        this.setReserves();
    }

    static showPopup(){

    }

    static async setReserves(){
        this.cardContainer.innerHTML = ""
        this.reserves = await this.getReserves()
        this.reserves.forEach(async (rsv) => {
            var card = await this.createRsvCard(rsv)
            appendStringElement(this.cardContainer, card)
        });
    }

    static async getReserves(){
        const SessionKey  = await window.api.getData("SessionKey")
        var formdata = new FormData();
        var apidomain = await window.api.apiDomain()
        
        formdata.append("SessionKey",   SessionKey)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        var r
        await fetch(`${apidomain}/reservas/listreserves/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static async createRsvCard(rsv){
        var card = this.cardTemplate;
        rsv = await this.getReserveFormattedData(rsv)
        card = card.replaceAll("<<id>>",   rsv.Id_Reserve)
        card = card.replace("<<address>>", rsv.Address)
        card = card.replace("<<user>>",    rsv.UserName)
        card = card.replace("<<date>>",    rsv.CreateDate)
        card = card.replace("<<value>>",   rsv.Value)
        card = card.replace("<<estatus>>", rsv.Estado)

        return card.toString()
    }

    static async getReserveFormattedData(rsv){
        function formatAddress(rsv){
            if (rsv.Address.length > 25)
                return rsv.Address.substring(0,22) + "..."
            return rsv.Address;
        }
        rsv.Address = formatAddress(rsv)

        return rsv
    }
}