#!/usr/bin/env node

const path = require("path")
const { setTimeout } = require("timers/promises")
const fs = require("fs/promises")
const minimist = require("minimist")

const phoneNumber = require("../lib/phone-number")
const secretSanta = require("../lib/index")

const main = async (args) => {
  const { dry, participants = [], wait } = args

  console.error(`Dry run: ${!!dry}\nParticipants:`)
  console.error(
    participants
      .map(({ name, number, skip = [] }) =>
        `-- ${name} ${phoneNumber(number)} ${skip.join(",")}`.trim()
      )
      .join("\n") || "None"
  )

  if (!dry && wait) {
    console.error(
      `Doing the real thing in ${wait} seconds, Ctrl-C to cancel...`
    )
    await setTimeout(wait * 1000)
  }

  return {
    writeFile: !dry,
    results: await secretSanta(args),
  }
}

const readStream = (stream) => {
  stream.setEncoding("utf8")
  return new Promise((r) => {
    let data = ""
    stream.on("data", (chunk) => (data += chunk))
    stream.on("end", () => r(data))
  })
}

const parseArgs = async () => {
  let argv = minimist(process.argv.slice(2), {
    string: [
      "config",
      "accountSid",
      "accountToken",
      "from",
      "participants",
      "message",
      "sid",
      "to",
    ],
    number: ["wait"],
    boolean: ["dry"],
    default: {
      dry: false,
      wait: 5,
      accountSid: process.env.TWILIO_SID,
      accountToken: process.env.TWILIO_TOKEN,
    },
  })

  if (argv.config) {
    try {
      const jsonConfig = path.resolve(process.cwd(), argv.config)
      argv = {
        ...argv,
        ...JSON.parse(await fs.readFile(jsonConfig, "utf-8")),
      }
    } catch (e) {
      throw new Error(`Parsing json config: ${e}`)
    }
  }

  /* istanbul ignore else */
  if (!process.stdin.isTTY) {
    const input = await readStream(process.stdin)
    if (input) {
      try {
        argv = {
          ...argv,
          ...JSON.parse(input),
        }
      } catch (e) {
        throw new Error(`Parsing stdin config: ${e}`)
      }
    }
  }

  if (typeof argv.participants === "string") {
    try {
      argv.participants = JSON.parse(argv.participants)
    } catch (e) {
      throw new Error(`Parsing participants string: ${e}`)
    }
  }

  return argv
}

parseArgs()
  .then(main)
  .then(async ({ results, writeFile }) => {
    if (writeFile) {
      try {
        const resultsFile = path.resolve(
          process.cwd(),
          `secret-santa-${new Date().toISOString().replace(/[.:]/g, "_")}.json`
        )
        await fs.writeFile(resultsFile, JSON.stringify(results))
        console.error(`Saved a copy of the results at ${resultsFile}`)
      } catch {
        // Do nothing
      }
    }
    console.error("Results:")
    console.log(JSON.stringify(results, null, 2))
  })
  .catch((e) => {
    console.error("An error occurred:")
    console.error(e)
    process.exit(1)
  })
