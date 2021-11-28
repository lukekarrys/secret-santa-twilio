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

exports[`test/bin.js TAP wait > must match snapshot 1`] = `
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

exports[`test/bin.js TAP wait > must match snapshot 2`] = `
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
Doing the real thing in 1 seconds...
Saved a copy of the results at {CWD}/test/tap-testdir-bin-wait/secret-santa-{DATE}.json
Results:
`

exports[`test/bin.js TAP with args > must match snapshot 1`] = `
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

exports[`test/bin.js TAP with args > must match snapshot 2`] = `
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
Saved a copy of the results at {CWD}/test/tap-testdir-bin-with-args/secret-santa-{DATE}.json
Results:
`

exports[`test/bin.js TAP with config > must match snapshot 1`] = `
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

exports[`test/bin.js TAP with config > must match snapshot 2`] = `
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
Saved a copy of the results at {CWD}/test/tap-testdir-bin-with-config/secret-santa-{DATE}.json
Results:
`
