const debug = require('debug')('queue')
const Queue = require('bull')
const Sender = require('./sender')
const EventEmitter = require('events').EventEmitter
const emailQueue = new Queue('email sending')

module.exports = class SendingEmailQueue extends EventEmitter {
  constructor () {
    super()
    emailQueue.on('completed', (job, result) => {
      this.emit(`${result.id}-completed`, job, result)
    })
  }

  enqueue (email, serviceName, options) {
    debug('enqueuing...')
    emailQueue.add({email, serviceName, options})
  }
}

emailQueue.process(function (job) {
  const {email, serviceName, options} = job.data
  return Sender.send(email, serviceName, options)
})
