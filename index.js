require('dotenv').config()
const fs = require('fs');
const { exec } = require('child_process');
const { ResultParser } = require('./src/result-parser')
const { LandingLoader } = require('./src/landings-loader')
const { StatisticsCompounder } = require('./src/statistics-compounder')
const { TgNotifier } = require('./src/tg-notifier')
const { TestsFiles } = require('./src/tests-files')

const {
    PSI_APIKEY,
    TG_BOT_KEY,
    TG_CHAT_ID
} = process.env 

const 
    TMP_DIR = './tmp',
    FILE_TEST_MOBILE = `${TMP_DIR}/tests-mobile.json`,
    FILE_TEST_DESKTOP = `${TMP_DIR}/tests-desktop.json`,
    FILE_OUTPU_MOBILE = `${TMP_DIR}/result-mobile.json`,
    FILE_OUTPU_DESKTOP = `${TMP_DIR}/result-desktop.json`

const tgNotifier = new TgNotifier(TG_BOT_KEY)


// script start 
const start = Date.now()

// removing tmp files from previous check
const filesToClean = [FILE_TEST_MOBILE, FILE_TEST_DESKTOP, FILE_OUTPU_MOBILE, FILE_OUTPU_DESKTOP]

filesToClean.forEach(element => {
    if (fs.existsSync(element)) {
        fs.rmSync(element)        
    }
});



// preparing tests files
const filesToCreate = [FILE_TEST_MOBILE, FILE_TEST_DESKTOP];
// geting landings list and creating tests files
TestsFiles.create(filesToCreate,  LandingLoader.getLandings());



// command to make both tests
const cmds = `
    PSI_APIKEY=${PSI_APIKEY} AutoWebPerf/awp run ${FILE_TEST_MOBILE} ${FILE_OUTPU_MOBILE} && PSI_APIKEY=${PSI_APIKEY} AutoWebPerf/awp run ${FILE_TEST_DESKTOP} ${FILE_OUTPU_DESKTOP}
`


exec(cmds, (error, stdout, stderr) => {
    if (error) {
        tgNotifier.sendMessage(`error: ${error.message}`, TG_CHAT_ID);
        return;
    }
    if (stderr) {
        return;
    }

    // no error
    console.log(stdout)


    const [ mobile, desktop ] = [
        ResultParser.parse(FILE_OUTPU_MOBILE),
        ResultParser.parse(FILE_OUTPU_DESKTOP),
    ];
    

    const StatCompounder = new StatisticsCompounder(mobile, desktop)
    const stat = StatCompounder.getStatisticsByEachLabel()

    // sort by mobile then by desctope perfomance
    stat.sort((a, b) => a.mobileP >= b.mobileP ? 1 : -1)
    stat.sort((a, b) => a.desktopP >= b.desktopP ? 1 : -1)

    // creating full message
    let msg = `Perfomance ${(new Date).toISOString().slice(0,10)}: \n`;
    stat.forEach(s => {
        msg += `\n${s}`
    })

    msg += `\n ⏱time_taken_to_execute = ${Math.round((Date.now() - start)/1000)} seconds`

    tgNotifier.sendMessage(msg, TG_CHAT_ID)

    return;

    // removing tmp files
    const filesToClean = [FILE_TEST_MOBILE, FILE_TEST_DESKTOP, FILE_OUTPU_MOBILE, FILE_OUTPU_DESKTOP]

    filesToClean.forEach(element => {
        fs.rmSync(element)
    });

    process.exit()
})






