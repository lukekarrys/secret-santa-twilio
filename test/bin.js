require("dotenv").config()

const t = require("tap")
const path = require("path")
const fs = require("fs/promises")
const { spawnSync } = require("child_process")

t.cleanSnapshot = (str) =>
  str
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}_\d{2}_\d{2}_\d{3}Z/g, "{DATE}")
    .replace(/Name\d/g, "{NAME}")
    .replace(/"SM.{32}"/g, `"{SID}"`)
    .replace(new RegExp(process.cwd()), "{CWD}")

const { TEST_SID, TEST_TOKEN } = process.env

const defaultArgs = (options) => ({
  ...require("./fixtures"),
  accountSid: TEST_SID,
  accountToken: TEST_TOKEN,
  message: "Hey {{name}}, get a gift for {{recipient}}!",
  wait: 0,
  dry: false,
  ...options,
})

const withConfig = (args) => [
  {
    testdir: {
      "myconfig.json": JSON.stringify(defaultArgs(args)),
    },
  },
  "--config",
  "./myconfig.json",
]

const withArgs = (args) =>
  Object.entries(defaultArgs(args)).reduce((acc, [k, v]) => {
    const value = typeof v === "object" ? JSON.stringify(v) : v
    return acc.concat(`--${k}=${value}`)
  }, [])

const run = (t, { testdir, env } = {}, ...args) => {
  const root = t.testdir(testdir)
  const res = spawnSync(path.resolve(__dirname, "../bin/index.js"), args, {
    cwd: root,
    encoding: "utf-8",
    env: {
      ...process.env,
      ...env,
    },
  })
  return {
    stdout: res.stdout.trim(),
    stderr: res.stderr.trim(),
    file: async () => {
      const file = res.stderr.match(/results at (.*)/)?.[1]
      return JSON.parse(await fs.readFile(file, "utf-8"))
    },
  }
}

t.test("with args", async (t) => {
  const res = run(t, undefined, ...withArgs())
  const data = JSON.parse(res.stdout)
  for (const d of data) {
    t.ok(d.sid)
    t.ok(d.to)
  }
  t.matchSnapshot(res.stdout)
  t.matchSnapshot(res.stderr)
})

t.test("with config", async (t) => {
  const res = run(t, ...withConfig())
  const data = JSON.parse(res.stdout)
  for (const d of data) {
    t.ok(d.sid)
    t.ok(d.to)
  }
  t.strictSame(data, await res.file())
  t.matchSnapshot(res.stdout)
  t.matchSnapshot(res.stderr)
})

t.test("no config", async (t) => {
  const res = run(t, undefined, "--config", "./badconfig.json")
  t.equal(res.stdout, "")
  t.match(res.stderr, "An error occurred")
})

t.test("dry", async (t) => {
  const res = run(t, ...withConfig({ dry: true }))
  const data = JSON.parse(res.stdout)
  for (const d of data) {
    t.ok(d.from)
    t.ok(d.to)
    t.ok(d.body)
  }
  t.rejects(() => res.file())
  t.matchSnapshot(res.stdout)
  t.matchSnapshot(res.stderr)
})

t.test("wait", async (t) => {
  const res = run(t, ...withConfig({ wait: 1 }))
  const data = JSON.parse(res.stdout)
  for (const d of data) {
    t.ok(d.sid)
    t.ok(d.to)
  }
  t.matchSnapshot(res.stdout)
  t.matchSnapshot(res.stderr)
})
