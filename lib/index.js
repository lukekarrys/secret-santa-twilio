const Twilio = require("twilio")
const { pick } = require("lodash")

const getParticipants = require("./picker")
const getMessages = require("./messages")

const makeTwilio = (twilio, sendForReal) => {
  const client = new Twilio(twilio.sid, twilio.auth)

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
      to: to || message.to,
    })
  }

  const send = (messages) => Promise.all(messages.map((m) => sendOne(m)))

  return { send, resend }
}

module.exports = ({
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

  return client.send(
    getMessages({
      message,
      from,
      participants: getParticipants(participants),
    })
  )
}
