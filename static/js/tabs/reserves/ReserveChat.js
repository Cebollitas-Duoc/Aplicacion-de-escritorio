document.addEventListener('DOMContentLoaded', async () =>{
    ReserveChat.initiate()
})

class ReserveChat{
    static popup;
    static msgContainer;
    static msgInput;

    static initiate(){
        this.popup = document.querySelector("#tab-reserves .popup.chat");
        this.msgContainer = this.popup.querySelector(".messageContainer");
        this.msgInput = this.popup.querySelector(".msg");
    }

    static cardTemplate = `
        <div class="row">
            <div class="card msg col-md-8 col-sm-12 <<yours>>">
                <div class="card-body">
                    <p class="username"><<name>></p>
                    <p class="msg"><<msg>></p>
                    <<img>>
                </div>
            </div>
        </div>
    `

    static async showPopUp(){
        this.msgContainer.innerHTML = ""
        this.messages = await this.GetMessagesRequest(0);
        this.messages.forEach(msg => {
            this.addMsgCard(msg.UserName, msg.Message, msg.Yours);
        });

        this.getNewMessages(reservePopUpManager.reserveId);
        await hideAllPopUps()
        this.popup.classList.remove("d-none");
    }

    static async SendMessage(){
        const msg = this.msgInput.value;
        
        if (msg.length == 0){
            return;
        }

        const response = await this.SendMessagesRequest(msg);
        if ("Mensaje_Enviado" in response && response["Mensaje_Enviado"]){
            this.msgInput.value = ""
            this.addMsgCard(username, msg, 1)
        }   
        else if ("Error" in response) 
            printGlobalErrorMessage(response["Error"]);
        else
            printGlobalErrorMessage("Error desconocido al enviar mensaje");
    }

    static async GetMessagesRequest(from){
        var formdata = new FormData();
        var r;
        
        formdata.append("SessionKey", sessionKey);
        formdata.append("Id_Reserve", reservePopUpManager.reserveId);
        formdata.append("From",       from);
        
        
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/chat/listmessages/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));
        
        return JSON.parse(r);
    }

    static async SendMessagesRequest(msg){
        var formdata = new FormData();
        var r;
        formdata.append("SessionKey", sessionKey);
        formdata.append("Id_Reserve", reservePopUpManager.reserveId);
        formdata.append("Message",       msg);


        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch(`${apidomain}/chat/sendmessage/`, requestOptions)
        .then(response => response.text())
        .then(result => r=result)
        .catch(error => console.log('error', error));

        return JSON.parse(r);
    }

    static addMsgCard(user, msg, yours){
        const card = this.createMsgCard(user, msg, yours)
        this.msgContainer.innerHTML = this.msgContainer.innerHTML + card 
    }

    static createMsgCard(user, msg, yours){
        var card = this.cardTemplate;
        card = card.replace("<<name>>",  user)
        card = card.replace("<<msg>>",   msg)
        if (yours == 1)
            card = card.replace("<<yours>>", "send")
        else
            card = card.replace("<<yours>>", "recieved")

        const regex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;
        const urls = msg.match(regex);
    
        if (urls != null)
            card = card.replace("<<img>>", `<img src="${urls[0]}" alt="">`)
        else
            card = card.replace("<<img>>", "")

        return card.toString()
    }

    static getLastMsgDate(){
        if (this.messages.length == 0) return 0;
        const lastindex = this.messages.length - 1
        return this.messages[lastindex].Date
    }

    static async getNewMessages(id){
        while (1){
            await new Promise(r => setTimeout(r, 2000));
            if (id != reservePopUpManager.reserveId) break;
            const newMsg = await this.GetMessagesRequest(this.getLastMsgDate())
            newMsg.forEach(msg => {
                if (msg.Yours == 1) return;
                this.addMsgCard(msg.UserName, msg.Message, msg.Yours);
            });
            this.messages = this.messages.concat(newMsg);
        }
    }
}