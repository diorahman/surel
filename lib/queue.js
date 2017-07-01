const debug = require('debug')('queue')
const Queue = require('bull')
const Sender = require('./sender')
const EventEmitter = require('events').EventEmitter
const emailQueue = new Queue('emails')

module.exports = class SendingEmailQueue extends EventEmitter {
  constructor () {
    super()
    emailQueue.on('completed', (job, result) => {
      this.emit(`${result.id}-completed`, job, result)
    })

    emailQueue.on('failed', (job, err) => {
      this.emit(`${job.data.email.id}-completed`, job, err)
    })
  }

  enqueue (email, serviceName, options = {}) {
    debug('enqueuing...')
    const opts = Object.assign(options, {jobId: email.id})
    emailQueue.add({email, serviceName, opts}, opts)
  }
}

emailQueue.process(function (job) {
  const {email, serviceName, options} = job.data
  return Sender.send(email, serviceName, options)
})
