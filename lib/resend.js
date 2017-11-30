'use strict'

const Twilio = require('twilio')
const minimist = require('minimist')
const {twilio: twilioConfig} = require('getconfig')

const argv = minimist(process.argv.slice(2), { string: ['to', 'sid'], boolean: 'for-reals' })
const sendForReal = argv['for-reals']
const {to, sid} = argv

const send = (message) => sendForReal ? twilioClient.messages.create(message) : message

const twilioClient = new Twilio(twilioConfig.sid, twilioConfig.auth)

const resendSid = (sid) => twilioClient.messages(sid)
  .fetch()
  .then((message) => ({
    from: message.from,
    body: message.body,
    to: to || message.to
  }))
  .then(send)
  .then((res) => sendForReal ? res.sid : res)

resendSid(sid)
  .then(console.log)
  .catch(console.error)
