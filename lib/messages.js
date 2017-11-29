'use strict'

const {map} = require('lodash')

const defaultMessage = 'Hey {{name}}, this is your friendly neighborhood SecretSantaBot telling you that you need to buy a gift for {{recipient}}!'

module.exports = ({twilio, participants, message = defaultMessage}) => map(participants, (p) => ({
  __name: p.name,
  from: twilio.from,
  to: p.number,
  body: message.replace('{{name}}', p.name).replace('{{recipient}}', p.recipient)
}))
