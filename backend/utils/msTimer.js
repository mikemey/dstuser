const startTimer = () => process.hrtime()
const stopTimer = start => {
  const stop = process.hrtime(start)
  const millis = stop[0] * 1000 + stop[1] / 1000000
  return millis.toFixed(0)
}

module.exports = { startTimer, stopTimer }
