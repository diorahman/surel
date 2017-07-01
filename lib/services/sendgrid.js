const debug = require('debug')('services:sendgrid')
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
const next = require('../next')
const service = 'sendgrid'

exports.send = async function (email, options) {
  const transformed = transform(email)

  debug(`${service} payload:\n ${JSON.stringify(transformed, null, 2)}`)

  const request = sg.emptyRequest(transformed)

  try {
    const {statusCode, headers} = await sg.API(request)
    return {
      id: email.id,
      success: true,
      messageId: headers['x-message-id'],
      code: statusCode,
      raw: {
        statusCode,
        headers
      },
      service
    }
  } catch (error) {
    error.info = {
      id: email.id,
      next: next(service),
      statusCode: error.response.statusCode,
      detail: error.response.body.errors,
      retry: error.status !== 400,
      service
    }
    throw error
  }
}

function transform (data) {
  const options = {
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [],
      from: {},
      content: [{
        type: data['content-type'],
        value: data.body
      }]
    }
  }

  options.body.from.email = data.meta.from.address
  options.body.from.name = data.meta.from.name

  const personalization = {
    subject: data.subject
  }

  const tos = data.to.concat(data.cc).concat(data.bcc)

  personalization.to = recipients(data.meta.recipients.to)

  if (data.cc.length > 0) {
    personalization.cc = recipients(data.meta.recipients.cc, tos)
    if (personalization.cc.length === 0) {
      delete personalization.cc
    }
  }

  if (data.bcc.length > 0) {
    personalization.bcc = recipients(data.meta.recipients.bcc, tos)
    if (personalization.bcc.length === 0) {
      delete personalization.bcc
    }
  }

  options.body.personalizations.push(personalization)

  return options
}

function recipients (arr, tos = []) {
  return arr.filter((email) => {
    return tos.indexOf(email.address) < 0
  }).map((email) => {
    return {
      name: email.name,
      email: email.address
    }
  })
}
