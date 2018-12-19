const createBuilder = (userName, totalParts) => {
  let part = 0

  const build = postings => {
    part += 1
    return { part, totalParts, userName, postings }
  }
  return { build }
}

module.exports = createBuilder
