const fs = require('fs')
const path = require('path')

const testDataDir = './comments'

const getComment = (userId, pageId) => {
  const fileName = `profile_${userId}_${pageId}.txt`
  return fs.readFileSync(path.join(__dirname, testDataDir, fileName), 'utf8')
}

const getCommentResult = userId => {
  const fileName = `profile_${userId}_result.json`
  return require(`${testDataDir}/${fileName}`)
}

module.exports = { getComment, getCommentResult }
