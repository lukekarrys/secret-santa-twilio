const t = require("tap")
const { without } = require("lodash")
const { participants } = require("getconfig")

const picker = require("../lib/picker")
const getMessages = require("../lib/messages")

const NUMBER_LENGTH = 10
const phoneNumberRegex = /^\+1\d{10}$/

t.test("Messages", (t) => {
  const picked = picker(participants)
  const random = `+1${Math.random()
    .toString()
    .slice(2, 2 + NUMBER_LENGTH)}`
  const messages = getMessages({
    from: random,
    participants: picked,
  })

  messages.forEach((message) => {
    t.ok(message.from, "Message has a from")
    t.ok(message.to, "Message has a to")
    t.ok(message.body, "Message has a body")

    t.equal(typeof message.from, "string", "From is a string")
    t.equal(typeof message.to, "string", "To is a string")
    t.equal(typeof message.body, "string", "Body is a string")

    t.equal(message.from, random, "From is correct")
    t.ok(message.from.match(phoneNumberRegex), "From is a phone number")
    t.ok(message.to.match(phoneNumberRegex), "To is a phone number")
  })

  picked.forEach((participant) => {
    const { skip } = participant
    const possible = without(
      picked.map((m) => m.name),
      participant.name,
      ...(Array.isArray(skip) ? skip : [])
    )
    const names = new RegExp(` gift for (?:${possible.join("|")})!$`)
    t.ok(
      messages.find((m) => m.body.match(names)),
      "Body ends with"
    )
  })

  t.end()
})
