require('proof')(1, prove)

function prove (assert) {
    var eject = require('../..')

    eject()

    try {
        eject(new Error('ejected'))
    } catch (error) {
        assert(error.message, 'ejected', 'thrown')
    }
}
