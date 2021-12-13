require("dotenv").config()

const t = require("tap")
const { randomUUID } = require("crypto")

const phoneNumber = require("../lib/phone-number")
const fixtures = require("./fixtures")
const randomNumber = () => `+1${Math.random().toString().slice(2, 12)}`

const mockTwilio = (options) => {
  class MockTwilio {
    #messages = []
    constructor(throwError = () => {}) {
      const messages = (sid) => ({
        fetch: () => this.#messages.find((m) => m.sid === sid),
      })
      messages.create = (m) => {
        throwError(m)
        m.sid = randomUUID()
        this.#messages.push(m)
        return m
      }
      this.messages = messages
    }
  }
  const mockTwilio = new MockTwilio(options)
  return {
    twilio: class {
      constructor() {
        return mockTwilio
      }
    },
  }
}

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
    t.match(m, {
      message: {
        from: phoneNumber(from),
        to: "+15005550006",
        body: "Name",
      },
    })
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
  ),
    await t.rejects(
      () =>
        twilio({
          message: "Woo",
        }),
      { message: /message must contain/i }
    )
})

t.test("Send works", async (t) => {
  const res = await twilio()

  res.forEach((m) => {
    t.match(m, {
      status: "sent",
      message: {
        sid: /^SM.+/,
        to: /^\+1\d+/,
        from: /^\+1\d+/,
      },
    })
  })
})

// https://support.twilio.com/hc/en-us/articles/223181348-Alphanumeric-Sender-ID-for-Twilio-Programmable-SMS
t.test("Send from alphanumeric sender ID", async (t) => {
  // This is to test that that alphanumeric send ids do not get transformed
  // to numbers, but we cant test them with our test credentials
  await t.rejects(
    () =>
      twilio({
        from: "TEST",
      }),
    { message: /The From phone number TEST is not .*/, status: 400 }
  )
})

t.test("Resend", async (t) => {
  const mocks = mockTwilio()
  const res = await twilio(undefined, mocks)

  const newTo = randomNumber()
  const resend = await twilio(
    {
      sid: res[0].message.sid,
      to: newTo,
    },
    mocks
  )

  const resend2 = await twilio(
    {
      sid: res[1].message.sid,
    },
    mocks
  )

  t.ok(resend.message.sid)
  t.equal(resend.message.to, newTo)
  t.ok(resend2.message.sid)
  t.equal(resend2.message.to, "+15005550006")
})

t.test("One error", async (t) => {
  const mocks = mockTwilio((m) => {
    if (m.body.startsWith("Name5 ")) {
      throw new Error("Message did not send")
    }
  })

  const err = (
    await twilio(
      {
        message: "{{name}} {{recipient}}",
      },
      mocks
    )
  ).find((m) => m.status === "error")

  t.match(err, {
    status: "error",
    error: Error,
    message: { from: String, to: String, body: String },
  })
})
