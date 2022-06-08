const axios = require('axios');


class TgNotifier {
    key = null
    chatID = null

    constructor(botKey, chatID) {
        this.key = botKey
        this.chatID = chatID
    }

    async send(msg) {
        const url = encodeURI(`https://api.telegram.org/bot${this.key}/sendMessage?chat_id=${this.chatID}&disable_web_page_preview=true&text=${msg}`);

        try {
            const resp = await axios.get(url)
            return resp;
        } catch(e) {
            throw new Error(e)
        }
    }


    sendMessage(msg, chatID) {
        return this.send(msg, chatID)
    }

}


module.exports = { TgNotifier };