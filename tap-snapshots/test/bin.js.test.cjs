/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/bin.js TAP dry > must match snapshot 1`] = `
[
  {
    "from": "+15005550006",
    "to": "+15005550006",
    "body": "Hey {NAME}, get a gift for {NAME}!"
  },
  {
    "from": "+15005550006",
    "to": "+15005550006",
    "body": "Hey {NAME}, get a gift for {NAME}!"
  },
  {
    "from": "+15005550006",
    "to": "+15005550006",
    "body": "Hey {NAME}, get a gift for {NAME}!"
  },
  {
    "from": "+15005550006",
    "to": "+15005550006",
    "body": "Hey {NAME}, get a gift for {NAME}!"
  },
  {
    "from": "+15005550006",
    "to": "+15005550006",
    "body": "Hey {NAME}, get a gift for {NAME}!"
  },
  {
    "from": "+15005550006",
    "to": "+15005550006",
    "body": "Hey {NAME}, get a gift for {NAME}!"
  },
  {
    "from": "+15005550006",
    "to": "+15005550006",
    "body": "Hey {NAME}, get a gift for {NAME}!"
  },
  {
    "from": "+15005550006",
    "to": "+15005550006",
    "body": "Hey {NAME}, get a gift for {NAME}!"
  }
]
`

exports[`test/bin.js TAP dry > must match snapshot 2`] = `
Dry run: true
Participants:
-- {NAME} +15005550006
-- {NAME} +15005550006 {NAME}
-- {NAME} +15005550006 {NAME}
-- {NAME} +15005550006 {NAME}
-- {NAME} +15005550006 {NAME}
-- {NAME} +15005550006 {NAME}
-- {NAME} +15005550006
-- {NAME} +15005550006 {NAME}
Results:
`

exports[`test/bin.js TAP errors bad config > must match snapshot 1`] = `
An error occurred:
Error: Parsing json config: SyntaxError: Unexpected token { in JSON at position 1
    at parseArgs ({CWD}/bin/index.js)
`

exports[`test/bin.js TAP errors bad input > must match snapshot 1`] = `
An error occurred:
Error: Parsing stdin config: SyntaxError: Unexpected token { in JSON at position 1
    at parseArgs ({CWD}/bin/index.js)
    at processTicksAndRejections (node:internal/process/task_queues)
`

exports[`test/bin.js TAP errors bad participants > must match snapshot 1`] = `
An error occurred:
Error: Parsing participants string: SyntaxError: Unexpected token { in JSON at position 1
    at parseArgs ({CWD}/bin/index.js)
    at processTicksAndRejections (node:internal/process/task_queues)
`

exports[`test/bin.js TAP errors no config > must match snapshot 1`] = `
An error occurred:
Error: Parsing json config: Error: ENOENT: no such file or directory, open '{CWD}/test/tap-testdir/noconfig.json'
    at parseArgs ({CWD}/bin/index.js)
`

exports[`test/bin.js TAP errors no participants > must match snapshot 1`] = `
Dry run: false
Participants:
None
An error occurred:
Error: Participants must be a non-empty array
    at validateParticipants ({CWD}/lib/index.js)
    at module.exports ({CWD}/lib/index.js)
    at main ({CWD}/bin/index.js)
    at processTicksAndRejections (node:internal/process/task_queues)
`

exports[`test/bin.js TAP input types > stderr 1`] = `
Dry run: false
Participants:
-- {NAME} +15005550006
-- {NAME} +15005550006 {NAME}
-- {NAME} +15005550006 {NAME}
-- {NAME} +15005550006 {NAME}
-- {NAME} +15005550006 {NAME}
-- {NAME} +15005550006 {NAME}
-- {NAME} +15005550006
-- {NAME} +15005550006 {NAME}
Saved a copy of the results at {CWD}/test/tap-testdir/secret-santa-{DATE}.json
Results:
`

exports[`test/bin.js TAP input types > stdout 1`] = `
[
  {
    "sid": "{SID}",
    "to": "+15005550006"
  },
  {
    "sid": "{SID}",
    "to": "+15005550006"
  },
  {
    "sid": "{SID}",
    "to": "+15005550006"
  },
  {
    "sid": "{SID}",
    "to": "+15005550006"
  },
  {
    "sid": "{SID}",
    "to": "+15005550006"
  },
  {
    "sid": "{SID}",
    "to": "+15005550006"
  },
  {
    "sid": "{SID}",
    "to": "+15005550006"
  },
  {
    "sid": "{SID}",
    "to": "+15005550006"
  }
]
`
