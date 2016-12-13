'use strict'

const twilio = require('twilio')
const {mapSeries} = require('async')
const {pluck} = require('lodash')
const {twilio: twilioConfig, participants, message} = require('getconfig')
const getMessages = require('./lib/messages')
const picker = require('./lib/picker')

const sendForReal = process.argv.join(' ').includes('--for-reals')
const twilioClient = twilio(twilioConfig.sid, twilioConfig.auth)
const messages = getMessages({message, twilio: twilioConfig, participants: picker(participants)})

const passSuccess = (val, cb) => cb(null, val)
const formatResults = (res) => JSON.stringify(sendForReal ? pluck(res, 'sid') : res, null, 2)
const log = (err, res) => console.log(err || formatResults(res))

mapSeries(messages, sendForReal ? twilioClient.sendMessage : passSuccess, log)
