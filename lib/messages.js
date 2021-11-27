const toNumber = require("./phone-number")

const DEFAULT_MESSAGE =
  "Hey {{name}}, this is your friendly neighborhood SecretSantaBot telling you that you need to buy a gift for {{recipient}}!"

module.exports = ({ from, participants, message = DEFAULT_MESSAGE }) =>
  participants.map((p) => ({
    from: toNumber(from),
    to: toNumber(p.number),
    body: message
      .replace("{{name}}", p.name)
      .replace("{{recipient}}", p.recipient),
  }))
