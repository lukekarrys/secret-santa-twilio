require("dotenv").config()

const t = require("tap")
const { randomUUID } = require("crypto")
const config = require("getconfig")
const { startsWith } = require("lodash")

const twilio = (options, mocks) =>
  t.mock(
    "../lib/index",
    mocks
  )({
    forReals: true,
    ...config,
    ...options,
  })

t.test("Send fake", async (t) => {
  const res = await twilio({ forReals: false })

  res.forEach((m) => {
    t.equal(m.from, config.from)
    t.equal(m.to, config.from)
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

  const newTo = `+1${Math.random().toString().slice(2, 12)}`
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
