require('proof')(6, async (okay) => {
    const once = require('..')
    const events = require('events')
    {
        const ee = new events.EventEmitter
        const p = once(ee, 'event')
        ee.emit('event', 1, 2)
        const [ one, two ] = await p.promise
        okay({ one, two }, { one: 1, two: 2 }, 'resolve event')
    }
    {
        const ee = new events.EventEmitter
        const p = once(ee, [ 'event', 'other' ])
        ee.emit('event', 1, 2)
        const [ name, one, two ] = await p.promise
        okay({ name, one, two }, { name: 'event', one: 1, two: 2 }, 'set of events')
    }
    {
        const ee = new events.EventEmitter
        const p = once(ee, 'event').promise
        const test = []
        ee.emit('error', new Error('error'))
        try {
            await p
        } catch (error) {
            test.push(error.message)
        }
        okay(test, [ 'error' ], 'reject')
    }
    {
        const ee = new events.EventEmitter
        const p = once(ee, 'error')
        ee.emit('error', new Error('error'))
        const [ error ] = await p.promise
        okay(error.message, 'error', 'handle error')
    }
    {
        const ee = new events.EventEmitter
        const p = once(ee, [ 'skip', 'event' ])
        p.emit('event', 1)
        okay(await p.promise, [ 'event', 1 ], 'cancel with resolve')
        p.emit('event', 1)
    }
    {
        const ee = new events.EventEmitter
        const p = once(ee, 'event')
        p.emit('error', new Error('thrown'))
        const errors = []
        try {
            await p.promise
        } catch (error) {
            errors.push(error.message)
        }
        okay(errors, [ 'thrown' ], 'cancel with error')
        p.emit('error', new Error('thrown'))
    }
    {
        once.NULL.resolve('event')
        once.NULL.reject()
    }
})
