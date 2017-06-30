const request = require('request-promise')
const key = process.env.MANDRILL_API_KEY
const url = `https://mandrillapp.com/api/1.0/messages/send.json`

exports.send = async function (email, options) {
  const payload = {
    message: {
      from_email: email.meta.from.address,
      from_name: email.meta.from.name,
      subject: email.subject,
      to: []
    },
    async: true
  }

  payload.message[email['content-type'] === 'text/html' ? 'html' : 'text'] = email.body

  payload.message.to = payload.message.to.concat(recipients(email.meta.recipients, 'to'))
  payload.message.to = payload.message.to.concat(recipients(email.meta.recipients, 'cc'))
  payload.message.to = payload.message.to.concat(recipients(email.meta.recipients, 'bcc'))

  const body = Object.assign(payload, {key})

  try {
    let response = await request({method: 'POST', url, body, json: true})
    response = Array.isArray(response) ? response.pop() : response
    return {
      id: email.id,
      success: true,
      messageId: response._id,
      code: 200,
      raw: response
    }
  } catch (error) {
    return {
      id: email.id,
      success: false,
      code: error.statusCode,
      error
    }
  }
}

function recipients (data, type) {
  const source = data[type] || []
  return source.map((e) => {
    return {
      email: e.address,
      name: e.name,
      type
    }
  })
}
