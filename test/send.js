'use strict'

require('dotenv').config()

const test = require('tape')
const config = require('getconfig')
const {startsWith} = require('lodash')
const send = require('../lib/send')

const twilioConfig = (number) => Object.assign({}, config.twilio, { from: number || config.twilio.from })

test('Send fake', (t) => {
  const c = twilioConfig()

  send(c, false, (err, res) => {
    t.notOk(err)

    res.forEach((m) => {
      t.equal(m.from, c.from)
      t.equal(m.to, c.from)
      t.ok(startsWith(m.__name, 'Name'))
      t.ok(m.body)
    })

    t.end()
  })
})

test('Send error', (t) => {
  const c = twilioConfig('+15005550000')

  send(c, true, (err, res) => {
    t.notOk(res)
    t.ok(err)

    t.equal(err.status, 400)
    t.equal(err.message, `The From phone number ${c.from} is not a valid, SMS-capable inbound phone number or short code for your account.`)

    t.end()
  })
})

test('Send works', (t) => {
  const c = twilioConfig('+15005550006')

  send(c, true, (err, res) => {
    t.notOk(err)

    res.forEach((m) => {
      t.ok(typeof m === 'string')
      t.ok(m)
      t.ok(startsWith(m, 'SM'))
    })

    t.end()
  })
})
