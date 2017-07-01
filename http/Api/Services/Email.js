const Queue = require('../../../lib/queue')
const Email = require('../../../lib/email')
const Sender = require('../../../lib/sender')
const queue = new Queue()

exports.send = function (data, service = Sender.Service.SENDGRID) {
  const email = Email.compose(data.subject, data.from, data.id)
    .to(data.to)

  if (data.cc) {
    email.cc(data.cc)
  }

  if (data.bcc) {
    email.bcc(data.bcc)
  }

  if (data.contentType) {
    email.set('Content-Type', data.contentType)
  }

  email.write(data.body)

  queue.enqueue(email.toJSON(), service)

  return new Promise((resolve, reject) => {
    // This is not an elegant solution, but it works for now.
    // Sending out the result via SSE asynchronously could be
    // better than this.
    queue.once(`${email.id}-completed`, (job, result) => {
      // Check for error
      if (result instanceof Error) {
        return reject(result)
      }
      resolve(result)
    })
  })
}
