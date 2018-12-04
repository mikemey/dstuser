const fs = require('fs')
const path = require('path')

const commentsDir = './comments'
const errorsDir = './errors'

const readFile = (dir, fileName) =>
  fs.readFileSync(path.join(__dirname, dir, fileName), 'utf8')

const getComment = (userId, pageId) => {
  const fileName = `profile_${userId}_${pageId}.txt`
  return readFile(commentsDir, fileName)
}

const getCommentResult = userId => {
  const fileName = `profile_${userId}_result.json`
  return require(`${commentsDir}/${fileName}`)
}

const get404Page = () => readFile(errorsDir, '404response.html')

module.exports = { getComment, getCommentResult, get404Page }
