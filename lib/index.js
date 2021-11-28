const Twilio = require("twilio")
const { pick } = require("lodash")

const getParticipants = require("./picker")
const getMessages = require("./messages")
const toNumber = require("./phone-number")

const makeTwilio = (sid, token, dry) => {
  const client = new Twilio(sid, token)

  const sendOne = async (newMessage) => {
    if (!dry) {
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
  // Dry run or not
  dry,
  // Twilio auth
  accountSid,
  accountToken,
  // Twilio from number
  from,
  // Array of participants
  participants,
  // Message text to send
  message,
  // If resending a message supply a message sid
  // and optionally a new to number
  sid,
  to,
}) => {
  const client = makeTwilio(accountSid, accountToken, dry)

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
