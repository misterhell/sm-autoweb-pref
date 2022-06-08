const axios = require('axios');


class TgNotifier {
    key = null

    constructor(botKey) {
        this.key = botKey
    }

    async send(msg, chatID) {
        const url = encodeURI(`https://api.telegram.org/bot${this.key}/sendMessage?chat_id=${chatID}&disable_web_page_preview=true&text=${msg}`);

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