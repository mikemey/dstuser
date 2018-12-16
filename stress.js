const rp = require('request-promise')
const moment = require('moment')

const htmlTransformOpts = (url, method = 'GET') => Object.assign(
  { uri: url },
  { method },
  // { transform: body => body.length },
  { followRedirect: false }
)

const placeHolder = 'XXXX'
const getFullUrl = userId => `https://derstandard.at/userprofil/postings/${placeHolder}?pageNumber=1&sortMode=1`
  .replace(placeHolder, userId)

const startTimer = () => process.hrtime()
const stopTimer = start => {
  const stop = process.hrtime(start)
  const millis = stop[0] * 1000 + stop[1] / 1000000
  return millis.toFixed(0)
}

const times = []
const request = url => {
  const now = moment.utc()
  times.push(now)

  const timePastS = now.diff(times[0], 'seconds')
  const rps = timePastS > 0
    ? times.length / timePastS
    : 0

  process.stdout.write(`[${rps.toFixed(2)} rps`)
  const requestTimer = startTimer()
  return rp(htmlTransformOpts(url))
    .finally(() => {
      process.stdout.write(` - ${stopTimer(requestTimer)}ms] `)
    })
}

const userStartId = 147000
const userEndId = userStartId + 1000

const requestUserPage = userId => {
  const timerTotal = startTimer()
  const url = getFullUrl(userId)
  process.stdout.write(`\n[ ${url} ]: `)
  return request(url)
    .then(res => {
      if (res.includes('hat nichts gepostet.</h3>')) {
        process.stdout.write(`NO POSTS`)
      } else if (res.includes('<h3>Dieses Profil ist inaktiv.</h3>')) {
        process.stdout.write(`INACTIVE`)
      } else {
        process.stdout.write(`OK [${res.length}]`)
      }
    })
    .catch(err => {
      process.stdout.write(`NOK [${err.statusCode}]`)
    })
    .finally(() => {
      process.stdout.write(`\t(t: ${stopTimer(timerTotal)}ms)`)
      if (userId < userEndId) {
        return requestUserPage(userId + 1)
      }
      return Promise.resolve()
    })
}

requestUserPage(userStartId)
