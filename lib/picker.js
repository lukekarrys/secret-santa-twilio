'use strict'

const {includes, reject, sample, clone, shuffle} = require('lodash')
const isMe = (me) => (p) => me.name === p.name
const isSkip = (me) => (p) => Array.isArray(me.skip) ? includes(me.skip, p.name) : false
const isUsed = (used) => (p) => includes(used, p.name)
const rejector = ({used, participant}) => (p) => isMe(participant)(p) || isSkip(participant)(p) || isUsed(used)(p)

const pickRecipients = (participants) => {
  const results = []
  const used = []
  const shuffled = shuffle(participants)

  for (let i = 0, m = shuffled.length; i < m; i++) {
    const participant = clone(shuffled[i])
    const recipient = sample(reject(shuffled, rejector({used, participant})))

    // If we reached a state where a participant will not get a valid
    // recipient then try again
    if (!recipient) return pickRecipients(shuffled)

    participant.recipient = recipient.name
    results.push(participant)
    used.push(recipient.name)
  }

  return results
}

module.exports = pickRecipients
