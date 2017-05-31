'use strict'

const Twilio = require('twilio')
const {mapSeries} = require('async')
const {map} = require('lodash')
const {twilio, participants, message} = require('getconfig')
const getMessages = require('./messages')
const picker = require('./picker')

module.exports = (config, sendForReal, cb) => {
  const twilioConfig = config || twilio

  const twilioClient = new Twilio(twilioConfig.sid, twilioConfig.auth)
  const messages = getMessages({message, twilio: twilioConfig, participants: picker(participants)})

  const formatResults = (res) => sendForReal ? map(res, 'sid') : res

  const passSuccess = (val, cb) => cb(null, val)
  const sendMessage = (m, cb) => twilioClient.messages.create(m)
    .then((resp) => cb(null, resp))
    .catch((err) => cb(err))

  mapSeries(
    messages,
    sendForReal ? sendMessage : passSuccess,
    (err, res) => err ? cb(err) : cb(null, formatResults(res))
  )
}
