require("dotenv").config()

const t = require("tap")
const { randomUUID } = require("crypto")
const { startsWith } = require("lodash")

const phoneNumber = require("../lib/phone-number")
const fixtures = require("./fixtures")
const randomNumber = () => `+1${Math.random().toString().slice(2, 12)}`

const twilio = (options, mocks) =>
  t.mock(
    "../lib/index",
    mocks
  )({
    dry: false,
    accountSid: process.env.TWILIO_SID,
    accountToken: process.env.TWILIO_TOKEN,
    ...fixtures,
    ...options,
  })

t.test("Send fake", async (t) => {
  const from = randomNumber()
  const res = await twilio({ from, dry: true })

  res.forEach((m) => {
    t.equal(m.from, phoneNumber(from))
    t.equal(m.to, "+15005550006")
    t.ok(m.body.includes("Name"))
    t.ok(m.body)
  })
})

t.test("Send error", async (t) => {
  await t.rejects(
    () =>
      twilio({
        from: "+15005550000",
      }),
    { message: /The From phone number \+\d{11} is not .*/, status: 400 }
  )
})

t.test("Invalid configs", async (t) => {
  await t.rejects(
    () =>
      twilio({
        participants: [{ name: "" }],
      }),
    { message: /name and number/i }
  )
  await t.rejects(
    () =>
      twilio({
        participants: [{ name: "Me", number: randomNumber, skip: ["You"] }],
      }),
    { message: /skip must be a valid/i }
  )
  await t.rejects(
    () =>
      twilio({
        participants: null,
      }),
    { message: /participants/i }
  )
})

t.test("Send works", async (t) => {
  const res = await twilio()

  res.forEach((m) => {
    t.ok(typeof m === "object")
    t.ok(m)
    t.ok(m.sid)
    t.ok(m.to)
    t.equal(Object.keys(m).join(","), "sid,to")
    t.ok(startsWith(m.sid, "SM"))
    t.ok(startsWith(m.to, "+1"))
  })
})

t.test("Resend", async (t) => {
  class MockTwilio {
    #messages = []
    constructor() {
      const messages = (sid) => ({
        fetch: () => this.#messages.find((m) => m.sid === sid),
      })
      messages.create = (m) => {
        m.sid = randomUUID()
        this.#messages.push(m)
        return m
      }
      this.messages = messages
    }
  }

  const mockTwilio = new MockTwilio()
  const mocks = {
    twilio: class {
      constructor() {
        return mockTwilio
      }
    },
  }

  const res = await twilio(undefined, mocks)

  const newTo = randomNumber()
  const resend = await twilio(
    {
      sid: res[0].sid,
      to: newTo,
    },
    mocks
  )
  const resend2 = await twilio(
    {
      sid: res[1].sid,
    },
    mocks
  )

  t.ok(resend.sid)
  t.equal(resend.to, newTo)
  t.ok(resend2.sid)
  t.equal(resend2.to, "+15005550006")
})
