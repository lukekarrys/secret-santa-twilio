const t = require("tap")
const { each, includes, map, compact, uniq } = require("lodash")

const picker = require("../lib/picker")
const fixtures = require("./fixtures")

const ITERATIONS = 2500

for (let i = 0; i < ITERATIONS; i++) {
  t.test(`Iteration ${i}`, (t) => {
    const picked = picker(fixtures.participants)
    const names = compact(map(picked, "name"))
    const recipients = compact(map(picked, "recipient"))

    t.ok(names.length, "Names has items")
    t.ok(recipients.length, "Recipients has items")
    t.equal(names.length, uniq(names).length, "Names are unique")
    t.equal(recipients.length, uniq(recipients).length, "Recipients are unique")
    t.equal(
      names.length,
      recipients.length,
      "Names and recipients are equal lengths"
    )

    each(picked, (participant) => {
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
          includes(participant.skip, participant.recipient),
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
