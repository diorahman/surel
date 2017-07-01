const debug = require('debug')('sender')
const fs = require('fs')
const path = require('path')

exports.Service = populate(fs.readdirSync(path.join(__dirname, 'services')))

exports.Policy = {
  QUEUE: 'queue', // if scheduled, then use queue facility
  SERVICE: 'service' // if scheduled, then use service facility
}

// interface SendOptions {
// sendAt?: Date || new Date()
// via?: string || 'queue'
//
exports.send = async function (email, serviceName, options) {
  debug('sending...')
  if (typeof serviceName !== 'string') {
    options = serviceName
    serviceName = 'sendgrid'
  }

  if (!exports.Service[serviceName.toUpperCase()]) {
    return {
      id: email.id,
      success: false,
      error: new Error(`${serviceName} is not supported`),
      service: serviceName
    }
  }

  const service = require(`./services/${serviceName}`)
  return service.send(email, options)
}

function populate (names = []) {
  const result = {}
  names.forEach((name) => {
    const key = name.indexOf('.') > 0 ? name.split('.')[0] : name
    result[key.toUpperCase()] = key
  })

  return result
}
