const MAX_RUNS = 1000

const clone = (o) => JSON.parse(JSON.stringify(o))
const sample = (a) => a[Math.floor(Math.random() * a.length)]
// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const maxError = () =>
  new Error(
    [
      "Picking recipients failed.",
      `It exceeded max run count of ${MAX_RUNS} which probably means`,
      "your participants config array contains impossible skip constraints.",
    ].join(" ")
  )

const pickRecipients = (_participants, runCount = 1) => {
  if (runCount > MAX_RUNS) {
    throw maxError()
  }

  const results = []
  const used = []
  const participants = shuffle(clone(_participants))

  for (let i = 0, m = participants.length; i < m; i++) {
    const participant = participants[i]
    const skip = Array.isArray(participant.skip) ? participant.skip : []

    const recipient = sample(
      shuffle(
        participants.filter(
          ({ name }) =>
            participant.name !== name &&
            !skip.includes(name) &&
            !used.includes(name)
        )
      )
    )

    // If we reached a state where a participant will not get a valid
    // recipient then try again
    if (!recipient) {
      return pickRecipients(participants, ++runCount)
    }

    results.push({
      ...participant,
      recipient: recipient.name,
    })
    used.push(recipient.name)
  }

  return results
}

module.exports = pickRecipients
