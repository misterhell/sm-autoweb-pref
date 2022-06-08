class Statistics {
    label = null
    url = null
    mobileP = null
    desktopP = null
    error = null

    constructor(label, url, desktopP, mobileP, error) {
        this.label = label
        this.url = url
        this.mobileP = mobileP
        this.desktopP = desktopP
        this.error = error
    }

    toString() {
        let icon = '✅'

        if (this.mobileP < 0.85 || this.desktopP < 0.85) {
            icon = '❌'
        }

        return `${icon} ${this.url}: m${this.mobileP}/d${this.desktopP}`
    }
}

class StatisticsCompounder {
    statList = null
    desktop = null

    /**
     * 
     * @param {array[Results[]]} statList 
     */
    constructor(mobile, desktop) {
        this.mobile = mobile
        this.desktop = desktop
    }


    getStatisticsByEachLabel() {
        const stat = []
        this.desktop.forEach(dRes => {
            const mobile = this.mobile.find(mRes => dRes.label == mRes.label)
            const mobilePerf = !mobile ? '?' : mobile.performance
            const {label, url, performance, errors} = dRes
            const allErrors = [].concat(errors, mobile.errors)

            stat.push(new Statistics(label, url, performance, mobilePerf, allErrors.pop()))
        });

        return stat
    }
}

module.exports = {StatisticsCompounder, Statistics};