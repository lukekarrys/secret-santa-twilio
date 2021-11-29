const t = require("tap")

const picker = require("../lib/picker")
const fixtures = require("./fixtures")

const uniq = (arr) => Array.from(new Set(arr))

for (let i = 0; i < 2500; i++) {
  t.test(`Iteration ${i}`, (t) => {
    const picked = picker(fixtures.participants)
    const names = picked.map(({ name }) => name).filter(Boolean)
    const recipients = picked.map(({ recipient }) => recipient).filter(Boolean)

    t.ok(names.length, "Names has items")
    t.ok(recipients.length, "Recipients has items")
    t.equal(names.length, uniq(names).length, "Names are unique")
    t.equal(recipients.length, uniq(recipients).length, "Recipients are unique")
    t.equal(
      names.length,
      recipients.length,
      "Names and recipients are equal lengths"
    )

    picked.forEach((participant) => {
      t.ok(participant.recipient, "Recipient exists")
      t.ok(participant.name, "Name exists")

      t.equal(typeof participant.recipient, "string", "Recipient is a string")
      t.equal(typeof participant.name, "string", "Name is a stirng")
      t.ok(
        Array.isArray(participant.skip) ||
          typeof participant.skip === "undefined",
        "Skip is an array"
      )

      t.notOk(
        participant.recipient === participant.name,
        "Recipient is not the participant"
      )

      if (participant.skip) {
        t.notOk(
          participant.skip.includes(participant.recipient),
          "Recipient is not in skip"
        )
      }
    })

    t.end()
  })
}

t.test("Impossible participants", (t) => {
  const impossible = () =>
    picker([
      {
        name: "Name1",
        number: "+15005550006",
      },
      {
        name: "Name2",
        number: "+15005550006",
        skip: ["Name1"],
      },
    ])

  t.throws(impossible, /Picking recipients failed/)

  t.end()
})
