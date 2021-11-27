const minimist = require("minimist")
const config = require("getconfig")

const main = require("./lib/index")

main(
  ...config,
  minimist(process.argv.slice(2), {
    string: ["to", "sid"],
    boolean: "forReals",
  })
)
  .then((r) => console.log(JSON.stringify(r, null, 2)))
  .catch((e) => console.error("An error occurred", e))
