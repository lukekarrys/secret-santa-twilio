module.exports = (n) =>
  (/[a-zA-Z]/.test(n) || n.startsWith("+") ? n : `+1${n}`).replace(
    /[-()\s]/g,
    ""
  )
