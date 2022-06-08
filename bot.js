require('dotenv').config()
const fs = require('fs')
const TelegramBot = require('node-telegram-bot-api');
const {
    TG_BOT_KEY
} = process.env

// something like database json file
const landingsFile = './landings_list/landings_list.json';


// stop on ctrl+c
process.on('SIGINT', () => {
    process.exit()
});

const commands = {
    LIST_OF_LANDINGS: "Список лендингов",
    LIST_OF_COMMANDS: "Список команд",
    ADD_LANDING: "/add",
    REMOVE_LANDING: "/remove"
};

const KEYBOARD_MARKUP = [
    [commands.LIST_OF_LANDINGS],
    [commands.LIST_OF_COMMANDS]
];

// helper function
function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TG_BOT_KEY, { polling: true });

bot.onText(/\/start/, msg => {
    bot.sendMessage(msg.chat.id, "Welcome", {
        "reply_markup": {
            "keyboard": KEYBOARD_MARKUP
        }
    });

});


// returns list of landings
bot.onText(new RegExp(commands.LIST_OF_LANDINGS), msg => {
    const file = fs.readFileSync(landingsFile);
    const list = JSON.parse(file)

    let msgList = ``
    list.landings.forEach((l, i) => {
        msgList += `${i + 1}. ${l} \n`
    })

    if (msgList.length == 0) {
        msgList = `-- Список лендингов на проверку пуст -- \т`
    }

    bot.sendMessage(msg.chat.id, msgList, {
        disable_web_page_preview: true
    })
})


// returns list of commands 
bot.onText(new RegExp(commands.LIST_OF_COMMANDS), msg => {
    try {
        let commandsList = `
${commands.ADD_LANDING} - добавление в список
${commands.REMOVE_LANDING} - удаление из списка
        `

        bot.sendMessage(msg.chat.id, commandsList)
    } catch (e) {
        console.error(e)
    }
})


// add command
bot.onText(new RegExp(commands.ADD_LANDING), msg => {
    try {

        bot.sendMessage(msg.chat.id, 'Теперь введи ссылку на лендинг или /cancel для отмены', {
            reply_markup: {
                force_reply: true
            }
        })
            .then(sended => {
                const chatId = sended.chat.id;
                const messageId = sended.message_id;

                bot.onReplyToMessage(chatId, messageId, message => {
                    // validation of url 

                    if (message.text == '/cancel') {
                        bot.sendMessage(chatId, `Действие отменено`)
                        return;
                    }
                   

                    try {

                        if (!isValidHttpUrl(message.text)) {
                            bot.sendMessage(chatId, `Не валидная ссылка`)
                            return;
                        }

                        const readFile = fs.readFileSync(landingsFile),
                        jsonFile = JSON.parse(readFile),
                        landUrl = message.text

                        if (!jsonFile.landings.includes(landUrl)) {
                            jsonFile.landings.push(landUrl)
                            fs.writeFileSync(landingsFile, JSON.stringify(jsonFile))
                            bot.sendMessage(chatId, `Добавлено ${landUrl}`, {
                                reply_markup: {
                                    keyboard: KEYBOARD_MARKUP
                                }
                            })
    
                        } else {
                            bot.sendMessage(chatId, `Такой url уже есть в списке`, {
                                reply_markup: {
                                    keyboard: KEYBOARD_MARKUP
                                }
                            })
                        }
                    } catch(e) {
                        bot.sendMessage(chatId, `Ошибка: ${e.message}`, {
                            reply_markup: {
                                keyboard: KEYBOARD_MARKUP
                            }
                        })
                    }
                });

            })
    } catch (e) {
        console.error(e)
    }
})

// add command
bot.onText(new RegExp(commands.REMOVE_LANDING), msg => {
    try {

        bot.sendMessage(msg.chat.id, 'Теперь введи ссылку на лендинг или /cancel для отмены', {
            reply_markup: {
                force_reply: true
            }
        })
            .then(sended => {
                const chatId = sended.chat.id;
                const messageId = sended.message_id;

                bot.onReplyToMessage(chatId, messageId, message => {
                    // validation of url 

                    if (message.text == '/cancel') {
                        bot.sendMessage(chatId, `Действие отменено`)
                        return;
                    }

                    if (!isValidHttpUrl(message.text)) {
                        bot.sendMessage(chatId, `Не валидная ссылка`)
                        return;
                    }

                    const readFile = fs.readFileSync(landingsFile),
                        jsonFile = JSON.parse(readFile),
                        landUrl = message.text

                    if (jsonFile.landings.includes(landUrl)) {
                        const filteredLandArray = jsonFile.landings.filter(value => value != landUrl)
                        jsonFile.landings = filteredLandArray
                        
                        fs.writeFileSync(landingsFile, JSON.stringify(jsonFile))
                        bot.sendMessage(chatId, `Удалено ${landUrl}`, {
                            reply_markup: {
                                keyboard: KEYBOARD_MARKUP
                            }
                        })

                    } else {
                        bot.sendMessage(chatId, `Такого url нет в списке`, {
                            reply_markup: {
                                keyboard: KEYBOARD_MARKUP
                            }
                        })
                    }
                });

            })
    } catch (e) {
        console.error(e)
    }
})


// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });

