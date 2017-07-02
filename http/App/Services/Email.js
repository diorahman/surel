const request = require('request-promise')

exports.send = async function (email) {
  const {body, statusCode} = await request({
    url: `${process.env.API_ROOT_URL}/v1/email/send`,
    method: 'POST',
    body: email,
    json: true,
    simple: false,
    resolveWithFullResponse: true
  })

  if (Array.isArray(body.errors)) {
    const {next} = body.errors[0]
    // FIXME: should consider retry too
    if (email.fallback) {
      email.service = next
      return request({
        url: `${process.env.API_ROOT_URL}/v1/email/send`,
        method: 'POST',
        body: email,
        json: true,
        simple: false,
        resolveWithFullResponse: true
      })
    }
  }

  return {body, statusCode}
}
