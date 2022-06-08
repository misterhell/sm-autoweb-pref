const fs = require('fs')

class Landing {
    title = null
    url = null

    constructor(title, url) {
        this.title = title
        this.url = url
    }
}

class LandingLoader {

    /**
     * 
     * @returns {Array.<{title: String, url: String}>}
     */
    static getLandings() {
        const file = fs.readFileSync('./landings_list/landings_list.json')
        const { landings } = JSON.parse(file)

        return landings.map(url => new Landing(url, url))
    }
}


module.exports = { LandingLoader, Landing }