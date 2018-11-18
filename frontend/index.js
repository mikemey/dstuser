/* global fetch */
import $ from 'jquery'

const resultDiv = $('div#result')
const statusDiv = $('div#status')

statusDiv.text('Loading...')
fetch('/dstuapi/userprofile')
  .then(data => data.text())
  .then(profile => {
    statusDiv.text('Processing...')
    resultDiv.text('response: ' + profile)
    statusDiv.text('done processing.')
  })
