const request = require('request-promise')

exports.send = function (email) {
  return request({
    url: `${process.env.API_ROOT_URL}/v1/email/send`,
    method: 'POST',
    body: email,
    json: true
  })
}
