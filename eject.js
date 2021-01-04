const assert = require('assert')

class Once {
    constructor ({ ee, events, named }) {
        this.promise = new Promise((resolve, reject) => {
            const listeners = new Map
            function unlisten () {
                for (const [ name, listener ] of listeners) {
                    ee.removeListener(name, listener)
                }
            }
            for (const name of events) {
                listeners.set(name, function (...vargs) {
                    unlisten()
                    if (named) {
                        vargs.unshift(name)
                    }
                    resolve(vargs)
                })
            }
            if (!listeners.has('error')) {
                listeners.set('error', function (error) {
                    unlisten()
                    reject(error)
                })
            }
            for (const [ name, listener ] of listeners) {
                ee.on(name, listener)
            }
            this._emit = function (name, vargs) {
                this._emit = () => {}
                listeners.get(name).apply(null, vargs)
            }
        })
    }

    emit (name, ...vargs) {
        (this._emit)(name, vargs)
    }
}

module.exports = function (ee, events) {
    return new Once({
        ee: ee,
        events: Array.isArray(events) ? events : [ events ],
        named: Array.isArray(events)
    })
}

module.exports.NULL = {
    once: () => {}
}
