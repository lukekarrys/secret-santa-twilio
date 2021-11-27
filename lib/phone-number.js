module.exports = (n) =>
  (n.startsWith("+") ? n : `+1${n}`).replace(/[-()\s]/g, "")
