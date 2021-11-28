require("dotenv").config()

const t = require("tap")
const path = require("path")
const fs = require("fs/promises")
const { spawnSync } = require("child_process")

const cleanSnapshot = (str) =>
  str
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}_\d{2}_\d{2}_\d{3}Z/g, "{DATE}")
    .replace(/Name\d/g, "{NAME}")
    .replace(/"SM.{32}"/g, `"{SID}"`)
    .replace(new RegExp(process.cwd(), "g"), "{CWD}")
    .replace(/(\/tap-testdir)-.*(\/)/g, "$1$2")
    .replace(/:\d+:\d+/g, "")

t.cleanSnapshot = cleanSnapshot

const { TWILIO_SID, TWILIO_TOKEN, ...restEnv } = process.env

const defaultArgs = (options) =>
  Object.entries({
    ...require("./fixtures"),
    accountSid: TWILIO_SID,
    accountToken: TWILIO_TOKEN,
    message: "Hey {{name}}, get a gift for {{recipient}}!",
    wait: 0,
    dry: false,
    ...options,
  })
    .filter(([, v]) => v !== null)
    .reduce((acc, [k, v]) => ((acc[k] = v), acc), {})

const withFile = (args) => [
  {
    testdir: {
      "myconfig.json": JSON.stringify(defaultArgs(args)),
    },
  },
  ["--config", "./myconfig.json"],
]

const withArgs = (args) => [
  {},
  Object.entries(defaultArgs(args)).reduce(
    (acc, [k, v]) =>
      acc.concat(`--${k}`, typeof v === "object" ? JSON.stringify(v) : v),
    []
  ),
]

const withInput = (args) => [{ input: JSON.stringify(defaultArgs(args)) }]

const run = (t, { testdir = {}, env = {}, input } = {}, args = []) => {
  const root = t.testdir(testdir)
  const res = spawnSync(path.resolve(__dirname, "../bin/index.js"), args, {
    cwd: root,
    encoding: "utf-8",
    env: {
      ...restEnv,
      ...env,
      NODE_ENV: "test",
    },
    input,
  })
  return {
    stdout: res.stdout.trim(),
    stderr: res.stderr.trim(),
    parsed: () => JSON.parse(res.stdout.trim()),
    file: async () => {
      const [, file] = res.stderr.match(/results at (.*)/)
      return JSON.parse(await fs.readFile(file, "utf-8"))
    },
  }
}

t.test("input types", async (t) => {
  const outputs = []

  const inputs = {
    args: (t) => run(t, ...withArgs()),
    file: (t) => run(t, ...withFile()),
    input: (t) => run(t, ...withInput()),
  }

  for (const [name, fn] of Object.entries(inputs)) {
    await t.test(`input ${name}`, async (t) => {
      const res = fn(t)
      const data = res.parsed()
      t.ok(data.every((d) => d.sid))
      t.ok(data.every((d) => d.to))
      t.strictSame(data, await res.file(), "data and file are the same")
      outputs.push(res)
    })
  }

  const stdout = outputs.map((o) => cleanSnapshot(o.stdout))
  const stderr = outputs.map((o) => cleanSnapshot(o.stderr))
  t.equal(new Set(stdout).size, 1)
  t.equal(new Set(stderr).size, 1)
  t.matchSnapshot(stdout[0], "stdout")
  t.matchSnapshot(stderr[0], "stderr")
})

t.test("dry", async (t) => {
  const res = run(t, ...withFile({ dry: true }))
  const data = res.parsed()
  t.ok(data.every((d) => d.from))
  t.ok(data.every((d) => d.to))
  t.ok(data.every((d) => d.body))
  t.rejects(() => res.file())
  t.matchSnapshot(res.stdout)
  t.matchSnapshot(res.stderr)
})

t.test("wait", async (t) => {
  const res = run(t, ...withFile({ wait: 1 }))
  t.match(res.stderr, /Doing the real thing in 1/)
})

t.test("twilio env vars", async (t) => {
  const args = withFile({ accountSid: null, accountToken: null })
  args[0].env = { TWILIO_SID, TWILIO_TOKEN }
  const res = run(t, ...args)
  const data = JSON.parse(res.stdout)
  t.ok(data.every((d) => d.sid))
  t.ok(data.every((d) => d.to))
})

t.test("errors", async (t) => {
  t.test("no config", async (t) => {
    const res = run(t, undefined, ["--config", "./noconfig.json"])
    t.equal(res.stdout, "")
    t.match(res.stderr, "An error occurred")
    t.matchSnapshot(res.stderr)
  })

  t.test("bad config", async (t) => {
    const res = run(
      t,
      {
        testdir: {
          "myconfig.json": "{{{{",
        },
      },
      ["--config", "./myconfig.json"]
    )
    t.equal(res.stdout, "")
    t.match(res.stderr, "An error occurred")
    t.matchSnapshot(res.stderr)
  })

  t.test("bad participants", async (t) => {
    const res = run(t, ...withFile({ participants: "{{{" }))
    t.equal(res.stdout, "")
    t.match(res.stderr, "An error occurred")
    t.matchSnapshot(res.stderr)
  })

  t.test("no participants", async (t) => {
    const res = run(t, ...withFile({ participants: null }))
    t.equal(res.stdout, "")
    t.match(res.stderr, "An error occurred")
    t.matchSnapshot(res.stderr)
  })

  t.test("bad input", async (t) => {
    const res = run(t, { input: "{{{" })
    t.equal(res.stdout, "")
    t.match(res.stderr, "An error occurred")
    t.matchSnapshot(res.stderr)
  })
})
