'use strict'

const {twilio} = require('getconfig')
const send = require('./lib/send')
const sendForReal = process.argv.join(' ').includes('--for-reals')

const log = (err, res) => console.log(err || JSON.stringify(res, null, 2))

send(twilio, sendForReal, log)
