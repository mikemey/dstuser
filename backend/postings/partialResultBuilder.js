const createBuilder = commonProps => {
  let part = 0

  const build = postings => {
    part += 1
    return Object.assign({ part, postings }, commonProps)
  }
  return { build }
}

module.exports = createBuilder
