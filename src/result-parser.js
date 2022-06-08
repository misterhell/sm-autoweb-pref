const fs = require('fs');


class Result {
    label = null
    url = null
    performance = 0
    errors = []

    constructor(label, url, performance = 0, errors = []) {
        this.label = label
        this.url = url
        this.performance = performance
        this.errors = errors
    }


    addError(err) {
        this.errors.push(err)
    }
}


class ResultParser {

    /**
     * 
     * @param {string} file 
     * @returns {Result[]}
     */
    static parse(file) {

        const result = JSON.parse(fs.readFileSync(file))
        // parsing and returning result
        const accumulator = {}

        // collect by label
        if (result.results) {
            result.results.forEach(el => {
                if (!accumulator[el.label]) {
                    accumulator[el.label] = {
                        errors: [],
                        performance: [],
                        url: el.url
                    }
                }

                if (el.errors.length > 0) {
                    // adding first error
                    accumulator[el.label].errors.push(el.errors.pop())
                    return;
                }

                accumulator[el.label].performance.push(el.psi.metrics.lighthouse.Performance)
            });
        }

        // return array of results
        const resultsArray = [];
        for (let i in accumulator) {
            const r = accumulator[i],
                sum = r.performance.reduce((acc,v) => acc+v, 0),
                avgPerf = sum / r.performance.length
                
            resultsArray.push(new Result(i, r.url, parseFloat(avgPerf.toFixed(2)), r.errors));
        }

        return resultsArray;
    }
}

module.exports = {  ResultParser, Result }

