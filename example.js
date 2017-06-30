require('dotenv').load()
const Queue = require('./lib/queue')
const Email = require('./lib/email')
const Sender = require('./lib/sender')
const queue = new Queue()

queue.on('completed', (job, result) => {
  console.log(result)
})

const email = Email.compose('Mandrill!', 'Dhi Aurrahman <dio@hooq.tv>')
  .to('Dhi Aurrahman <diorahman@gmail.com>')
  .cc('Dhi Aurrahman <diorahman@gmail.com>')
  .set('Content-Type', 'text/html')
  .write('<b>Great</b>')
  .toJSON()

queue.enqueue(email, Sender.Service.MAILGUN)
queue.enqueue(email, Sender.Service.MANDRILL)
queue.enqueue(email, Sender.Service.SENDGRID)
