require("dotenv").config()

const { setTimeout } = require("timers/promises")
const minimist = require("minimist")
const config = require("getconfig")

const phoneNumber = require("./lib/phone-number")
const secretSanta = require("./lib/index")

const main = async (args) => {
  const isDev = config.getconfig.isDev
  const forReals = args.forReals

  console.error(`Production: ${!isDev}\nFor Reals: ${forReals}\nParticipants:`)
  console.error(
    args.participants
      .map((p) =>
        `-- ${p.name} ${phoneNumber(p.number)} ${(p.skip || []).join(
          ","
        )} `.trim()
      )
      .join("\n")
  )

  if (!isDev && forReals) {
    const wait = 5
    console.error(`Doing the real thing in ${wait} seconds...`)
    await setTimeout(wait * 1000)
  }

  return secretSanta(args)
}

main({
  ...config,
  ...minimist(process.argv.slice(2), {
    string: ["to", "sid"],
    boolean: "forReals",
  }),
})
  .then((r) => {
    console.error("Results:")
    console.log(JSON.stringify(r, null, 2))
  })
  .catch((e) => console.error("An error occurred", e))
