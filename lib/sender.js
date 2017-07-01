const fs = require('fs')
const path = require('path')
const assert = require('assert')

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
  if (typeof serviceName !== 'string') {
    options = serviceName
    serviceName = 'sendgrid'
  }

  if (!exports.Service[serviceName.toUpperCase()]) {
    throw new Error(`'${serviceName}' is not supported!`)
  }

  try {
    const service = require(`./services/${serviceName}`)
    assert(service)
    assert(typeof service.send === 'function')
    return await service.send(email, options)
  } catch (error) {
    return {
      id: email.id,
      success: false,
      error,
      service: serviceName
    }
  }
}

function populate (names = []) {
  const result = {}
  names.forEach((name) => {
    const key = name.indexOf('.') > 0 ? name.split('.')[0] : name
    result[key.toUpperCase()] = key
  })

  return result
}
