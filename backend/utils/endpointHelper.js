const isNumber = (ws, param) => new Promise((resolve, reject) => {
  const paramNum = Number(param)
  if (isNaN(paramNum)) {
    const msg = `NaN: "${param}"`
    ws.send(JSON.stringify(errorMessage(msg)))
    reject(Error(msg))
  } else {
    resolve(paramNum)
  }
})

const errorMessage = error => { return { error } }

const clientIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress

module.exports = { isNumber, clientIp }
