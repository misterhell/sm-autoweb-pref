const fs = require('fs')
const { Landing } = require("./landings-loader");

const PARSING_RESULT_TIMES = 3;


class TestsFiles {

    /**
     * 
     * @param {array} filesToCreate 
     * @param {Landing[]} listOfLandings 
     */
    static create(filesToCreate, listOfLandings) {
        filesToCreate.forEach(file => {
            const testFile = {
                tests: []
            }
            
            listOfLandings.forEach(landing => {
                for (let i = 0; i < PARSING_RESULT_TIMES; i ++) {
                    testFile.tests.push(
                        {
                            "label": landing.title,
                            "url": landing.url,
                            "gatherer": "psi",
                            "psi": {
                              "settings": {
                                "strategy": file.indexOf('desktop') !== -1 ? "desktop" : "mobile",
                                "category": "performance"
                              }
                            }
                          }
                    )
                }
            });
        
            fs.writeFileSync(file, JSON.stringify(testFile))
        })
    }

}

module.exports = {TestsFiles}