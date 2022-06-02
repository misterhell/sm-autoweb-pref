
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
        return [
            new Landing('stackowerflow', 'https://stackoverflow.com'),
            new Landing('dozp', 'https://dozp.online'),
            new Landing('googleua', 'https://www.google.com'),
            new Landing('you', 'https://youtube.com'),
            new Landing('scloud', 'https://soundcloud.com'),
            new Landing('github', 'https://github.com'),
        ]
    }
}


module.exports = { LandingLoader, Landing }