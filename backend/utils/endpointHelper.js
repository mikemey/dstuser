const checkInputParameter = (ws, param) => new Promise((resolve, reject) => {
  const pid = Number(param)
  if (isNaN(pid)) {
    const msg = `NaN: "${param}"`
    ws.send(JSON.stringify(errorMessage(msg)))
    reject(Error(msg))
  } else {
    resolve(pid)
  }
})

const errorMessage = error => { return { error } }

module.exports = checkInputParameter
