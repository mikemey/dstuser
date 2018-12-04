const fs = require('fs')
const path = require('path')

const commentsDir = './comments'
const errorsDir = './errors'

const HOST_RE = /\{DSTU_HOST\}/g

const readFile = (dir, fileName) =>
  fs.readFileSync(path.join(__dirname, dir, fileName), 'utf8')

const TestDataLoader = host => {
  const getComment = (userId, pageId) => {
    const fileName = `profile_${userId}_${pageId}.txt`
    return readFile(commentsDir, fileName)
      .replace(HOST_RE, host)
  }

  const getCommentResult = userId => {
    const fileName = `profile_${userId}_result.json`
    return JSON.parse(readFile(commentsDir, fileName)
      .replace(HOST_RE, host)
    )
  }

  const get404Page = () => readFile(errorsDir, '404response.html')
  const get302Page = () => readFile(errorsDir, '302response.html')

  return { getComment, getCommentResult, get404Page, get302Page }
}
module.exports = TestDataLoader
