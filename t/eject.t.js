require('proof')(4, prove)

function prove (assert) {
    var ejectable = require('..')

    function echo (value, callback) {
        callback(null, value)
    }

    var f = ejectable(function (async, value) {
        assert(value, 1, 'parameters')
        async([function () {
            async.eject()
            async()(null, 1)
        }, function (error) {
            assert(error.message, 'ejected', 'eject')
        }], function () {
            async()(null, 1)
        }, [function (value) {
            assert(value, 1, 'continuing')
            var wait = async()
            async.eject()
            wait()
        }, function (error) {
            assert(error.message, 'ejected', 'eject outstanding')
        }])
    })

    f(1, function (error) {
        if (error) throw error
    })
}
