const Twilio = require("twilio")

const getRecipients = require("./recipients")
const toNumber = require("./phone-number")

const DEFAULT_MESSAGE =
  "Hey {{name}}, this is your friendly neighborhood SecretSantaBot telling you that you need to buy a gift for {{recipient}}!"

const twilio = (sid, token, dry) => {
  const client = new Twilio(sid, token)

  const send = async (newMessage) => {
    if (dry) return newMessage
    const message = await client.messages.create(newMessage)
    return {
      sid: message.sid,
      to: message.to,
    }
  }

  const resend = async ({ sid, to }) => {
    const message = await client.messages(sid).fetch()
    return send({
      ...message,
      // send message to a different number this time
      to: toNumber(to || message.to),
    })
  }

  const sendAll = (messages) => Promise.all(messages.map((m) => send(m)))

  return { send: sendAll, resend }
}

const validateParticipants = (participants) => {
  if (!participants || !participants.length) {
    throw new Error("Participants must be a non-empty array")
  }

  for (const p of participants) {
    const participantErr = (m) => new Error(`${m}: ${JSON.stringify(p)}`)
    if (!p.name || !p.number)
      throw participantErr("All participants need a name and number")
    if (p.skip && !participants.some((pp) => p.skip.includes(pp.name)))
      throw participantErr("Skip must be a valid name of a participant")
  }
}

const validateMessage = (message) => {
  if (!message?.includes("{{name}}") || !message?.includes("{{recipient}}")) {
    throw new Error("Message must contain `{{name}}` and `{{recipient}}`")
  }
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
  message = DEFAULT_MESSAGE,
  // If resending a message supply a message sid
  // and optionally a new to number
  sid,
  to,
}) => {
  if (sid) {
    return twilio(accountSid, accountToken, dry).resend({ sid, to })
  }

  validateParticipants(participants)
  validateMessage(message)

  return twilio(accountSid, accountToken, dry).send(
    getRecipients(participants).map((p) => ({
      from: toNumber(from),
      to: toNumber(p.number),
      body: message
        .replace("{{name}}", p.name)
        .replace("{{recipient}}", p.recipient),
    }))
  )
}
