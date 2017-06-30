const mailgun = require('mailgun.js').client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
})

exports.send = async function (email, options) {
  const payload = {
    from: `${email.meta.from.name} <${email.meta.from.address}>`,
    to: email.to,
    cc: email.cc,
    bcc: email.bcc,
    subject: email.subject
  }

  payload[email['content-type'] === 'text/html' ? 'html' : 'text'] = email.body

  try {
    const response = await mailgun.messages.create(process.env.MAILGUN_API_DOMAIN, payload)
    return {
      success: true,
      messageId: response.id,
      code: 200,
      raw: response
    }
  } catch (error) {
    return {
      success: false,
      code: error.status,
      error
    }
  }
}
