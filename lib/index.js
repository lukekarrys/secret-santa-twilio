const Twilio = require("twilio")
const { pick } = require("lodash")

const getParticipants = require("./picker")
const getMessages = require("./messages")
const toNumber = require("./phone-number")

const makeTwilio = (twilio, sendForReal) => {
  const client = new Twilio(twilio.sid, twilio.token)

  const sendOne = async (newMessage) => {
    if (sendForReal) {
      const message = await client.messages.create(newMessage)
      return pick(message, "sid", "to")
    }
    return newMessage
  }

  const resend = async ({ sid, to }) => {
    const message = await client.messages(sid).fetch()
    return sendOne({
      ...message,
      // send message to a different number this time
      to: toNumber(to || message.to),
    })
  }

  const send = (messages) => Promise.all(messages.map((m) => sendOne(m)))

  return { send, resend }
}

module.exports = async ({
  twilio,
  sid,
  to,
  forReals,
  message,
  from,
  participants,
}) => {
  const client = makeTwilio(twilio, forReals)

  if (sid) {
    return client.resend({ sid, to })
  }

  for (const p of participants) {
    if (!p.name || !p.number)
      throw new Error(
        `All participants need a name and number: ${JSON.stringify(p)}`
      )
    if (p.skip && !participants.some((pp) => p.skip.includes(pp.name)))
      throw new Error(
        `Skip must be a valid name of a participant: ${JSON.stringify(p)}`
      )
  }

  return client.send(
    getMessages({
      message,
      from,
      participants: getParticipants(participants),
    })
  )
}
