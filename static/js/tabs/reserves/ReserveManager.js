document.addEventListener('DOMContentLoaded', async () =>{
    ReserveManager.initiate();
    reservePopUpManager.initiate();
})

class ReserveManager{
    static cardContainer;
    static popup;

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
                        <div class="col-1 editIcon" onclick="reservePopUpManager.show(<<id>>)">
                            <img src="../static/img/eye.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `

    static initiate(){
        this.cardContainer = document.querySelector("#tab-reserves .cardContainer");
        this.popup = document.querySelector("#tab-reserves .popup.reserve");
        this.setReserves();
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
        card = card.replace("<<address>>", rsv.ShortAddress)
        card = card.replace("<<user>>",    rsv.UserName)
        card = card.replace("<<date>>",    rsv.CreateDate)
        card = card.replace("<<estatus>>", rsv.Estado)
        card = card.replace("<<value>>",   formatterPeso.format(parseInt(rsv.Value)))

        return card.toString()
    }

    static async getReserveFormattedData(rsv){
        function formatAddress(rsv){
            if (rsv.Address.length > 25)
                return rsv.Address.substring(0,22) + "..."
            return rsv.Address;
        }
        rsv.ShortAddress = formatAddress(rsv)

        return rsv
    }

    static findReserve(id){
        const rsv = this.reserves.filter(function (r){
            return r.Id_Reserve==id;
        });

        return rsv[0]
    }
}

class reservePopUpManager{
    static address;
    static username;
    static estate;
    static value;
    static createDate;
    static startDate;
    static endDate;
    static reserveNumber;
    static reserveId;

    static reserveDataContainer;

    static initiate(){
        this.reserveDataContainer = ReserveManager.popup.querySelector(".reserveData");

        this.address       = this.reserveDataContainer.querySelector(".address");
        this.username      = this.reserveDataContainer.querySelector(".username");
        this.estate        = this.reserveDataContainer.querySelector(".estate");
        this.value         = this.reserveDataContainer.querySelector(".value");
        this.createDate    = this.reserveDataContainer.querySelector(".createDate");
        this.startDate     = this.reserveDataContainer.querySelector(".startDate");
        this.endDate       = this.reserveDataContainer.querySelector(".endDate");
        this.reserveNumber = ReserveManager.popup.querySelector(".reserveId");
    }

    static async show(id){
        var reserve = ReserveManager.findReserve(id)
        if (reserve == undefined) return;

        this.address.innerHTML        = reserve.Address
        this.username.innerHTML       = reserve.UserName
        this.estate.innerHTML         = reserve.Estado
        this.createDate.innerHTML     = reserve.CreateDate
        this.startDate.innerHTML      = reserve.StartDate
        this.endDate.innerHTML        = reserve.EndDate
        this.reserveNumber.innerHTML  = reserve.Id_Reserve
        this.reserveId                = reserve.Id_Reserve
        this.value.innerHTML          = formatterPeso.format(parseInt(reserve.Value))
        
        await Promise.all([ 
            ReserveHiredServicesManager.setExtraServices(),
            ReserveDocumentsManager.setDocuments()
        ])
        await hideAllPopUps()
        ReserveManager.popup.classList.remove("d-none");
    }
}