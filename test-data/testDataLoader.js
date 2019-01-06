const fs = require('fs')
const path = require('path')

const postingsDir = './postings'
const ratingsDir = './ratings'
const errorsDir = './errors'

const HOST_RE = /\{DSTU_HOST\}/g

const readFile = (dir, fileName) =>
  fs.readFileSync(path.join(__dirname, dir, fileName), 'utf8')

const TestDataLoader = host => {
  const getComment = (userId, pageId) => {
    const fileName = `profile_${userId}_${pageId}.txt`
    return readFile(postingsDir, fileName)
      .replace(HOST_RE, host)
  }

  const getCommentResult = (userId, fullTestResults = false) => {
    const fileName = `profile_${userId}_result.json`
    const resultObj = JSON.parse(readFile(postingsDir, fileName).replace(HOST_RE, host))

    if (!fullTestResults) {
      resultObj.forEach(partialResult => {
        partialResult.postings.forEach(post => delete post.uiDate)
      })
    }
    return resultObj
  }

  const get404Page = () => readFile(errorsDir, '404response.html')
  const get302Page = () => readFile(errorsDir, '302response.html')

  const getRating = (userId, postingId) => {
    const fileName = `rating_${userId}_${postingId}.txt`
    return readFile(ratingsDir, fileName)
      .replace(HOST_RE, host)
  }

  const getRatingResult = (userId, postingId) => {
    const fileName = `rating_${userId}_${postingId}.json`
    return JSON.parse(readFile(ratingsDir, fileName)
      .replace(HOST_RE, host)
    )
  }

  return {
    getComment, getCommentResult, get404Page, get302Page, getRating, getRatingResult
  }
}
module.exports = TestDataLoader
