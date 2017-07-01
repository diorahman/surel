const debug = require('debug')('services:mailgun')
const next = require('../next')
const mailgun = require('mailgun.js').client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
})

const service = 'mailgun'

exports.send = async function (email, options) {
  const payload = {
    from: `${email.meta.from.name} <${email.meta.from.address}>`,
    to: email.to,
    cc: email.cc,
    bcc: email.bcc,
    subject: email.subject
  }

  payload[email['content-type'] === 'text/html' ? 'html' : 'text'] = email.body

  debug(`${service} payload\n${JSON.stringify(payload, null, 2)}`)

  try {
    const response = await mailgun.messages.create(process.env.MAILGUN_API_DOMAIN, payload)
    return {
      id: email.id,
      success: true,
      messageId: response.id,
      code: 200,
      raw: response,
      service
    }
  } catch (error) {
    return {
      id: email.id,
      success: false,
      code: error.status,
      error,
      service,
      next: next(service)
    }
  }
}
