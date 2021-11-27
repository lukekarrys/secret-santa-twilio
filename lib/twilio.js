const Twilio = require("twilio")
const { pick } = require("lodash")

module.exports = async (config, sendForReal) => {
  const client = new Twilio(config.sid, config.auth)

  const sendOne = async (newMessage) => {
    if (sendForReal) {
      const message = await client.messages.create(newMessage)
      return pick(message, "sid", "to")
    }
    return newMessage
  }

  const resend = async ({ sid, to }) => {
    const message = await client.messages(sid).fetch()
    return sendOne(client, {
      ...message,
      // send message to a different number this time
      to: to || message.to,
    })
  }

  const send = (messages) => Promise.all(messages.map((m) => send(m)))

  return { send, resend }
}
